from flask import Blueprint, request, current_app
from datetime import datetime, timezone
from ..models.mention import Mention
from ..models.user import MentionUser
from ..models.site import SiteAssociation
from ..responses import data_response, unauthorized_response
from ...constants import TOKEN_TAG, EPOCH, WEEK_IN_SECONDS, WARN_TAG, MENTIONS_TAG, EMPTY_TAG,\
    URL_TAG, SITE_TAG, TITLE_TAG, SNIPPET_TAG
from jwt.exceptions import InvalidTokenError
import jwt

email_bp = Blueprint("email", __name__, url_prefix="/")


@email_bp.route("/email", methods=["GET"])
def get_email_mentions():
    print("entered email task")
    token = request.cookies.get(TOKEN_TAG)
    if token is not None:
        try:
            jwt.decode(token, current_app.secret_key)
        except InvalidTokenError:
            return unauthorized_response("You're not authorized to clean the database!")
        users = MentionUser.query.all()
        output = {}
        current_time = (datetime.now().replace(tzinfo=timezone.utc) - EPOCH).total_seconds()
        for user in users:
            output_mentions = []
            assoc = SiteAssociation.query.filter_by(mention_user_id=user.id).all()
            mentions = Mention.query.order_by(Mention.hits.desc()). \
                filter_by(mention_user_id=user.id). \
                filter(Mention.date > current_time - WEEK_IN_SECONDS).limit(7).all()
            if mentions is not None:
                for mention in mentions:
                    if mention.site_id == "Reddit":
                        output_mention = {
                            URL_TAG: mention.url,
                            SITE_TAG: mention.site_id,
                            TITLE_TAG: mention.title,
                            SNIPPET_TAG: mention.snippet,
                            "Reddit": True
                        }
                    elif mention.site_id == "Twitter":
                        output_mention = {
                            URL_TAG: mention.url,
                            SITE_TAG: mention.site_id,
                            TITLE_TAG: mention.title,
                            SNIPPET_TAG: mention.snippet,
                            "Twitter": True
                        }
                    output_mentions.append(output_mention)
                if assoc is None:
                    output[user.email] = {WARN_TAG: True, MENTIONS_TAG: output_mentions, EMPTY_TAG: False}
                else:
                    output[user.email] = {WARN_TAG: False, MENTIONS_TAG: output_mentions, EMPTY_TAG: False}
            else:
                if assoc is None:
                    output[user.email] = {WARN_TAG: True, EMPTY_TAG: True}
                else:
                    output[user.email] = {WARN_TAG: False, EMPTY_TAG: True}
        return data_response(output)
    return unauthorized_response("No token provided!")
