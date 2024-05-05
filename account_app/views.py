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
        print(clean_data)
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
from .models import Plan, Subscription
from .serializers import PlanSerializer, SubscriptionSerializer
from yookassa import Configuration
from django.shortcuts import get_object_or_404

Configuration.account_id = "your_shop_id"
Configuration.secret_key = "your_secret_key"



class PlanViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer



Configuration.account_id = os.getenv('YOOKASSA_ACCOUNT_ID')
Configuration.secret_key = os.getenv('YOOKASSA_SECRET_KEY')
Configuration.configure_user_agent(
    framework=Version('Django', '5.0.3'),
    cms=Version('Wagtail', '2.6.2'),
    module=Version('Y.CMS', '0.0.1')
)

import json
from django.http import HttpResponse
from yookassa.domain.notification import WebhookNotification


class GetWebhookView(APIView):
    def post(self, request):
        event_json = json.loads(request.body)
        notification_object = WebhookNotification(event_json)
        event = notification_object.object
        return HttpResponse(status=200)



class CreatePaymentView(APIView):
    def post(self, request):
        amount = request.data.get('amount')
        description = request.data.get('description')

        payment = Payment.create({
            "amount": {
                "value": "2.00",
                "currency": "RUB"
            },
            "confirmation": {
                "type": "redirect",
                "return_url": "http:127.0.0.1:8001/dashboard"
            },
            "capture": True,
            "description": "Заказ №1"
        }, uuid.uuid4())


        return Response({'payment_form_url': payment})



