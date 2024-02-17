from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve as mediaserve
from canvas_app.views import  *
from canvas_app.serializers import *
from django.urls import path, re_path


urlpatterns = [
    path('canvas/', CanvasView.as_view(), name='canvas_view'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    urlpatterns += [
        re_path(f'^{settings.MEDIA_URL.lstrip("/")}(?P<path>.*)$',
            mediaserve, {'document_root': settings.MEDIA_ROOT}),
        re_path(f'^{settings.STATIC_URL.lstrip("/")}(?P<path>.*)$',
            mediaserve, {'document_root': settings.STATIC_ROOT}),
        ]


