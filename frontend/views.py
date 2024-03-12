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


def index(request):
    return render(request, 'frontend/index.html')

class RegisterUser(DataMixin, CreateView):
    form_class = CustomUserCreationForm
    # fields = ('username', 'email', 'password', 'first_name')
    template_name = 'signup.html'
    success_url = reverse_lazy('index')

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        c_def = self.get_user_context(title="Registration")
        return dict(list(context.items()) + list(c_def.items()))

    # def form_valid(self, form):
    #     user = form.save()
    #     # login(self.request, user, backend='django.contrib.auth.backends.ModelBackend')
    #     login(self.request, user)
    #     return redirect('home')


class LoginUser(DataMixin, LoginView):
    form_class = AuthenticationForm
    template_name = 'login.html'
    success_url = reverse_lazy('home')

    def get_context_data(self, *, object_list = None, **kwargs):
        context = super().get_context_data(**kwargs)
        c_def = self.get_user_context(title="Login")
        return dict(list(context.items()) + list(c_def.items()))


def logout_user(request):
    logout(request)
    return redirect('login')