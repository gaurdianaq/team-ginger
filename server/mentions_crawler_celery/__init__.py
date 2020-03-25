from ..constants import TOKEN_TAG, COMPANIES_TAG
from . import reddit
from . import twitter
from .constants import REDDIT, TWITTER, COMPANIES_URL
from .celery import app

import requests

enqueue_dict = {REDDIT: reddit.enqueue, TWITTER: twitter.enqueue}


def enqueue(site: str, user_id: int, token: str, host: str, first_run=True):
    print("Hmmmm")
    cookies = {TOKEN_TAG: token}
    try:
        print("trying")
        request = requests.get(host+COMPANIES_URL, cookies=cookies)
        print("so far so good")
        if request.status_code == 200:
            try:
                companies = request.json().get(COMPANIES_TAG)
            except ValueError as e:
                print(e)
                return False
            print("still going well")
            return enqueue_dict[site](user_id, companies, cookies, host, first_run)
        else:
            print(request.text)
    except requests.RequestException as e:
        print(e)

    return False
