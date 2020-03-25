from ..db import db


class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    mention_user_id = db.Column(db.Integer, db.ForeignKey("mention_user.id"), nullable=False)
    name = db.Column(db.String(50), nullable=False)

    def __init__(self, mention_user_id: int, name: str):
        self.mention_user_id = mention_user_id
        self.name = name

    def __repr__(self):
        return "mention_user_id: {}, name: {}".format(self.mention_user_id, self.name)
