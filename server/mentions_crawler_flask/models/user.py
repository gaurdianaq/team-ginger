from ..db import db
from ...constants import EMAIL_TAG, ID_TAG


class MentionUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)

    def __init__(self, email: str, password: str):
        self.email = email
        self.password = password

    def __repr__(self):
        return {ID_TAG: self.id, EMAIL_TAG: self.email}
