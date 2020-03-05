REDDIT = "Reddit"
TWITTER = "Twitter"
FACEBOOK = "Facebook"

_ISSUER = "Evan & Ryan"

RESPONSE_URL = "http://localhost:5000/jobs/responses"
COMPANIES_URL = "http://localhost:5000/companies"
DB_CLEAN_URL = "http://localhost:5000/db/clean"
EMAIL_URL = "http://localhost:5000/email"

CRAWLER_QUEUE_NAME = "crawlers"

_SCHEDULE_TIME = 1  # time between crawls in minutes
SCHEDULE_TIME = _SCHEDULE_TIME * 60  # time between crawls converted to seconds

WELCOME_SUBJECT = "Welcome to mentionscrawler"
MONTH_TAG = "month"
DAY_START_TAG = "dayStart"
DAY_END_TAG = "dayEnd"
