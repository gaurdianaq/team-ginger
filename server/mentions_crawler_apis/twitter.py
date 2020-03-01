from __future__ import absolute_import, unicode_literals
import json
import requests
from requests_oauthlib import OAuth1
from .Mention import Mention
from .constants import TWITTER, RESPONSE_URL, SCHEDULE_TIME
from ..constants import MENTIONS_TAG, SITE_TAG, USER_ID_TAG, COMPANY_ID_TAG, COMPANY_NAME_TAG
from .celery import app
from celery.exceptions import CeleryError
from datetime import datetime, date, timedelta, timezone

QUERY_TAG = "q"
UNTIL_TAG = "until"

STATUSES_TAG = "statuses"
TEXT_TAG = "text"
FAVOURITE_COUNT_TAG = "favorite_count"
CREATED_AT_TAG = "created_at"
FULL_TEXT_TAG = "full_text"
ENTITIES_TAG = "entities"
USER_TAG = "user"
TWITTER_URL = "https://twitter.com/"
SCREEN_NAME_TAG = "screen_name"
ID_STRING_TAG = "id_str"
TWEET_MODE_TAG = "tweet_mode"
EXTENDED_TAG = "extended"


def one_week_ago():
    return str(date.today() - timedelta(days=7))


def one_day_ago():
    return str(date.today() - timedelta(days=1))


def build_tweet_url(user_name: str, tweet_id: str):
    return TWITTER_URL+user_name+"/status/"+tweet_id


def month_to_num(month):
    if month == "Jan":
        return 1
    elif month == "Feb":
        return 2
    elif month == "Mar":
        return 3
    elif month == "Apr":
        return 4
    elif month == "May":
        return 5
    elif month == "Jun":
        return 6
    elif month == "Jul":
        return 7
    elif month == "Aug":
        return 8
    elif month == "Sep":
        return 9
    elif month == "Oct":
        return 10
    elif month == "Nov":
        return 11
    elif month == "Dec":
        return 12


def parse_twitter_date(tweet_date: str):
    tweet_dates = str.split(tweet_date)
    time = str.split(tweet_dates[3], ":")
    return datetime(int(tweet_dates[5]), month_to_num(tweet_dates[1]),
                    int(tweet_dates[2]), int(time[0]), int(time[1]), int(time[2]))


@app.task(name="twitter.search")
def search(user_id: int, companies: list, cookies: dict, first_run: bool):
    #  get all company names associated with a user
    api_url = "https://api.twitter.com/1.1/search/tweets.json"

    api_key = "cvk7jHmbc3Y08jLhrMnelgAeL"
    api_secret_key = "PQ4WXZmBBd6f9SyspCaCn1Q2xpdawTY2YnwqF7YfpdYni5jlg7"

    access_token = "125311068-VrV3rhIY01mWzFXLy6Xa0UvPFAhHZ4oC6rnf2Y5A"
    access_token_secret = "62lyn41C46GZ16RmHcEgI4f5VH3n4pdlQjKH790qh3khi"

    auth = OAuth1(api_key, api_secret_key,
                  access_token, access_token_secret)
    mentions = []  # initialize mentions as a list
    for company in companies:
        company_name = '"' + company[COMPANY_NAME_TAG] + '"'
        if first_run:
            params = {QUERY_TAG: company_name, TWEET_MODE_TAG: EXTENDED_TAG, UNTIL_TAG: one_week_ago()}
        else:
            params = {QUERY_TAG: company_name, TWEET_MODE_TAG: EXTENDED_TAG, UNTIL_TAG: one_day_ago()}
        tweets = requests.get(api_url, auth=auth, params=params)
        tweets_json = tweets.json()

        for tweet in tweets_json[STATUSES_TAG]:
            tweet_date = parse_twitter_date(tweet[CREATED_AT_TAG])
            tweet_date_unix_time = tweet_date.replace(tzinfo=timezone.utc).timestamp()
            url = build_tweet_url(tweet[USER_TAG][SCREEN_NAME_TAG], tweet[ID_STRING_TAG])
            text = tweet[FULL_TEXT_TAG]
            if tweet.get(FAVOURITE_COUNT_TAG) is not None:
                favourites = tweet[FAVOURITE_COUNT_TAG]
            else:
                favourites = 0
            mention = Mention(company[COMPANY_ID_TAG], url,
                              text, favourites, tweet_date_unix_time)
            mentions.append(json.dumps(mention.__dict__))
    payload = {USER_ID_TAG: user_id, SITE_TAG: TWITTER, MENTIONS_TAG: mentions}
    requests.post(RESPONSE_URL, json=payload, cookies=cookies)


def enqueue(user_id: int, companies: list, cookies: dict, first_run):
    try:
        if first_run is True:
            result = search.apply_async((user_id, companies, cookies, first_run))
        else:
            result = search.apply_async((user_id, companies, cookies, first_run),
                                        countdown=SCHEDULE_TIME)

    except CeleryError as e:  # might look into more specific errors later, but for now I just need to get this working
        print(e)
        return e
    return result