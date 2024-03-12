# Generated by Django 5.0.2 on 2024-03-12 19:07

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Canvas',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=1000)),
                ('slug', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('time_created', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]