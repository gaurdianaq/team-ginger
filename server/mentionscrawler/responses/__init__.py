# Some convenience functions to ensure consistent response data (no typos in response tags)
from flask import make_response, jsonify, current_app
from ..authentication.token import generate_token

_RESPONSE_TAG = "response"
_ERROR_TAG = "error"
_EMAIL_TAG = "email"
_COMPANY_NAMES_TAG = "names"
_SITES_TAG = "sites"

TOKEN_TAG = "mentions_crawler_token"
EXPECTED_JSON = "Expected to receive json, did not get json!"

Reddit = False
Twitter = False
Facebook = False


def bad_request_response(message):
    response = make_response(jsonify({_RESPONSE_TAG: message}), 400)
    return response


def created_response(message, email: str, companies: list, user_id: int, sites: dict):
    response = make_response(jsonify({_RESPONSE_TAG: message, _EMAIL_TAG: email, _COMPANY_NAMES_TAG: companies,
                                      _SITES_TAG: sites}), 201)
    response.set_cookie(TOKEN_TAG, generate_token(current_app.secret_key, email, user_id), httponly=True)
    return response


def ok_response(message):
    response = make_response(jsonify({_RESPONSE_TAG: message}), 200)
    return response


def error_response(message, error):
    response = make_response(jsonify({_RESPONSE_TAG: message}, {_ERROR_TAG: repr(error)}), 500)
    return response


def unauthorized_response(message):
    response = make_response(jsonify({_RESPONSE_TAG: message}), 401)
    return response


def token_response(message, email: str, companies: list, user_id: int, sites: dict):
    response = make_response(jsonify({_RESPONSE_TAG: message, _EMAIL_TAG: email, _COMPANY_NAMES_TAG: companies,
                                      _SITES_TAG: sites}), 200)
    response.set_cookie(TOKEN_TAG, generate_token(current_app.secret_key, email, user_id), httponly=True)
    return response


def logout_response(message):
    response = make_response(jsonify(message), 200)
    response.delete_cookie(TOKEN_TAG)
    return response

