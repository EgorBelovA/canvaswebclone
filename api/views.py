from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BaseAuthentication
from rest_framework.decorators import permission_classes
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, reverse
from rest_framework import status


# @permission_classes([IsAuthenticated])
class CanvasView(APIView):
    authentication_classes = [SessionAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    def get(self, request, *args, **kwargs):
        slug = kwargs.get("slug")
        canvas = Canvas.objects.get(slug=slug)
        if canvas.permitted_users.filter(id=request.user.id).exists():
            serializer = CanvasSerializer(canvas)
            return Response(serializer.data)
        return Response(status=status.HTTP_403_FORBIDDEN)
    
class AllCanvasView(APIView):
    authentication_classes = [SessionAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    def get(self, request):
        queryset = Canvas.objects.filter(permitted_users=request.user)
        serializer = CanvasSerializer(queryset, many=True)
        return Response(serializer.data)

    # @extend_schema(responses=CanvasSerializer)
    # def post(self, request):
    #     serializer = CanvasSerializer(data=request.data)
    #     if serializer.is_valid(raise_exception=True):
    #         serializer.save()


def pageError(request, exception):
    return redirect("index")


def pageError500(request):
    return redirect("index")