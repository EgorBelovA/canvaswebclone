from pathlib import Path
import os.path

BASE_DIR = Path(__file__).resolve().parent.parent


SECRET_KEY = '!13t9(!iar0(xx=pa-_dnk$di&#^!wqfx5tur88qgiu_q3h6as'

DEBUG = True

ALLOWED_HOSTS = ["*"]


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'canvas_db',
        'USER': 'test',
        'PASSWORD': '1baba31mama211',
        'HOST': 'localhost',
        'PORT': '5433',
    }
}


STATIC_DIR = os.path.join(BASE_DIR, 'static')
STATICFILES = [STATIC_DIR]