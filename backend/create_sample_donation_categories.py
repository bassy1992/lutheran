import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'church_backend.settings')
django.setup()

from donations.models import DonationCategory

# Clear existing categories
DonationCategory.objects.all().delete()

# Create donation categories
categories = [
    {
        'name': 'General Offering',
        'description': 'Support the general operations and ministry of Trinity Lutheran Church',
    },
    {
        'name': 'Tithe',
        'description': 'Your faithful tithe to support God\'s work through our church',
    },
    {
        'name': 'Building Fund',
        'description': 'Contribute to our church building projects and facility improvements',
    },
    {
        'name': 'Mission & Outreach',
        'description': 'Support our local and international mission work and community outreach programs',
    },
    {
        'name': 'Youth Ministry',
        'description': 'Help us nurture and disciple the next generation through youth programs',
    },
    {
        'name': 'Children\'s Ministry',
        'description': 'Support Sunday School, VBS, and other children\'s ministry activities',
    },
    {
        'name': 'Benevolence Fund',
        'description': 'Help those in need within our church and community',
    },
    {
        'name': 'Music Ministry',
        'description': 'Support our worship team, choir, and music programs',
    },
    {
        'name': 'Special Projects',
        'description': 'Contribute to specific church projects and initiatives',
    },
]

for cat_data in categories:
    category = DonationCategory.objects.create(**cat_data)
    print(f'Created category: {category.name}')

print(f'\nTotal categories created: {DonationCategory.objects.count()}')
