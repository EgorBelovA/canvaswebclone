from django.db import models
import uuid
import glob, random

def random_default_image():
    file_name_path = [f for f in glob.glob("media/default_images_canvas/*.jpg")]
    print(file_name_path)
    return random.choice(file_name_path)[5:]


class Canvas(models.Model):
    admins  = models.ManyToManyField('account_app.CustomUser', related_name='admins', db_index=True)
    permitted_users = models.ManyToManyField('account_app.CustomUser', related_name='permitted_users', blank=True, db_index=True)
    title = models.CharField(max_length=250, default="Untitled")
    description = models.CharField(max_length=1000, blank=True, null=True)
    slug = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    time_created = models.DateTimeField(auto_now_add=True)
    time_updated = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to='canvas_image/', default=random_default_image, blank=True, null=True)

    class Meta:
        verbose_name_plural = 'Canvases'

    def __str__(self):
        return self.title