from django.contrib.auth.backends import BaseBackend
import requests
from account_app import constants
from .models import CustomUser
from .serializers import *
# from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login


class GoogleAuthBackend(BaseBackend):
    """Custom Backend Server for Google auth"""
    def _get_access_token(self, code):
        """
        Return access_toke from code
        :param code: google Code from callback
        :return: User Instance
        """

        response = requests.post('https://oauth2.googleapis.com/token', data={
            "code": code,
            "client_id": constants.GOOGLE_CLIENT_ID,
            'client_secret': constants.GOOGLE_CLIENT_SECRET,
            "redirect_uri": constants.GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code"
        })
        return response.json().get('access_token')

    def get_user(self, email):
        """Returns a user instance """
        try:
            return CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return None

    def authenticate(self, username=None, password=None, code=None, **kwargs):
        """
        Authentication function for Custom google token verification
        parms:
            code - Google code received form view
        """
        if code:
            access_token = self._get_access_token(code)
            if access_token:
                google_user_details = requests.get(
                    f'https://www.googleapis.com/oauth2/v2/userinfo?access_token={access_token}')
                email = google_user_details.json().get('email')
                try:
                    user = CustomUser.objects.get(email=email)
                    return user
                except CustomUser.DoesNotExist:
                    first_name = google_user_details.json().get('given_name')
                    avatar = google_user_details.json().get('picture')
                    serializer = UserRegistrationSerializer(data={'email': email, 'first_name': first_name, 'password': None, 'avatar': avatar})
                    if serializer.is_valid(raise_exception=True):
                        user = serializer.create({'email': email, 'first_name': first_name, 'password': None, 'avatar': avatar})
                        return user
                    else:
                        return None
