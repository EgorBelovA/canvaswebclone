from rest_framework import serializers
from .models import *
from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError
from django_email_verification import send_email
from django.core.files.storage import FileSystemStorage
from django.core.files.base import ContentFile
import os
import canvas.settings as settings
import random
from PIL import Image, ImageDraw, ImageFont
import uuid
import math



class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'
    def create(self, clean_data):
        user_obj = CustomUser.objects.create_user(email=clean_data['email'], password=clean_data['password'])
        user_obj.first_name = clean_data['first_name']

        if 'avatar' in clean_data:
            user_obj.avatar = clean_data['avatar']
        else:
            # hue = random.randint(0, 280)
            # saturation = random.randint(0, 50) + 50
            # lightness = random.randint(0, 50) + 50
            # r = round((lightness + (saturation * math.cos((hue/180)*math.pi)) / 2) * 255)
            # g = round((lightness + (saturation * math.sin(((hue - 120)/180)*math.pi)) / 2) * 255)
            # b = round((lightness + (saturation * math.sin(((hue - 240)/180)*math.pi)) / 2) * 255)
            fs = FileSystemStorage()
            file_name = f"{uuid.uuid4()}.jpg"
            img = Image.new("RGB", (200, 200), (random.randint(80, 160), random.randint(80, 160), random.randint(80, 160)))
            draw = ImageDraw.Draw(img)
            font = ImageFont.truetype("./account_app/Breath_Demo.ttf", 100)
            text = user_obj.first_name[0].upper()
            text_bbox = draw.textbbox((0, 0), text, font=font)
            text_width, text_height = text_bbox[2] - text_bbox[0], text_bbox[3] - text_bbox[1]
            center_x = (200 - text_width) // 2
            center_y = (200 - text_height) // 2
            draw.text((center_x, center_y), text, font=font, fill=(255, 255, 255))
            img.save(os.path.join(settings.MEDIA_ROOT, file_name))
            user_obj.avatar = fs.url(file_name)[6:]
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
    

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = '__all__'


class UserProfileSerializer(serializers.ModelSerializer):
    subscription = SubscriptionSerializer(read_only=True)
    class Meta:
        model = UserProfile
        fields = 'online', 'subscription', 'pk'

    
    
class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(source='userprofile', read_only=True)

    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'first_name', 'profile', 'avatar')





    
    
