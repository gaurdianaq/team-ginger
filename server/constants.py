from datetime import datetime, timezone

# JSON Constants
MESSAGE_TAG = "message"
MENTIONS_TAG = "mentions"
USERS_TAG = "users"
SECRET_HASH_TAG = "secret_hash"
USER_ID_TAG = "user_id"
SITE_TAG = "site"
ID_TAG = "id"
COMPANY_ID_TAG = "company_id"
COMPANY_NAME_TAG = "company_name"
COMPANIES_TAG = "companies"
URL_TAG = "url"
SNIPPET_TAG = "snippet"
HITS_TAG = "hits"
DATE_TAG = "date"
TITLE_TAG = "title"
FAVOURITE_TAG = "favourite"
SENTIMENT_TAG = "sentiment"
EMAIL_TAG = "email"
PASSWORD_TAG = "password"
TOKEN_TAG = "mentions_crawler_token"
WARN_TAG = "warn"
EMPTY_TAG = "empty"
DELETED_TAG = "deleted"

# Socket Event Constants
UPDATE_EVENT_TAG = "update"
TOGGLE_EVENT_TAG = "toggle"
MENTIONS_EVENT_TAG = "mentions"
LOGIN_EVENT_TAG = "login"
DISCONNECT_EVENT_TAG = "disconnect"
SAVE_EVENT_TAG = "save"

# Will be used to authenticate requests on the scheduled tasks that can't receive a token
SECRET_KEY_TAG = "secret"

MONTH_IN_SECONDS = 2592000
WEEK_IN_SECONDS = 604800
EPOCH = datetime(1970, 1, 1).replace(tzinfo=timezone.utc)