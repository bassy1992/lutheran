#!/usr/bin/env python
"""
Clean up sample photos with broken URLs
Run: python clean_sample_photos.py
"""

import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'church_backend.settings')
django.setup()

from gallery.models import GalleryPhoto

def clean_sample_photos():
    print("Cleaning up sample photos with broken URLs...")
    print("=" * 60)
    
    # Find photos with malformed URLs (containing %3A which is URL-encoded colon)
    broken_photos = GalleryPhoto.objects.filter(image__contains='%3A')
    
    count = broken_photos.count()
    
    if count == 0:
        print("No broken photos found!")
        return
    
    print(f"Found {count} photos with broken URLs")
    print("\nDeleting broken sample photos...")
    
    for photo in broken_photos:
        album_title = photo.album.title
        print(f"  - Deleting: {photo.title} from {album_title}")
        photo.delete()
    
    print("\n" + "=" * 60)
    print(f"✓ Cleaned up {count} broken sample photos")
    print("\nYou can now upload real photos using the bulk upload feature:")
    print("1. Go to Django Admin → Gallery → Gallery Albums")
    print("2. Click on an album")
    print("3. Click '📤 Bulk Upload Photos' button")
    print("4. Upload your real photos")
    print("=" * 60)

if __name__ == "__main__":
    clean_sample_photos()
