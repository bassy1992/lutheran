from django.contrib import admin
from .models import Event, EventRegistration


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'event_type', 'start_date', 'location', 'attendee_count', 'is_featured', 'is_published']
    list_filter = ['event_type', 'is_featured', 'is_published', 'start_date']
    search_fields = ['title', 'description', 'location']
    date_hierarchy = 'start_date'
    ordering = ['-start_date']


@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ['name', 'event', 'email', 'phone', 'number_of_attendees', 'status', 'registered_at']
    list_filter = ['status', 'registered_at']
    search_fields = ['name', 'email', 'event__title']
    date_hierarchy = 'registered_at'
    ordering = ['-registered_at']
