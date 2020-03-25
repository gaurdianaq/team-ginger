from __future__ import absolute_import, unicode_literals
import json
import praw
import requests
import os
from server.mentions_crawler_celery.models.Mention import Mention
from .constants import REDDIT, RESPONSE_URL, SCHEDULE_TIME, CRAWLER_QUEUE_NAME
from ..constants import MENTIONS_TAG, SITE_TAG, USER_ID_TAG, COMPANY_ID_TAG, COMPANY_NAME_TAG
from .celery import app
from celery.exceptions import CeleryError

_reddit = praw.Reddit(client_id=os.environ["REDDIT_CLIENT_ID"],
                      client_secret=os.environ["REDDIT_CLIENT_SECRET"],
                      user_agent=os.environ["REDDIT_USER_AGENT"])


@app.task(name="reddit.search")
def search(user_id: int, companies: list, cookies: dict, first_run: bool):
    #  get all company names associated with a user
    mentions = []  # initialize mentions as a list
    for company in companies:
        if first_run:
            submissions = _reddit.subreddit("all").search('"' + company[COMPANY_NAME_TAG] + '"', time_filter="week")
        else:
            submissions = _reddit.subreddit("all").search('"' + company[COMPANY_NAME_TAG] + '"', time_filter="hour")
        for submission in submissions:
            if submission.is_self and submission.over_18 is not True:
                mention = Mention(company[COMPANY_ID_TAG], submission.url,
                                  submission.selftext, submission.score, submission.created_utc,
                                  submission.title)
                mentions.append(json.dumps(mention.__dict__))
    payload = {USER_ID_TAG: user_id, SITE_TAG: REDDIT, MENTIONS_TAG: mentions}
    requests.post(RESPONSE_URL, json=payload, cookies=cookies)


def enqueue(user_id: int, companies: list, cookies: dict, first_run: bool):
    try:
        if first_run is True:
            result = search.apply_async((user_id, companies, cookies, first_run), queue=CRAWLER_QUEUE_NAME)
        else:
            result = search.apply_async((user_id, companies, cookies, first_run), queue=CRAWLER_QUEUE_NAME,
                                        countdown=SCHEDULE_TIME)

    except CeleryError as e:  # might look into more specific errors later, but for now I just need to get this working
        print(e)
        return e
    return result
