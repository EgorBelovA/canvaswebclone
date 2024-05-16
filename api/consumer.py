
from mimetypes import init
from channels.consumer import AsyncConsumer
import json
from .models import Canvas, Notification
from account_app.models import CustomUser
from channels.db import database_sync_to_async
from django.core.files.storage import FileSystemStorage
from .serializers import NotificationSerializer

class CanvasConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        self.canvas_room_name = self.scope['url_route']['kwargs']['slug']
        self.canvas_room = "canvas_%s" % self.canvas_room_name
        await self.channel_layer.group_add(
            self.canvas_room, self.channel_name
        )
        await self.send({
            "type" : "websocket.accept"
        })


    async def websocket_receive(self , event):
        initial_data = event.get("text" , None)

        await self.channel_layer.group_send(
            self.canvas_room,{
                "type": "canvas_message",
                "text" : initial_data

            }
        )

    async def canvas_message(self ,event):
        await self.send({
            "type" : "websocket.send",
            "text" : event['text']
        })

    
    async def websocket_disconnect(self , event):
        print('Disconnect' , event)





class NotificationConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        self.notification_room_name = self.scope['url_route']['kwargs']['id']
        self.notification_room = "canvas_%s" % self.notification_room_name
        await self.channel_layer.group_add(
            self.notification_room, self.channel_name
        )
        await self.send({
            "type" : "websocket.accept"
        })


    async def websocket_receive(self , event):
        initial_data = event.get("text" , None)
        data = json.loads(initial_data)
        notification = await self.create_notification(data)
        await self.channel_layer.group_send(
            self.notification_room,{
                "type": "notification_message",
                "text" : notification
            }
        )

    @database_sync_to_async
    def create_notification(self, data):
        notification = Notification.objects.create(
            type="requestAccess",
            sender=CustomUser.objects.get(id=int(data["senderID"])),
            recipient=CustomUser.objects.get(id=int(data["recipientID"])),
        )
        notification.save()
        notification_serializer = NotificationSerializer(notification)
        notification = json.dumps(notification_serializer.data)
        return notification

    async def notification_message(self ,event):
        await self.send({
            "type" : "websocket.send",
            "text" : event['text']
        })

    
    async def websocket_disconnect(self , event):
        print('Disconnect' , event)