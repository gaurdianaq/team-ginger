web: python -m server
worker: celery -A server.mentions_crawler_celery worker -B -l info -Q celery,crawlers