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
from django.core.files.storage import FileSystemStorage
import base64
import PIL
import json
from rest_framework.generics import UpdateAPIView


class CanvasViewApiUpdate(UpdateAPIView):
    authentication_classes = [SessionAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    lookup_field = 'slug'
    serializer_class = CanvasSerializer
    queryset = Canvas.objects.all()

    def update(self, request, *args, **kwargs):
        data = request.data
        canvas = Canvas.objects.get(slug=kwargs.get("slug"))
        font_name = data.get('font', None)
        font = Font.objects.get(name=font_name)
        if font is not None:
            canvas.fonts.add(font)
        canvas.save()

        return Response(status=status.HTTP_200_OK)

# @permission_classes([IsAuthenticated])
class CanvasView(APIView):
    authentication_classes = [SessionAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    def get(self, request, *args, **kwargs):
        slug = kwargs.get("slug")
        canvas = Canvas.objects.get(slug=slug)
        if canvas.permitted_users.filter(id=request.user.id).exists():
            serializer = CanvasSerializer(canvas)
            elements = canvas.elements.all()
            return Response({"canvas": serializer.data, "elements": CanvasElementSerializer(elements, many=True).data})
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    def post(self, request, *args, **kwargs):
        slug = kwargs.get("slug")
        canvas = Canvas.objects.get(slug=slug) 
        element = request.data.get("element", None)
        if element is not None:
            if CanvasElement.objects.filter(element=element).exists():
                element_object = CanvasElement.objects.get(element=element)
                element_object.element = element
                return Response(status=status.HTTP_202_ACCEPTED)
            element_object = CanvasElement.objects.create(element=element)
            element_object.save()
            canvas.elements.add(element_object)
            return Response(status=status.HTTP_201_CREATED)
            
        return Response(status=status.HTTP_204_NO_CONTENT)

    # def put(self, request, *args, **kwargs):
    #     slug = kwargs.get("slug")
    #     canvas = Canvas.objects.get(slug=slug) 
    #     element = request.data.get("element", None)
    #     if element is not None:
    #         element = CanvasElement.objects.get(element=element)
    #         element.save()
    #         canvas.elements.add(element)
    #         return Response(status=status.HTTP_201_CREATED)
            
    #     return Response(status=status.HTTP_204_NO_CONTENT)
    
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



class FontUploadView(APIView):
    authentication_classes = [SessionAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    def post(self, request):
        fs = FileSystemStorage(location='media/fonts')
        file_name = fs.save(f"{uuid.uuid4()}.{request.data['file'].name.split('.')[-1]}", request.data['file'])
        request.data['file'] = fs.url(file_name)
        obj = Font.objects.create(name=request.data['name'].split('.')[0], file=file_name, owner=request.user)
        obj.save()

        return Response(status=status.HTTP_201_CREATED)
    
    def get(self, request):
        queryset = Font.objects.filter(owner=request.user)
        serializer = FontSerializer(queryset, many=True)
        return Response(serializer.data)


def pageError(request, exception):
    return redirect("index")


def pageError500(request):
    return redirect("index")





from django.shortcuts import render, redirect
from .credentials import REDIRECT_URI, CLIENT_SECRET, CLIENT_ID
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import *
# from api.models import Room


class AuthURL(APIView):
    def get(self, request, fornat=None):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)


def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(
        request.session.session_key, access_token, token_type, expires_in, refresh_token)

    return redirect('frontend:')


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(
            self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)


class CurrentSong(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        endpoint = "player/currently-playing"
        response = execute_spotify_api_request(host, endpoint)

        if 'error' in response or 'item' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')

        artist_string = ""

        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ", "
            name = artist.get('name')
            artist_string += name

        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': 0,
            'id': song_id
        }

        return Response(song, status=status.HTTP_200_OK)