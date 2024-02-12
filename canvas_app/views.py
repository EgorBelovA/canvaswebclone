from django.shortcuts import render, redirect, reverse
from django.http import HttpResponse, HttpResponseNotFound, JsonResponse, HttpResponseRedirect


def index(request):
    return HttpResponse("Hello")
