import os

from channels.routing import ProtocolTypeRouter
from django.core.asgi import get_asgi_application

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from canvas_app.consumer import CanvasConsumer
from django.urls import path

import django
django.setup()
from canvas import routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'canvas.settings')

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': AllowedHostsOriginValidator(
        URLRouter([
            path('', CanvasConsumer.as_asgi())
        ])
    )
})










