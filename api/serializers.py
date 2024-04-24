from rest_framework import serializers
from .models import *

class CanvasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Canvas 
        fields = ('__all__')


class CanvasElementSerializer(serializers.ModelSerializer):
    class Meta:
        model = CanvasElement 
        fields = ('__all__')