"""
Script to create sample events for testing
Run with: python manage.py shell < create_sample_events.py
"""
from events.models import Event
from datetime import datetime, timedelta
from django.utils import timezone

# Clear existing events
Event.objects.all().delete()

# Create sample events
events_data = [
    {
        'title': 'Sunday Worship Service',
        'description': 'Join us for our weekly Sunday worship service with inspiring messages, uplifting music, and fellowship.',
        'event_type': 'service',
        'start_date': timezone.now() + timedelta(days=7),
        'end_date': timezone.now() + timedelta(days=7, hours=2),
        'location': 'Main Sanctuary',
        'address': 'Trinity Lutheran Church, Accra, Ghana',
        'registration_required': False,
        'is_featured': True,
        'is_published': True,
    },
    {
        'title': 'Youth Conference 2026',
        'description': 'A transformative conference for young people featuring dynamic speakers, workshops, and networking opportunities.',
        'event_type': 'conference',
        'start_date': timezone.now() + timedelta(days=30),
        'end_date': timezone.now() + timedelta(days=32),
        'location': 'Conference Center',
        'address': 'Trinity Lutheran Church Conference Center, Accra',
        'max_attendees': 200,
        'registration_required': True,
        'registration_deadline': timezone.now() + timedelta(days=25),
        'is_featured': True,
        'is_published': True,
    },
    {
        'title': 'Bible Study Workshop',
        'description': 'Deep dive into scripture with interactive discussions and practical applications for daily life.',
        'event_type': 'workshop',
        'start_date': timezone.now() + timedelta(days=14),
        'end_date': timezone.now() + timedelta(days=14, hours=3),
        'location': 'Fellowship Hall',
        'address': 'Trinity Lutheran Church, Fellowship Hall',
        'max_attendees': 50,
        'registration_required': True,
        'registration_deadline': timezone.now() + timedelta(days=12),
        'is_featured': False,
        'is_published': True,
    },
    {
        'title': 'Community Outreach Program',
        'description': 'Join us as we serve our community through food distribution, health screenings, and prayer support.',
        'event_type': 'outreach',
        'start_date': timezone.now() + timedelta(days=21),
        'end_date': timezone.now() + timedelta(days=21, hours=4),
        'location': 'Community Center',
        'address': 'Accra Community Center, Ghana',
        'registration_required': True,
        'max_attendees': 100,
        'is_featured': True,
        'is_published': True,
    },
    {
        'title': 'Prayer and Fasting Retreat',
        'description': 'A spiritual retreat focused on prayer, fasting, and seeking God\'s presence in a peaceful setting.',
        'event_type': 'retreat',
        'start_date': timezone.now() + timedelta(days=45),
        'end_date': timezone.now() + timedelta(days=47),
        'location': 'Mountain Retreat Center',
        'address': 'Aburi Mountains, Ghana',
        'max_attendees': 75,
        'registration_required': True,
        'registration_deadline': timezone.now() + timedelta(days=40),
        'is_featured': False,
        'is_published': True,
    },
    {
        'title': 'Church Family Picnic',
        'description': 'A fun-filled day of games, food, and fellowship for the whole family. Bring your friends!',
        'event_type': 'social',
        'start_date': timezone.now() + timedelta(days=28),
        'end_date': timezone.now() + timedelta(days=28, hours=5),
        'location': 'Legon Botanical Gardens',
        'address': 'University of Ghana, Legon',
        'registration_required': True,
        'max_attendees': 150,
        'is_featured': True,
        'is_published': True,
    },
    {
        'title': 'Midweek Prayer Meeting',
        'description': 'Join us for our weekly prayer meeting where we intercede for our church, community, and nation.',
        'event_type': 'service',
        'start_date': timezone.now() + timedelta(days=3),
        'end_date': timezone.now() + timedelta(days=3, hours=1.5),
        'location': 'Prayer Room',
        'address': 'Trinity Lutheran Church, Prayer Room',
        'registration_required': False,
        'is_featured': False,
        'is_published': True,
    },
    {
        'title': 'Marriage Enrichment Workshop',
        'description': 'Strengthen your marriage with practical tools and biblical principles. For married couples only.',
        'event_type': 'workshop',
        'start_date': timezone.now() + timedelta(days=35),
        'end_date': timezone.now() + timedelta(days=35, hours=4),
        'location': 'Conference Room B',
        'address': 'Trinity Lutheran Church, Conference Room B',
        'max_attendees': 30,
        'registration_required': True,
        'registration_deadline': timezone.now() + timedelta(days=30),
        'is_featured': False,
        'is_published': True,
    },
]

for event_data in events_data:
    event = Event.objects.create(**event_data)
    print(f"Created event: {event.title}")

print(f"\nTotal events created: {Event.objects.count()}")
