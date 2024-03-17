from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from django.views.generic import TemplateView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('canvas_app.urls')),
    path('', include('frontend.urls')),

]

handler404 = "frontend.views.pageError"
handler500 = "frontend.views.pageError500"
handler403 = "frontend.views.pageError"
handler400 = "frontend.views.pageError"