from django.shortcuts import render
from .models import *
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import LoginView
from .utils import *
from .forms import *
from django.contrib.auth import get_user_model
from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView
from django.shortcuts import render, redirect, reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django_email_verification import send_email
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework import permissions, status

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


# class RegisterUser(DataMixin, CreateView):
#     form_class = CustomUserCreationForm
#     # template_name = 'frontend/signup.html'
#     success_url = reverse_lazy('canvas')

#     def get_context_data(self, *, object_list=None, **kwargs):
#         context = super().get_context_data(**kwargs)
#         c_def = self.get_user_context(title="Registration")
#         return dict(list(context.items()) + list(c_def.items()))

#     def form_valid(self, form):
#         user = form.save()
#         user.is_active = False
#         send_email(user)
#         login(self.request, user, backend='django.contrib.auth.backends.ModelBackend')
#         return redirect('email-verification-sent')

# class LoginUser(DataMixin, LoginView):
#     form_class = AuthenticationForm
#     template_name = 'frontend/login.html'
#     success_url = reverse_lazy('canvas')

#     def get_context_data(self, *, object_list = None, **kwargs):
#         context = super().get_context_data(**kwargs)
#         c_def = self.get_user_context(title="Login")
#         return dict(list(context.items()) + list(c_def.items()))

# def logout_user(request):
#     logout(request)
#     return redirect('login')

# def email_verification(request):
#     return render(request, 'email/email-verification-sent.html')




from django.http.response import HttpResponseRedirect, HttpResponse
from django.shortcuts import redirect
from . import constants
from django.contrib.auth import authenticate, login
from .backends import GoogleAuthBackend
from django.contrib import messages
import rest_framework

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