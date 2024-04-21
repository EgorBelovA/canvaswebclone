from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.urls import path, re_path
from api.consumer import CanvasConsumer

websocket_urlpatterns = [
    re_path(r'socket-server/(?P<slug>[\w-]+)/$', CanvasConsumer.as_asgi())
]