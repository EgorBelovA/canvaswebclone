from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError
from django_email_verification import send_email


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'
    def create(self, clean_data):
        user_obj = CustomUser.objects.create_user(email=clean_data['email'], password=clean_data['password'])
        user_obj.first_name = clean_data['first_name']
        user_obj.avatar = clean_data['avatar']
        # user_obj.is_active = False
        user_obj.save()
        # send_email(user_obj)
        user = authenticate(username=clean_data['email'], password=clean_data['password'])
        return user_obj


	
class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    def check_user(self, clean_data):
        user = authenticate(username=clean_data['email'], password=clean_data['password'])
        if not user:
            raise ValidationError('user not found')
        return user
    
class UserSerializer(serializers.ModelSerializer):
    	class Meta:
            model = CustomUser
            fields = '__all__'

