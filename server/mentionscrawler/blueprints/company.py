from flask import Blueprint, request
from ..models.company import Company
from ..db import insert_row, delete_row
from ..responses import bad_request_response, EXPECTED_JSON
from ..authentication.authenticate import authenticate, enforce_json

company_bp = Blueprint("companies", __name__, url_prefix="/")


# Route for updating company names
@company_bp.route("/companies", methods=["POST"])
@enforce_json()
@authenticate()
def company(user):
    return "SUCCESS!"
