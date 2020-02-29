from flask import Blueprint
from ...json_constants import URL_TAG, SITE_TAG, TITLE_TAG, SNIPPET_TAG, HITS_TAG, USER_ID_TAG, SENTIMENT_TAG
from ..authentication.authenticate import authenticate
from ..responses import data_response, pagination_response, not_found_response
from ..models.mention import Mention

mention_bp = Blueprint("mentions", __name__, url_prefix="/")

MENTIONS_PER_PAGE = 20
ID_TAG = "id"


# Get a set of mentions specified by the page number given
@mention_bp.route("/mentions/<int:page>", methods=["GET"])
@authenticate()
def mention_response(user, page):
    all_mentions = Mention.query.filter_by(mention_user_id=user.get(USER_ID_TAG))
    mentions = all_mentions.limit(MENTIONS_PER_PAGE * page).all()
    mentions_count = all_mentions.count()
    output_mentions = []
    for mention in mentions:
        output_mention = {
            ID_TAG: mention.id,
            URL_TAG: mention.url,
            SITE_TAG: mention.site_id,
            TITLE_TAG: mention.title,
            SNIPPET_TAG: mention.snippet,
            HITS_TAG: mention.hits,
            SENTIMENT_TAG: mention.sentiment
        }
        output_mentions.append(output_mention)
    # Let the client know if they reached the end of the mentions
    return pagination_response(output_mentions, len(output_mentions) == mentions_count)


# Get details of a single mention
@mention_bp.route("/mentions/mention/<int:mention_id>", methods=["GET"])
@authenticate()
def get_mention(user, mention_id):
    mention = Mention.query.filter_by(id=mention_id).first()
    if mention is None:
        return not_found_response("There is no mention with that ID")
    output_mention = {
        URL_TAG: mention.url,
        SITE_TAG: mention.site_id,
        TITLE_TAG: mention.title,
        SNIPPET_TAG: mention.snippet,
        HITS_TAG: mention.hits,
        SENTIMENT_TAG: mention.sentiment
    }
    return data_response(output_mention)
