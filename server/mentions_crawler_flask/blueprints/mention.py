from flask import Blueprint, request
from ...constants import URL_TAG, SITE_TAG, TITLE_TAG, SNIPPET_TAG, HITS_TAG, USER_ID_TAG, SENTIMENT_TAG, DATE_TAG, FAVOURITE_TAG, MESSAGE_TAG, DELETED_TAG
from ..authentication.authenticate import authenticate
from ..responses import data_response, pagination_response, not_found_response, bad_request_response
from ..models.mention import Mention
from ..models.company import Company
from ..db import commit, delete_row

mention_bp = Blueprint("mentions", __name__, url_prefix="/mentions")

MENTIONS_PER_PAGE = 20
ID_TAG = "id"
SORT_POPULAR_URL = "popular"
SORT_RECENT_URL = "recent"
SORT_FAVOURITE_URL = "favourite"
COMPANY_PREFIX = "company_"

SITES = ["Reddit", "Twitter"]


# Get a set of mentions specified by the page number given
@mention_bp.route("/<string:sort>/<int:page>", methods=["GET"])
@authenticate()
def get_mentions(user, sort, page):
    search = request.args.get("search")
    site_filter = []
    for site in SITES:
        filter = request.args.get(site)
        if filter is None:
            return bad_request_response("Invalid site parameters.")    
        elif filter == 'true':
            # Gather the sites we want
            site_filter.append(site)
        elif filter != 'false':
            return bad_request_response("Invalid site parameter value.")    

    name_filter = []
    companies = Company.query.filter_by(mention_user_id=user.get(USER_ID_TAG)).all()
    for company in companies:
        filter = request.args.get(f"{COMPANY_PREFIX}{company.name}")
        if filter is None:
            return bad_request_response("Invalid name parameters.")    
        elif filter == 'true':
            # Gather the companies we want
            name_filter.append(company.id)
        elif filter != 'false':
            return bad_request_response("Invalid name parameter value.")    
    
    # User has filtered out all names
    if len(name_filter) == 0:
        return pagination_response([], True)
    # User has filtered out all sites
    if len(site_filter) == 0:
        return pagination_response([], True)
    
    if sort == SORT_POPULAR_URL:
        all_mentions = Mention.query.order_by(Mention.hits.desc()).filter_by(mention_user_id=user.get(USER_ID_TAG))
    elif sort == SORT_RECENT_URL:
        all_mentions = Mention.query.order_by(Mention.date.desc()).filter_by(mention_user_id=user.get(USER_ID_TAG))
    elif sort == SORT_FAVOURITE_URL:
        all_mentions = Mention.query.filter_by(mention_user_id=user.get(USER_ID_TAG), favourite=True)
    else:
        return bad_request_response("Invalid search parameter value.")

    # Check if we need to filter by names
    if len(name_filter) != len(companies):
        all_mentions = all_mentions.filter(Mention.company.in_(name_filter))
    # Check if we need to filter by sites
    if len(site_filter) != len(SITES):
        all_mentions = all_mentions.filter(Mention.site_id.in_(site_filter))
    # Check if we need to filter by search
    if search is not None and search != "":
        all_mentions = all_mentions.filter((Mention.title.ilike(f"%{search}%")) | (Mention.snippet.ilike(f"%{search}%")))

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
            SENTIMENT_TAG: mention.sentiment,
            DATE_TAG: mention.date,
            FAVOURITE_TAG: mention.favourite
        }
        output_mentions.append(output_mention)
    # Let the client know if they reached the end of the mentions
    return pagination_response(output_mentions, len(output_mentions) == mentions_count)


# Get details of a single mention
@mention_bp.route("/mention/<int:mention_id>", methods=["GET"])
@authenticate()
def get_mention(user, mention_id: int):
    mention = Mention.query.filter_by(id=mention_id).first()
    if mention is None:
        return not_found_response("There is no mention with that ID")
    output_mention = {
        URL_TAG: mention.url,
        SITE_TAG: mention.site_id,
        TITLE_TAG: mention.title,
        SNIPPET_TAG: mention.snippet,
        HITS_TAG: mention.hits,
        SENTIMENT_TAG: mention.sentiment,
        DATE_TAG: mention.date,
        FAVOURITE_TAG: mention.favourite
    }
    return data_response(output_mention)


@mention_bp.route("favourite/<int:mention_id>", methods=["PATCH"])
@authenticate()
def favourite_mention(user, mention_id: int):
    mention = Mention.query.filter_by(id=mention_id).first()
    if mention is None:
        return not_found_response(f"No mention with id {mention_id}")
    company = Company.query.filter_by(id=mention.company).first()
    mention.favourite = not mention.favourite
    if company is not None:
        result = commit()
        deleted = False
    else:
        # if the company doesn't exist, then the mention will already have been favourited
        result = delete_row(mention)
        deleted = True
    if result is not True:
        return result
    if deleted:
        return data_response({MESSAGE_TAG: "Mention deleted", DELETED_TAG: True})
    if mention.favourite is True:
        return data_response({MESSAGE_TAG: "Mention favourited!", FAVOURITE_TAG: mention.favourite})
    return data_response({MESSAGE_TAG: "Mention removed from favourites!", FAVOURITE_TAG: mention.favourite})



