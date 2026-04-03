#!/usr/bin/env python
"""
Script to link existing events to ministries and create sample ministry events
"""
import os
import django
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'church_backend.settings')
django.setup()

from events.models import Event
from members.models import Ministry

def link_events_to_ministries():
    """Link existing events to appropriate ministries"""
    
    ministries = Ministry.objects.all()
    events = Event.objects.all()
    
    print(f"\nFound {ministries.count()} ministries and {events.count()} events")
    
    if ministries.count() == 0:
        print("No ministries found. Please create ministries first.")
        return
    
    # Get ministries by name (case-insensitive search)
    ministry_map = {}
    for ministry in ministries:
        ministry_map[ministry.name.lower()] = ministry
    
    print("\nAvailable ministries:")
    for name, ministry in ministry_map.items():
        print(f"  - {ministry.name} (ID: {ministry.id})")
    
    # Link existing events based on keywords in title/description
    updated_count = 0
    for event in events:
        if event.ministry:
            continue  # Skip if already linked
        
        title_lower = event.title.lower()
        desc_lower = event.description.lower()
        
        # Try to match events to ministries based on keywords
        if any(keyword in title_lower or keyword in desc_lower for keyword in ['youth', 'young', 'teen']):
            if 'youth' in ministry_map:
                event.ministry = ministry_map['youth']
                event.save()
                print(f"✓ Linked '{event.title}' to Youth Ministry")
                updated_count += 1
        elif any(keyword in title_lower or keyword in desc_lower for keyword in ['child', 'kid', 'sunday school']):
            if 'children' in ministry_map or "children's" in ministry_map:
                ministry_key = 'children' if 'children' in ministry_map else "children's"
                event.ministry = ministry_map[ministry_key]
                event.save()
                print(f"✓ Linked '{event.title}' to Children's Ministry")
                updated_count += 1
        elif any(keyword in title_lower or keyword in desc_lower for keyword in ['women', 'ladies', 'sisters']):
            if 'women' in ministry_map or "women's" in ministry_map:
                ministry_key = 'women' if 'women' in ministry_map else "women's"
                event.ministry = ministry_map[ministry_key]
                event.save()
                print(f"✓ Linked '{event.title}' to Women's Ministry")
                updated_count += 1
        elif any(keyword in title_lower or keyword in desc_lower for keyword in ['men', 'brothers']):
            if 'men' in ministry_map or "men's" in ministry_map:
                ministry_key = 'men' if 'men' in ministry_map else "men's"
                event.ministry = ministry_map[ministry_key]
                event.save()
                print(f"✓ Linked '{event.title}' to Men's Ministry")
                updated_count += 1
        elif any(keyword in title_lower or keyword in desc_lower for keyword in ['worship', 'music', 'choir', 'praise']):
            if 'worship' in ministry_map or 'music' in ministry_map:
                ministry_key = 'worship' if 'worship' in ministry_map else 'music'
                event.ministry = ministry_map[ministry_key]
                event.save()
                print(f"✓ Linked '{event.title}' to Worship Ministry")
                updated_count += 1
    
    print(f"\n✓ Updated {updated_count} existing events")
    
    # Create sample events for each ministry
    print("\nCreating sample events for ministries...")
    
    base_date = datetime.now() + timedelta(days=7)
    
    sample_events = []
    
    for i, ministry in enumerate(ministries):
        event_date = base_date + timedelta(days=i*7)
        
        # Create ministry-specific event
        event_data = {
            'Youth Ministry': {
                'title': 'Youth Fellowship Night',
                'description': 'Join us for an evening of worship, games, and fellowship. Open to all youth ages 13-25.',
                'event_type': 'social',
                'location': 'Youth Hall',
            },
            "Children's Ministry": {
                'title': "Kids' Bible Adventure",
                'description': 'Interactive Bible stories, crafts, and fun activities for children ages 5-12.',
                'event_type': 'workshop',
                'location': 'Children\'s Wing',
            },
            "Women's Fellowship": {
                'title': "Women's Prayer Breakfast",
                'description': 'Start your day with prayer, worship, and fellowship with sisters in Christ.',
                'event_type': 'social',
                'location': 'Fellowship Hall',
            },
            'Worship Ministry': {
                'title': 'Worship Team Practice',
                'description': 'Weekly practice session for all worship team members. New members welcome!',
                'event_type': 'other',
                'location': 'Main Sanctuary',
            },
        }
        
        # Get event details or use generic
        event_info = event_data.get(ministry.name, {
            'title': f'{ministry.name} Gathering',
            'description': f'Join us for a special {ministry.name} event. All members and interested individuals are welcome!',
            'event_type': 'social',
            'location': 'Church Hall',
        })
        
        event = Event.objects.create(
            title=event_info['title'],
            description=event_info['description'],
            event_type=event_info['event_type'],
            ministry=ministry,
            start_date=event_date.replace(hour=18, minute=0),
            end_date=event_date.replace(hour=20, minute=0),
            location=event_info['location'],
            address='Trinity Lutheran Church, Tema',
            registration_required=True,
            max_attendees=50,
            is_published=True,
            is_featured=i == 0  # Make first one featured
        )
        
        sample_events.append(event)
        print(f"✓ Created '{event.title}' for {ministry.name}")
    
    print(f"\n✓ Created {len(sample_events)} new ministry events")
    print("\n✅ Done! Events are now linked to ministries.")

if __name__ == '__main__':
    link_events_to_ministries()
