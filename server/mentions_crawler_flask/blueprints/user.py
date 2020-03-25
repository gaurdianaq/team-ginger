from flask import Blueprint, request
from werkzeug.security import generate_password_hash
from ...constants import EMAIL_TAG, PASSWORD_TAG, USER_ID_TAG, COMPANIES_TAG
from ..authentication.authenticate import enforce_json, authenticate
from ..models.user import MentionUser
from ..models.company import Company
from ..models.site import get_sites
from ..db import insert_row, commit
from ..responses import bad_request_response, ok_response, created_response
from server.mentions_crawler_celery.email import welcome_email, weekly_email

user_bp = Blueprint("users", __name__, url_prefix="/")


@user_bp.route("/users", methods=["POST"])
@enforce_json()
def add():
    body = request.get_json()
    if EMAIL_TAG in body and COMPANIES_TAG in body and PASSWORD_TAG in body:
        if len(body.get(PASSWORD_TAG)) < 7:
            return bad_request_response("Password too short! Must be greater than 6 characters!")
        new_user = MentionUser(body.get(EMAIL_TAG).lower(), generate_password_hash(body.get(PASSWORD_TAG)))
        result = insert_row(new_user)
        if result is not True:
            return result
    else:
        return bad_request_response("Invalid request! Missing fields!")
    new_company = Company(new_user.id, body.get(COMPANIES_TAG))
    result = insert_row(new_company)
    if result is not True:
        return result

    # Send welcome email
    welcome_email(new_user.email, new_company.name)

    return created_response("Account successfully created!", new_user.email, [new_company.name],
                            new_user.id, get_sites())


@user_bp.route("/users", methods=["PUT"])
@enforce_json()
@authenticate()
def update(user):
    body = request.get_json()
    if body.get(EMAIL_TAG):
        if MentionUser.query.filter_by(email=body.get(EMAIL_TAG)).count() == 0:
            _user = MentionUser.query.filter_by(id=user.get(USER_ID_TAG)).first()
            _user.email = body.get(EMAIL_TAG)
            result = commit()
            if result is not True:
                return result
        else:
            return bad_request_response("Email is in use!")
    else:
        return bad_request_response("Invalid request! Missing fields!")
    return ok_response("Email changed!")


@user_bp.route("/users", methods=["DELETE"])
@enforce_json()
@authenticate()
def delete(user):
    return "DELETED! (not really though)"


