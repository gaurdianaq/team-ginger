from .celery import app
from ..constants import TOKEN_TAG
from .constants import DB_CLEAN_URL
from requests import post


@app.task(name="db.clean")
def clean_db(token: str):
    cookies = {TOKEN_TAG: token}
    clean_db_request = post(DB_CLEAN_URL, cookies=cookies)
    return clean_db_request.status_code
