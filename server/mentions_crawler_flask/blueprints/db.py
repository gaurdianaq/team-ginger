from flask import Blueprint, request, current_app
from ..db import delete_rows
from ..models.mention import Mention
from datetime import datetime, timezone
from ..responses import ok_response, unauthorized_response
from ...constants import TOKEN_TAG, EPOCH, MONTH_IN_SECONDS
from jwt.exceptions import InvalidTokenError
import jwt

db_bp = Blueprint("database", __name__, url_prefix="/db")


@db_bp.route("/clean", methods=["POST"])
def clean_db():
    print("entered clean db method")
    token = request.cookies.get(TOKEN_TAG)
    if token is not None:
        try:
            jwt.decode(token, current_app.secret_key)
        except InvalidTokenError:
            return unauthorized_response("You're not authorized to clean the database!")
        current_time = (datetime.now().replace(tzinfo=timezone.utc) - EPOCH).total_seconds()
        mentions = Mention.query.filter(Mention.date < current_time-MONTH_IN_SECONDS & Mention.favourite is False).all()
        result = delete_rows(mentions)
        if result is True:
            return ok_response("Cleaned the DB Successfully!")
        return result
    return unauthorized_response("You're not authorized to clean the database!")
