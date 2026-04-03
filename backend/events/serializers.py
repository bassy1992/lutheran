from rest_framework import serializers
from .models import Event, EventRegistration
from members.serializers import MinistrySerializer
from django.utils import timezone


class EventSerializer(serializers.ModelSerializer):
    attendee_count = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    ministry = MinistrySerializer(read_only=True)
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'event_type', 'ministry', 'start_date', 'end_date',
            'location', 'address', 'image', 'image_url', 'max_attendees', 'registration_required',
            'registration_deadline', 'is_featured', 'is_published', 'attendee_count',
            'is_full', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class EventRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventRegistration
        fields = [
            'id', 'event', 'name', 'email', 'phone', 'number_of_attendees',
            'status', 'notes', 'registered_at'
        ]
        read_only_fields = ['registered_at', 'status']
    
    def validate(self, data):
        event = data.get('event')
        number_of_attendees = data.get('number_of_attendees', 1)
        
        # Check if event is full
        if event.is_full:
            raise serializers.ValidationError("This event is full.")
        
        # Check if registration deadline has passed
        if event.registration_deadline and timezone.now() > event.registration_deadline:
            raise serializers.ValidationError("Registration deadline has passed.")
        
        # Check if there are enough spots
        if event.max_attendees:
            remaining_spots = event.max_attendees - event.attendee_count
            if number_of_attendees > remaining_spots:
                raise serializers.ValidationError(
                    f"Only {remaining_spots} spots remaining."
                )
        
        return data
