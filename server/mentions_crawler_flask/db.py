from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError, DataError
from psycopg2.errorcodes import (UNIQUE_VIOLATION, FOREIGN_KEY_VIOLATION, STRING_DATA_RIGHT_TRUNCATION,
                                 NUMERIC_VALUE_OUT_OF_RANGE, NULL_VALUE_NOT_ALLOWED)
from .responses import bad_request_response

db = SQLAlchemy()

# All functions here must be called somewhere with app context

# Data Errors
_DATA_ERROR_KEY = "DATA_ERROR"
_STRING_DATA_RIGHT_TRUNCATION_KEY = "STRING_DATA_RIGHT_TRUNCATION"
_NUMERIC_VALUE_OUT_OF_RANGE_KEY = "NUMERIC_VALUE_OUT_OF_RANGE"
_NULL_VALUE_NOT_ALLOWED_KEY = "NULL_VALUE_NOT_ALLOWED"

# Integrity Errors
_INTEGRITY_ERROR_KEY = "INTEGRITY_ERROR"
_UNIQUE_VIOLATION_KEY = "UNIQUE_VIOLATION"
_FOREIGN_KEY_VIOLATION_KEY = "FOREIGN_KEY_VIOLATION"


# just commits whatever is in the session
def commit():
    try:
        db.session.commit()
        return True
    except DataError as e:
        if e.orig.pgcode == STRING_DATA_RIGHT_TRUNCATION:
            return bad_request_response({_STRING_DATA_RIGHT_TRUNCATION_KEY: e.orig.pgerror})
        elif e.orig.pgcode == NUMERIC_VALUE_OUT_OF_RANGE:
            return bad_request_response({_NUMERIC_VALUE_OUT_OF_RANGE_KEY: e.orig.pgerror})
        elif e.orig.pgcode == NULL_VALUE_NOT_ALLOWED:
            return bad_request_response({_NULL_VALUE_NOT_ALLOWED_KEY: e.orig.pgerror})
    except IntegrityError as e:
        if e.orig.pgcode == UNIQUE_VIOLATION:
            return bad_request_response({_UNIQUE_VIOLATION_KEY: e.orig.pgerror})
        elif e.orig.pgcode == FOREIGN_KEY_VIOLATION:
            return bad_request_response({_FOREIGN_KEY_VIOLATION_KEY: e.orig.pgerror})
        else:
            return bad_request_response({_INTEGRITY_ERROR_KEY: e.orig.pgerror})


def insert_row(row: object):
    try:
        db.session.add(row)
        db.session.commit()
        return True
    except DataError as e:
        if e.orig.pgcode == STRING_DATA_RIGHT_TRUNCATION:
            return bad_request_response({_STRING_DATA_RIGHT_TRUNCATION_KEY: e.orig.pgerror})
        elif e.orig.pgcode == NUMERIC_VALUE_OUT_OF_RANGE:
            return bad_request_response({_NUMERIC_VALUE_OUT_OF_RANGE_KEY: e.orig.pgerror})
        elif e.orig.pgcode == NULL_VALUE_NOT_ALLOWED:
            return bad_request_response({_NULL_VALUE_NOT_ALLOWED_KEY: e.orig.pgerror})
        else:
            return bad_request_response({_DATA_ERROR_KEY: e.orig.pgerror})
    except IntegrityError as e:
        if e.orig.pgcode == UNIQUE_VIOLATION:
            return bad_request_response({_UNIQUE_VIOLATION_KEY: e.orig.pgerror})
        elif e.orig.pgcode == FOREIGN_KEY_VIOLATION:
            return bad_request_response({_FOREIGN_KEY_VIOLATION_KEY: e.orig.pgerror})
        else:
            return bad_request_response({_INTEGRITY_ERROR_KEY: e.orig.pgerror})


def insert_rows(rows: list):
    try:
        for row in rows:
            db.session.add(row)
        db.session.commit()
        return True
    except DataError as e:
        if e.orig.pgcode == STRING_DATA_RIGHT_TRUNCATION:
            return bad_request_response({_STRING_DATA_RIGHT_TRUNCATION_KEY: e.orig.pgerror})
        elif e.orig.pgcode == NUMERIC_VALUE_OUT_OF_RANGE:
            return bad_request_response({_NUMERIC_VALUE_OUT_OF_RANGE_KEY: e.orig.pgerror})
        elif e.orig.pgcode == NULL_VALUE_NOT_ALLOWED:
            return bad_request_response({_NULL_VALUE_NOT_ALLOWED_KEY: e.orig.pgerror})
        else:
            return bad_request_response({_DATA_ERROR_KEY: e.orig.pgerror})
    except IntegrityError as e:
        if e.orig.pgcode == UNIQUE_VIOLATION:
            return bad_request_response({_UNIQUE_VIOLATION_KEY: e.orig.pgerror})
        elif e.orig.pgcode == FOREIGN_KEY_VIOLATION:
            return bad_request_response({_FOREIGN_KEY_VIOLATION_KEY: e.orig.pgerror})
        else:
            return bad_request_response({_INTEGRITY_ERROR_KEY: e.orig.pgerror})


def delete_row(row: object):
    try:
        db.session.delete(row)
        db.session.commit()
        return True
    except IntegrityError as e:
        if e.orig.pgcode == FOREIGN_KEY_VIOLATION:
            return bad_request_response({_FOREIGN_KEY_VIOLATION_KEY: e.orig.pgerror})
        else:
            return bad_request_response({_INTEGRITY_ERROR_KEY: e.orig.pgerror})


def delete_rows(rows: list):
    try:
        for row in rows:
            db.session.delete(row)
        db.session.commit()
        return True
    except IntegrityError as e:
        if e.orig.pgcode == FOREIGN_KEY_VIOLATION:
            return bad_request_response({_FOREIGN_KEY_VIOLATION_KEY: e.orig.pgerror})
        return bad_request_response({_INTEGRITY_ERROR_KEY: e.orig.pgerror})
