from rest_framework import serializers
from .models import *
from account_app.serializers import *

class FontSerializer(serializers.ModelSerializer):
    class Meta:
        model = Font
        fields = ('__all__')

class CanvasSerializer(serializers.ModelSerializer):
    permitted_users = UserSerializer(many=True)
    fonts = FontSerializer(many=True)

    class Meta:
        model = Canvas
        fields = ('__all__')


class CanvasElementSerializer(serializers.ModelSerializer):
    class Meta:
        model = CanvasElement 
        fields = ('__all__')

