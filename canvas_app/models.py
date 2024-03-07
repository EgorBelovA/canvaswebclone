from django.db import models
import uuid


class Canvas(models.Model):
    title = models.CharField(max_length=1000)
    slug = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    time_created = models.DateTimeField(auto_now_add=True)