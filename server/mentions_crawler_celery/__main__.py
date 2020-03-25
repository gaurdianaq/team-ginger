from __future__ import absolute_import, unicode_literals
from .celery import app
from .constants import _ISSUER
from ..constants import SECRET_KEY_TAG
from ..config import SECRET_KEY
import os
import jwt


if __name__ == "__main__":
    app.start()
