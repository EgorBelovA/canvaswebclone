from django.contrib import admin

from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import *

# class CustomUserAdmin(UserAdmin):
#     add_form = CustomUserCreationForm
#     form = CustomUserChangeForm
#     model = CustomUser
#     list_display = ('first_name', 'email', 'is_staff', 'is_active', 'password')
#     list_filter = ('email', 'is_staff', 'is_active')
#     fieldsets = (
#         (None, {'fields': ('first_name', 'email', 'password', 'avatar')}),
#         ('Permissions', {'fields': ('is_staff', 'is_active')}),
#     )
#     add_fieldsets = (
#         (None, {
#             'classes': ('wide',),
#             'fields': ('first_name', 'email', 'password', 'avatar', 'is_staff', 'is_active')}
#         ),
#     )
#     search_fields = ('email',)
#     ordering = ('email',)

admin.site.register(CustomUser)
admin.site.register(UserProfile)
admin.site.register(Subscription)
admin.site.register(Payment)

