from django.urls import path
from .views import  *
from frontend import views

urlpatterns = [
    path('canvas', views.index)
]