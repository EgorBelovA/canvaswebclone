from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.urls import path
from canvas_app.consumer import CanvasConsumer

websocket_urlpatterns = [
    path('ws/', CanvasConsumer.as_asgi())
]