from __future__ import absolute_import, unicode_literals
from celery import Celery
from celery.schedules import crontab
from ..config import SECRET_KEY
from .constants import EMAIL_URL, DB_CLEAN_URL, _ISSUER, START_MONTH_TAG, END_MONTH_TAG, DAY_END_TAG, DAY_START_TAG
from ..constants import TOKEN_TAG, MENTIONS_TAG, WARN_TAG, EMPTY_TAG, SECRET_KEY_TAG
from requests import get, post
from datetime import date
from .email import weekly_email
from .utils import num_to_month, six_days_ago
import os
import jwt


app = Celery("server.mentions_crawler_celery", broker=os.environ["REDIS_URL"],
             include=["server.mentions_crawler_celery.reddit",
                      "server.mentions_crawler_celery.twitter",
                      "server.mentions_crawler_celery.db",
                      "server.mentions_crawler_celery.email"])


@app.task(name="db.clean")
def clean_db(token: str):
    cookies = {TOKEN_TAG: token}
    clean_db_request = post(DB_CLEAN_URL, cookies=cookies)
    return clean_db_request.status_code


@app.task(name="email.generate")
def generate_emails(token: str):
    cookies = {TOKEN_TAG: token}
    request = get(EMAIL_URL, cookies=cookies)
    data = request.json()
    day_start = six_days_ago().day
    day_end = date.today().day
    start_month = six_days_ago().month
    end_month = date.today().month
    if data is not None:
        for email in data:
            mentions = []
            empty = data[email][EMPTY_TAG]
            if data[email].get(MENTIONS_TAG) is not None:
                mentions = data[email].get(MENTIONS_TAG)
            template = {
                WARN_TAG: data[email][WARN_TAG],
                EMPTY_TAG: empty,
                START_MONTH_TAG: num_to_month(start_month),
                END_MONTH_TAG: num_to_month(end_month),
                DAY_START_TAG: day_start,
                DAY_END_TAG: day_end,
                MENTIONS_TAG: mentions
            }
            weekly_email(email, template)


@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    token = jwt.encode({"iss": _ISSUER, SECRET_KEY_TAG: os.environ["SCHEDULER_KEY"]}, SECRET_KEY, algorithm="HS256")\
        .decode("utf-8")
    sender.add_periodic_task(crontab(hour=0, minute=0, day_of_week=1), generate_emails.s(token))
    sender.add_periodic_task(crontab(hour=0, minute=0, day_of_month=1), clean_db.s(token))
