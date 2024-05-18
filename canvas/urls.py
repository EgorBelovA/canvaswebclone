from django.contrib import admin
from django.urls import path, re_path
from django.conf.urls import include
from django.views.generic import TemplateView

from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve as mediaserve

from account_app.views import *

from django_email_verification import urls as email_urls

from django.shortcuts import render

def index_view(request):
    return render(request, 'dist/index.html')

urlpatterns = [
    # path("__debug__/", include("debug_toolbar.urls")),

    path('accounts/', include('social_django.urls', namespace='social')),
    path('email/', include(email_urls), name='email-verification'),


    re_path(r'^canvas/', index_view, name='index'),
    path('', index_view, name='index'),
    path('email-verification/', index_view, name='email-verification-sent'),
    path('signup/', index_view, name='signup'),
    path('login/', index_view, name='login'),
    path('logout/', index_view, name='logout'),
    path('dashboard/', index_view, name='dashboard'),
    path('choose-county-region/', index_view, name='choose-county-region'),
    path('legal/privacy-policy/', index_view, name='privacy-policy'),
    path('legal/terms-and-conditions/', index_view, name='terms-and-conditions'),
    path('legal/', index_view, name='legal'),
    path('premium/', index_view, name='premium'),
    path('contacts/', index_view, name='contact'),
    path('pixel-battle/', index_view, name='pixel-battle'),
    path('profile/', index_view, name='profile'),
    path('jwt/auth/', index_view, name='jwt-auth'),
    path('download/', index_view, name='download'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


handler404 = "api.views.pageError"
handler500 = "api.views.pageError500"
handler403 = "api.views.pageError"
handler400 = "api.views.pageError"