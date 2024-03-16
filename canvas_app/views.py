from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample


class CanvasView(APIView):
    def get(self, request):
        output = [
            {
                'title': output.title,
                'slug': output.slug,
                'time_created': output.time_created,
            } for output in Canvas.objects.all()
        ]
        return Response(output)

    @extend_schema(responses=CanvasSerializer)
    def post(self, request):
        serializer = CanvasSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()