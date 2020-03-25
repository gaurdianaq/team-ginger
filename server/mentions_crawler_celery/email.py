from sendgrid import SendGridAPIClient
import os

SENDGRID_API_KEY = os.environ["SENDGRID_API_KEY"]
FROM_EMAIL = os.environ["FROM_EMAIL"]
WELCOME_SUBJECT = "Welcome to mentionscrawler"
WELCOME_TEMPLATE_ID = "d-13389ba4840944b48790d192e1f57da9"
WEEKLY_TEMPLATE_ID = "d-eae8dfe9140f4239b843e60a5dc3cd6e"


def welcome_email(email, company):
    message = {
        'personalizations': [
            {
                'to': [
                    {
                        'email': email
                    }
                ],
                'subject': 'Welcome to MentionsCrawler',
                "dynamic_template_data": {
                    "company": company,
                }
            }
        ],
        'from': {
            'email': FROM_EMAIL
        },
        'template_id': WELCOME_TEMPLATE_ID
        ,
    }
    sg = SendGridAPIClient(SENDGRID_API_KEY)
    sg.send(message)


def weekly_email(email,  data):
    message = {
        'personalizations': [
            {
                'to': [
                    {
                        'email': email
                    }
                ],
                'subject': 'Your Weekly Mentions',
                'dynamic_template_data': data
            }
        ],
        'from': {
            'email': FROM_EMAIL
        },
        'template_id': WEEKLY_TEMPLATE_ID
        ,
    }
    sg = SendGridAPIClient(SENDGRID_API_KEY)
    sg.send(message)


