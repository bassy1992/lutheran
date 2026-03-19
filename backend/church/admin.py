from django.contrib import admin
from .models import ChurchInfo, Pastor, ServiceTime, CoreValue


@admin.register(ChurchInfo)
class ChurchInfoAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'country', 'phone', 'email', 'updated_at']
    search_fields = ['name', 'city', 'country']


@admin.register(Pastor)
class PastorAdmin(admin.ModelAdmin):
    list_display = ['name', 'role', 'email', 'phone', 'is_active', 'order']
    list_filter = ['role', 'is_active']
    search_fields = ['name', 'email']
    ordering = ['order', 'name']


@admin.register(ServiceTime)
class ServiceTimeAdmin(admin.ModelAdmin):
    list_display = ['day', 'time', 'description', 'is_active', 'order']
    list_filter = ['is_active']
    ordering = ['order', 'day']


@admin.register(CoreValue)
class CoreValueAdmin(admin.ModelAdmin):
    list_display = ['title', 'icon', 'order']
    ordering = ['order', 'title']

