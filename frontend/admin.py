from django.contrib import admin

from django.contrib.auth.admin import UserAdmin

# from .forms import CustomUserCreationForm, CustomUserChangeForm
# from .models import *

# class CustomUserAdmin(UserAdmin):
#     add_form = CustomUserCreationForm
#     form = CustomUserChangeForm
#     model = CustomUser
#     list_display = ('username', 'email', 'is_staff', 'is_active', 'image', 'password')
#     list_filter = ('email', 'is_staff', 'is_active', 'image')
#     fieldsets = (
#         (None, {'fields': ('username', 'email', 'password', 'image', 'rooms')}),
#         ('Permissions', {'fields': ('is_staff', 'is_active')}),
#     )
#     add_fieldsets = (
#         (None, {
#             'classes': ('wide',),
#             'fields': ('username', 'email', 'password', 'is_staff', 'is_active', 'image', 'rooms')}
#         ),
#     )
#     search_fields = ('email',)
#     ordering = ('email',)
