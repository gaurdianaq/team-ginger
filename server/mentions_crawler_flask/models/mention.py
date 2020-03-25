from ..db import db
from ...constants import SNIPPET_TAG, URL_TAG, TITLE_TAG, SITE_TAG


class Mention(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    mention_user_id = db.Column(db.Integer, db.ForeignKey("mention_user.id"), nullable=False, index=True)
    site_id = db.Column(db.String(50), db.ForeignKey("site.name"), nullable=False)
    company = db.Column(db.Integer, nullable=False)
    url = db.Column(db.Text, nullable=False)
    # Not every mention will have an article title, such as facebook or twitter, I think?
    title = db.Column(db.Text, nullable=False)
    snippet = db.Column(db.Text, nullable=False)
    hits = db.Column(db.Integer, nullable=False)
    # using integer for now because the reddit api returns things in unix time
    date = db.Column(db.Integer, nullable=False)
    sentiment = db.Column(db.Float, nullable=False)
    favourite = db.Column(db.Boolean, nullable=False)

    def __repr__(self):
        return {URL_TAG: self.url, SITE_TAG: self.site_id, SNIPPET_TAG: self.snippet, TITLE_TAG: self.title}

    def __init__(self, mention_user_id: int, company: int, site_id: str, url: str, snippet: str,
                 hits: int, date: int, sentiment: float, favourite: bool = False, title: str = ""):
        self.mention_user_id = mention_user_id
        self.company = company
        self.site_id = site_id
        self.url = url
        self.snippet = snippet
        self.hits = hits
        self.sentiment = sentiment
        self.title = title
        self.date = date
        self.favourite = favourite
