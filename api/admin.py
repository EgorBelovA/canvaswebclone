from django.contrib import admin
from .models import *

admin.site.register(Canvas)
admin.site.register(CanvasElement)
admin.site.register(Font)
admin.site.register(Notification)
admin.site.register(VoiceRecord)
admin.site.register(Placemark)