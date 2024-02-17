from django.contrib import admin
from django.urls import path
from django.conf.urls import include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('canvas_app.urls')),
    # path('', include('frontend.urls')),
    # path('api-auth/', include('rest_framework.urls'))
]