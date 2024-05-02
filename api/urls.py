from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve as mediaserve
from api.views import  *
from api.serializers import *
from django.urls import path, re_path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from account_app.views import *
from django_email_verification import urls as email_urls
from rest_framework_simplejwt import views as jwt_views




urlpatterns = [
    #API
    path('canvas/', AllCanvasView.as_view(), name='canvas_view'),
    path('canvas/<slug>/', CanvasView.as_view(), name='canvas_view'),
    path('signup/', UserRegister.as_view(), name='api_auth'),
    path('login/', UserLogin.as_view(), name='api_login'),
    path('logout/', UserLogout.as_view(), name='api_logout'),
    path('user/', UserView.as_view(), name='user'),
    path('user/<pk>/', UserApiUpdate.as_view(), name='user_update'),
    path('font/', FontUploadView.as_view(), name='font_upload'),


    path('google/login/', google_login, name='login'),
    path('google/callback/', google_callback, name='login_callback'),

    #JWT
    path('token/', jwt_views.TokenObtainPairView.as_view(), name ='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name ='token_refresh'),

    #Swagger
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    #Spotify
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('current-song', CurrentSong.as_view()),
]




