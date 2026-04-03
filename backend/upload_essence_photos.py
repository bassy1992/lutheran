#!/usr/bin/env python
"""
Script to upload photos for the 'Our Essence' section on the home page.
Usage: python upload_essence_photos.py <image_url_1> <image_url_2>
Or: python upload_essence_photos.py (will prompt for URLs)
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'church_backend.settings')
django.setup()

from gallery.models import GalleryAlbum, GalleryPhoto
from django.utils import timezone

def upload_essence_photos(image_urls=None):
    """Upload photos to be featured in the Our Essence section"""
    
    # Get or create a "Church Life" album
    album, created = GalleryAlbum.objects.get_or_create(
        title="Church Life",
        defaults={
            'description': 'Photos showcasing our vibrant church community',
            'date': timezone.now().date(),
            'is_featured': True,
            'is_published': True
        }
    )
    
    if created:
        print(f"✓ Created new album: {album.title}")
    else:
        print(f"✓ Using existing album: {album.title}")
    
    if not image_urls:
        print("\n" + "="*60)
        print("Enter image URLs for the 'Our Essence' section")
        print("You can provide:")
        print("  - DigitalOcean Spaces URLs")
        print("  - Direct image URLs")
        print("  - Local file paths (will need to be uploaded separately)")
        print("="*60)
        
        url1 = input("\nImage URL 1 (left image): ").strip()
        url2 = input("Image URL 2 (right image): ").strip()
        
        if not url1 or not url2:
            print("❌ Both image URLs are required!")
            return
        
        image_urls = [url1, url2]
    
    # Unmark all existing photos as featured
    GalleryPhoto.objects.all().update(is_featured=False)
    
    # Create/update photos
    titles = ["Church Community", "Worship Service"]
    descriptions = [
        "Our vibrant church community coming together in fellowship",
        "Experiencing the presence of God in worship"
    ]
    
    for i, (url, title, desc) in enumerate(zip(image_urls, titles, descriptions), 1):
        photo, created = GalleryPhoto.objects.update_or_create(
            album=album,
            title=title,
            defaults={
                'description': desc,
                'image': url,
                'photographer': 'Trinity Lutheran Church',
                'date_taken': timezone.now().date(),
                'order': i,
                'is_featured': True
            }
        )
        
        action = "Created" if created else "Updated"
        print(f"✓ {action}: {photo.title}")
        print(f"  URL: {url}")
    
    print(f"\n✅ Successfully configured {len(image_urls)} photos for the 'Our Essence' section!")
    print("\nThese photos will now appear on the home page.")
    print(f"Album: {album.title} (ID: {album.id})")

if __name__ == '__main__':
    if len(sys.argv) > 2:
        # URLs provided as command line arguments
        image_urls = sys.argv[1:3]
        upload_essence_photos(image_urls)
    else:
        # Interactive mode
        upload_essence_photos()
