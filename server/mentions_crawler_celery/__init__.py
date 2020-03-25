from ..constants import TOKEN_TAG, COMPANIES_TAG
from . import reddit
from . import twitter
from .constants import REDDIT, TWITTER, COMPANIES_URL
from .celery import app

import requests

enqueue_dict = {REDDIT: reddit.enqueue, TWITTER: twitter.enqueue}


def enqueue(site: str, user_id: int, token: str, first_run=True):
    cookies = {TOKEN_TAG: token}
    try:
        request = requests.get(COMPANIES_URL, cookies=cookies)
        if request.status_code == 200:
            try:
                companies = request.json().get(COMPANIES_TAG)
            except ValueError as e:
                print(e)
                return False

            return enqueue_dict[site](user_id, companies, cookies, first_run)
        else:
            print(request.text)
    except requests.RequestException as e:
        print(e)

    return False
