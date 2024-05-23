from .models import *
from .utils import *
from .forms import *
from rest_framework.generics import UpdateAPIView
from django.shortcuts import redirect
from django.contrib.auth import login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *
from rest_framework.authentication import SessionAuthentication
from rest_framework import permissions, status
from django.shortcuts import redirect
from yookassa import Configuration
from yookassa.domain.common.user_agent import Version
from django.http.response import HttpResponseRedirect, HttpResponse
from django.shortcuts import redirect
from . import constants
from django.contrib.auth import login
from .backends import GoogleAuthBackend
from django.contrib import messages
from yookassa import Configuration, Payment, Webhook
import uuid



class UserRegister(APIView):
    permission_classes = [permissions.AllowAny,]
    def post(self, request):
        clean_data = request.data
        serializer = UserRegistrationSerializer(data=clean_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(clean_data)
        if user:
            return Response(status=status.HTTP_201_CREATED)
            # return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        data = request.data
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)
            login(request, user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class UserLogout(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def post(self, request):
        #   try:
        # refresh_token = request.data["refresh_token"]
        # token = RefreshToken(refresh_token)
        # token.blacklist()
        logout(request)
        return Response(status=status.HTTP_205_RESET_CONTENT)
        #   except Exception as e:
            #    return Response(status=status.HTTP_400_BAD_REQUEST)
        


class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request): 
        try:
            serializer = UserSerializer(request.user)
            return Response({'user': serializer.data}, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data)
        if serializer.is_valid():
            print(serializer)
            # serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#set only patch method

class UserApiUpdate(UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

class UserProfileApiUpdate(UpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

class UserEmailCheck(APIView):
    permission_classes = (permissions.AllowAny,)
    def get(self, request):
        email = request.GET.get('email', None)
        if CustomUser.objects.filter(email=email).exists():
            return Response({'exists': True}, status=status.HTTP_200_OK)
        else:
            return Response({'exists': False}, status=status.HTTP_200_OK)
        


def google_login(request):
    return HttpResponseRedirect(constants.GOOGLE_LOGIN_REDIRECT_URI)

def google_callback(request):
    if 'error' in request.GET:
        return redirect('login')

    if 'code' in request.GET:
        back = GoogleAuthBackend()
        user = back.authenticate(request, code=request.GET.get('code'))
        if user:
            login(request, user=user, backend='django.contrib.auth.backends.ModelBackend')
        else:
            messages.error(request, "You are not Authorized to Login ")
        return redirect('dashboard')
    



from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .serializers import *
from yookassa import Configuration
from django.shortcuts import get_object_or_404

Configuration.account_id = "your_shop_id"
Configuration.secret_key = "your_secret_key"






import json
from django.http import HttpResponse
from yookassa.domain.notification import WebhookNotification


class GetWebhookView(APIView):
    def post(self, request):
        # event_json = request.data  # Assuming YooKassa sends data in the request body
        # notification_object = WebhookNotification(event_json)
        # event = notification_object.object
        print("WEBHOOK", request.data)

        # Process the event and create a Subscription
        # subscription = Subscription.objects.create(
        #     user=event.user,
        #     plan=event.plan,
        #     yookassa_subscription_id=event.id,
        #     status=event.status
        # )

        # You can add more processing logic here if needed

        # Return a success response
        return Response({'message': 'Webhook received and processed successfully'}, status=200)


import yoomoney
api = yoomoney.Client(os.getenv('YOOMONEY_CLIENT_ID'))

import requests
from urllib.parse import urlencode
class CreatePaymentView(APIView):
    def get(self, request):
        client_id = os.getenv('YOOMONEY_CLIENT_ID')

        profile = UserProfile.objects.get(user=request.user)
        payment = Payment.objects.create(user=profile)

        quickpay = yoomoney.Quickpay(
            receiver = "410019020882354",
            quickpay_form="shop",
            targets="Sponsor this project",
            paymentType="SB",
            sum=2,
            label=payment.id,
        )

        return Response({'payment_form_url': quickpay.redirected_url})


import hmac 
import json 
import hashlib 
import requests

# class CreatePaymentView(APIView):
#     def post(self, request):
#         def sortDict(data: dict):
#             sorted_tuple = sorted(data.items(), key=lambda x: x[0]) 
#             return dict(sorted_tuple)

#         secretKey = os.environ['LAVAKASSA_SECRET_KEY']

#         # data = sortDict(request.data)
#         data = {
#             "account": "R11121755",
#             "amount": 2,
#             "order_id": 1,
#         }
#         jsonStr = json.dumps(data).encode()

#         sign = hmac.new(bytes(secretKey, 'UTF-8'), jsonStr, hashlib.sha256).hexdigest()

#         response = requests.post('https://api.lava.ru/business/', json=data, headers={'Signature': sign, "Accept": "application/json", "Content-Type": "application/json"})

#         return Response(response.json())

