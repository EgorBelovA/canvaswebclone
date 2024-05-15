import os.path
from pathlib import Path
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

from dotenv import load_dotenv

load_dotenv()

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


INSTALLED_APPS = [
    'daphne',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'django.contrib.sites',
    'corsheaders',
    'drf_spectacular',
    'drf_spectacular_sidecar',
    # 'debug_toolbar',

    'social_django',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'django_email_verification',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',

    'api.apps.ApiConfig',
    'account_app.apps.AccountAppConfig',
]


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    "allauth.account.middleware.AccountMiddleware",
    'social_django.middleware.SocialAuthExceptionMiddleware',
    # 'debug_toolbar.middleware.DebugToolbarMiddleware',
]

# INTERNAL_IPS = ["127.0.0.1"]

ROOT_URLCONF = 'canvas.urls'

CORS_ALLOW_ALL_ORIGINS = True


# CORS_ALLOWED_ORIGINS = [
#     "http://127.0.0.1:8001",
#     "https://api.yookassa.ru",
# ]

# CORS_ORIGIN_WHITELIST = [
#     "http://127.0.0.1:8001",
#     # "https://api.yookassa.ru/v3/payments/' ",
# ]

SOCIAL_AUTH_URL_NAMESPACE = 'social'

LOGOUT_REDIRECT_URL = 'login'

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': [
            'profile',
            'email',
        ],
        'ADD': {
            'cliend_id': os.environ.get('SOCIALACCOUNT_PROVIDERS_CLIENT_ID'),
            'secret': os.environ.get('SOCIALACCOUNT_PROVIDERS_SECRET'),
            'key': '',
        },
        'AUTH_PARAMS': {
            'access_type': 'online',
        }
    }
}

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = os.environ.get('SOCIAL_AUTH_GOOGLE_OAUTH2_KEY')
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.environ.get('SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET')


AUTHENTICATION_BACKENDS = [
    'account_app.backends.GoogleAuthBackend',
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
    'social_core.backends.google.GoogleOAuth2',
]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication', 
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema', 
}

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

SIMPLE_JWT = {
    'AUTH_HEADER_TYPES': ('JWT',),
     'ACCESS_TOKEN_LIFETIME': timedelta(minutes=1),
     'REFRESH_TOKEN_LIFETIME': timedelta(minutes=1),
     'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
}

# BASE_FRONTEND_URL = os.environ.get('DJANGO_BASE_FRONTEND_URL', default='http://localhost:8001')

SPECTACULAR_SETTINGS = {
    'TITLE': 'Canvas API',
    'DESCRIPTION': 'Canvas docs',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'SWAGGER_UI_DIST': 'SIDECAR',
    'SWAGGER_UI_FAVICON_HREF': 'SIDECAR',
    'REDOC_DIST': 'SIDECAR',
}

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            # BASE_DIR / 'account_app' / 'templates',
            BASE_DIR.joinpath('canvas_app'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'social_django.context_processors.backends',
                'social_django.context_processors.login_redirect',
            ],
        },
    },
]


WSGI_APPLICATION = 'canvas.wsgi.application'
ASGI_APPLICATION = 'canvas.asgi.application'

AUTH_USER_MODEL = 'account_app.CustomUser'

CSRF_TRUSTED_ORIGINS = [os.environ.get("CSRF_TRUSTED_ORIGINS")]


CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [('127.0.0.1', 6379)]
        },
    },
}


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

SECRET_KEY = os.environ.get("SECRET_KEY")

DEBUG = True

# SESSION_COOKIE_HTTPONLY = False


STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, STATIC_URL)
STATIC_DIR = os.path.join(BASE_DIR, 'static')
STATICFILES = [STATIC_DIR]
STATICFILES_DIRS = (
    BASE_DIR.joinpath('canvas_app', 'dist'),
    BASE_DIR.joinpath('api'),
    BASE_DIR.joinpath('media/fonts'),
)

SITE_ID = 1

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

ALLOWED_HOSTS = ["*"]


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    },
    # 'default': {
    #     'ENGINE': 'django.db.backends.postgresql_psycopg2',
    #     'NAME': 'canvas_db',
    #     'USER': 'canvas_db',
    #     'PASSWORD': 'canvas_db',
    #     'HOST': 'localhost',
    #     'PORT': '5430',
    # },
}


def email_verified_callback(user):
    user.is_active = True


# def password_change_callback(user, password):
#     user.set_password(password)


# Global Package Settings
EMAIL_FROM_ADDRESS = os.environ.get('EMAIL_FROM_ADDRESS')
EMAIL_PAGE_DOMAIN = os.environ.get('EMAIL_PAGE_DOMAIN')  # mandatory (unless you use a custom link)
EMAIL_MULTI_USER = False  # optional (defaults to False)

# Email Verification Settings (mandatory for email sending)
EMAIL_MAIL_SUBJECT = 'Confirm your email {{ user.name }}'
EMAIL_MAIL_HTML = 'email/mail_body.html'
EMAIL_MAIL_PLAIN = 'email/mail_body.txt'
EMAIL_MAIL_TOKEN_LIFE = 60 * 60  # 1 hour

# Email Verification Settings (mandatory for builtin view)
EMAIL_MAIL_PAGE_TEMPLATE = 'email/email_success_template.html'
EMAIL_MAIL_CALLBACK = email_verified_callback

# Password Recovery Settings (mandatory for email sending)
# EMAIL_PASSWORD_SUBJECT = 'Change your password {{ user.username }}'
# EMAIL_PASSWORD_HTML = 'password_body.html'
# EMAIL_PASSWORD_PLAIN = 'password_body.txt'
# EMAIL_PASSWORD_TOKEN_LIFE = 60 * 10  # 10 minutes

# Password Recovery Settings (mandatory for builtin view)
# EMAIL_PASSWORD_PAGE_TEMPLATE = 'password_changed_template.html'
# EMAIL_PASSWORD_CHANGE_PAGE_TEMPLATE = 'password_change_template.html'
# EMAIL_PASSWORD_CALLBACK = password_change_callback


# For Django Email Backend
EMAIL_BACKEND = 'canvas.email_backend.EmailBackend'
EMAIL_HOST = os.environ.get('EMAIL_HOST')
EMAIL_PORT = os.environ.get('EMAIL_PORT')
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS = True
