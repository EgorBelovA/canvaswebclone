
from mimetypes import init
from channels.consumer import AsyncConsumer


class CanvasConsumer(AsyncConsumer):

    async def websocket_connect(self, event):
        canvas_room = "canvas"
        self.canvas_room = canvas_room
        await self.channel_layer.group_add(
            canvas_room, self.channel_name
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