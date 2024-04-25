
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'canvas.settings')
django.setup()

from channels.security.websocket import AllowedHostsOriginValidator
from api.consumer import CanvasConsumer
from django.urls import path, re_path
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': AllowedHostsOriginValidator(
        URLRouter([
            re_path(r'(?P<slug>\S+)/$', CanvasConsumer.as_asgi())
        ])
    )
})










