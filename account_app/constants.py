import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")
GOOGLE_SCOPES = os.getenv("GOOGLE_SCOPES")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

GOOGLE_LOGIN_REDIRECT_URI = (f"https://accounts.google.com/o/oauth2/v2/auth?"
                             f"access_type=offline"
                             f"&response_type=code"
                             f"&state=api"
                             f"&redirect_uri={GOOGLE_REDIRECT_URI}"
                             f"&include_granted_scopes=true"
                             f"&client_id={GOOGLE_CLIENT_ID}"
                             f"&scope={GOOGLE_SCOPES}"
                             f"&openid")