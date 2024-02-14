from django.contrib import admin
from django.urls import path, re_path

from canvas_app import views
from django.contrib.auth import views as auth_views

# from canvas_app.views import LoginUser, logout_user, RegisterUser
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve as mediaserve

urlpatterns = [
    path('', views.index, name='index'),
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