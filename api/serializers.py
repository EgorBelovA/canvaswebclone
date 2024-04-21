from rest_framework import serializers
from .models import *

class CanvasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Canvas 
        fields = ('__all__')