from flask import request, current_app
from .token import decode_token
from jwt.exceptions import InvalidTokenError
from functools import wraps
from ..responses import unauthorized_response, error_response, bad_request_response, EXPECTED_JSON, TOKEN_TAG


def enforce_json():
    def wrap(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            if not request.is_json:
                return bad_request_response(EXPECTED_JSON)
            return fn(*args, **kwargs)
        return wrapper
    return wrap


def authenticate():
    def wrap(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            auth_token = request.cookies.get(TOKEN_TAG)
            if auth_token:
                try:
                    user = decode_token(current_app.secret_key, auth_token)
                except InvalidTokenError:
                    return unauthorized_response("Invalid token")
                return fn(user=user, *args, **kwargs)
            return error_response("No user logged in. Please log in again.", "Unauthorized")
        return wrapper
    return wrap
