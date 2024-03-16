from django.urls import path, include, re_path
from .views import *

urlpatterns = [
    path('', index, name='index'),
    path('canvas', index),
    path('signup/', RegisterUser.as_view(), name='signup'),
    path('login/', LoginUser.as_view(), name='login'),
    path('accounts/', include('social_django.urls', namespace='social')),
    re_path('logout', logout_user, name='logout'),
]

