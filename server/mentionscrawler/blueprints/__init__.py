from .user import user_bp
from .session import session_bp
from .site import site_bp
from .mention import mention_bp
from .company import company_bp


# array of blueprints to be added to the app
# saves a bit of time on boilerplate code
blueprints = [user_bp, session_bp, mention_bp, site_bp, company_bp]
