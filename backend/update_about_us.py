#!/usr/bin/env python
"""
Update About Us section with new vision and mission
Run: python update_about_us.py
"""

import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'church_backend.settings')
django.setup()

from church.models import ChurchInfo, CoreValue

def update_about_us():
    print("Updating About Us section...")
    print("=" * 60)
    
    # Get or create church info
    church_info, created = ChurchInfo.objects.get_or_create(
        name="Trinity Lutheran Church",
        defaults={
            'tagline': 'A Community Transformed by Christ',
            'description': '''Trinity Lutheran Church has been a pillar of the Christian community in Ghana for decades. We are a family of Bible believers committed to living out and sharing the Gospel of Jesus Christ, our Lord and Saviour.''',
            'address': 'Accra, Ghana',
            'city': 'Accra',
            'country': 'Ghana',
            'phone': '+233 XXX XXX XXX',
            'email': 'info@trinitylutheranchurch.org',
        }
    )
    
    if not created:
        # Update existing church info
        church_info.description = '''Trinity Lutheran Church has been a pillar of the Christian community in Ghana for decades. We are a family of Bible believers committed to living out and sharing the Gospel of Jesus Christ, our Lord and Saviour.'''
        church_info.save()
        print("✓ Updated church description")
    else:
        print("✓ Created new church info")
    
    # Update or create core values
    core_values_data = [
        {
            'title': 'Our Vision',
            'description': 'To build a community of Christians who are led and transformed by the life and teachings of Christ.',
            'icon': 'eye',
            'order': 1
        },
        {
            'title': 'Our Mission',
            'description': 'Proclaiming the Gospel of Jesus Christ by sharing of the Gospel, in Ghana and beyond through church and community level activities and events.',
            'icon': 'target',
            'order': 2
        },
        {
            'title': 'Our Heritage',
            'description': 'Proudly following and sharing the word of God, within the unique cultural context of Ghana.',
            'icon': 'book',
            'order': 3
        }
    ]
    
    print("\nUpdating Core Values...")
    for value_data in core_values_data:
        core_value, created = CoreValue.objects.update_or_create(
            title=value_data['title'],
            defaults={
                'description': value_data['description'],
                'icon': value_data['icon'],
                'order': value_data['order']
            }
        )
        action = "Created" if created else "Updated"
        print(f"  ✓ {action}: {value_data['title']}")
    
    print("\n" + "=" * 60)
    print("✓ About Us section updated successfully!")
    print("\nCurrent Content:")
    print("-" * 60)
    print(f"\nChurch: {church_info.name}")
    print(f"Description: {church_info.description}")
    print("\nCore Values:")
    for value in CoreValue.objects.all():
        print(f"\n{value.title}:")
        print(f"  {value.description}")
    print("\n" + "=" * 60)

if __name__ == "__main__":
    update_about_us()
