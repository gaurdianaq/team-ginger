# Some convenience functions to ensure consistent response data (no typos in response tags)
from flask import make_response, jsonify, current_app
from ..authentication.token import generate_token

_RESPONSE_TAG = 'response'

TOKEN_TAG = "mentions_crawler_token"
EXPECTED_JSON = "Expected to receive json, did not get json!"


def bad_request_response(message: str):
    response = make_response(jsonify({_RESPONSE_TAG: message}), 400)
    return response


def created_response(message: str, email: str):
    response = make_response(jsonify({_RESPONSE_TAG: message}), 201)
    response.set_cookie(TOKEN_TAG, generate_token(current_app.secret_key, email))
    return response


def ok_response(message: str):
    response = make_response(jsonify({_RESPONSE_TAG: message}), 200)
    return response


def error_response(message: str):
    response = make_response(jsonify({_RESPONSE_TAG: message}), 500)
    return response


def unauthorized_response(message: str):
    response = make_response(jsonify({_RESPONSE_TAG: message}), 401)
    return response


def token_response(message: str, email: str):
    response = make_response(jsonify({_RESPONSE_TAG: message}), 200)
    response.set_cookie(TOKEN_TAG, generate_token(current_app.secret_key, email))
    return response