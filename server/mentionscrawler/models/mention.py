from ..db import db

# TODO Add date field


class Mention(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    mention_user_id = db.Column(db.Integer, db.ForeignKey("mention_user.id"), nullable=False)
    site_id = db.Column(db.String(50), db.ForeignKey("site.name"), nullable=False)
    url = db.Column(db.Text, nullable=False)
    # Not every mention will have an article title, such as facebook or twitter, I think?
    title = db.Column(db.Text, nullable=True)
    snippet = db.Column(db.Text, nullable=False)
    hits = db.Column(db.Integer, nullable=False)

    def __init__(self, mention_user_id: int, site_id: str, url: str, snippet: str, hits: int, title=None):
        self.mention_user_id = mention_user_id
        self.site_id = site_id
        self.url = url
        self.snippet = snippet
        self.hits = hits
        self.title = title
