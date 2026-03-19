"""
Create sample service times
Run with: python manage.py shell < create_sample_service_times.py
"""
from church.models import ServiceTime
from datetime import time

# Clear existing service times
ServiceTime.objects.all().delete()

# Create service times
service_times_data = [
    {
        'day': 'Sunday',
        'time': time(9, 0),
        'description': 'Sunday Worship',
        'is_active': True,
        'order': 1,
    },
    {
        'day': 'Sunday',
        'time': time(8, 0),
        'description': 'Sunday Bible Study',
        'is_active': True,
        'order': 2,
    },
    {
        'day': 'Wednesday',
        'time': time(19, 0),
        'description': 'Wednesday Bible Study',
        'is_active': True,
        'order': 3,
    },
    {
        'day': 'Friday',
        'time': time(19, 0),
        'description': 'Friday Prayer Meeting',
        'is_active': True,
        'order': 4,
    },
]

for service_data in service_times_data:
    service = ServiceTime.objects.create(**service_data)
    print(f"Created service time: {service.day} at {service.time} - {service.description}")

print(f"\nTotal service times created: {ServiceTime.objects.count()}")
