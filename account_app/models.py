from django.db import models
from .managers import CustomUserManager
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save
from django.dispatch import receiver


class CustomUser(AbstractUser):
    first_name = models.CharField(max_length=50, unique=False, null=True, blank=True)
    email = models.EmailField(unique=True, blank=True)
    password = models.CharField(max_length=100, unique=False, null=True, blank=True)
    username = models.CharField(max_length=50, unique=False, null=True, blank=True)
    avatar = models.FileField(null=True, blank=True, upload_to='avatars/')

    # def clean_password2(self):
    #     password1 = self.cleaned_data['password1']
    #     password2 = self.cleaned_data['password2']

    #     if password1 and password2 and password1 != password2:
    #         raise ValidationError("Password don't match")
    #     return password2

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    # def __str__(self):
    #     return self.name

class SubscriptionPlan(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    billing_interval = models.CharField(max_length=20, choices=(
        ('monthly', 'Monthly'),
    ))

    def __str__(self):
        return self.name


class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='userprofile')
    online = models.BooleanField(default=False)
    subscription = models.ForeignKey(SubscriptionPlan, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.user.email
    
@receiver(post_save, sender=CustomUser)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)



class Payment(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='payments')
    type = models.CharField(max_length=255, choices=(
        ('success', 'Success'), ('failed', 'Failed'), ("Pending", "Pending")
    ), default="Pending")

class Subscription(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='subscriptions')
    created_at = models.DateTimeField(auto_now_add=True)
