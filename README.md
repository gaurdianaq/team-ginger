# flask-starter

## Starting the server:


1. Open a terminal and go to the server folder. Make sure you have **pipenv** installed (`pip install pipenv`)
2. Install the dependencies with `pipenv install`. This also create a a virtual environment, if there isn't one already
3. Activate the virtual environment `pipenv shell`
4. Ensure postgres & redis are installed
5. Ensure you're in the team-ginger folder
5. Run Celery `celery -A server.mentions_crawler_celery worker -B -l info -Q celery,crawlers`
6. Run Flask `python -m server`
