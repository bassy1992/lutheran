#!/usr/bin/env python
"""
Script to mark specific gallery photos as featured for the home page.
Usage: python mark_photos_featured.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'church_backend.settings')
django.setup()

from gallery.models import GalleryPhoto

def mark_photos_as_featured():
    """Mark the first 2 photos from each album as featured for the home page"""
    
    # Get all photos
    all_photos = GalleryPhoto.objects.all().order_by('album', 'order')
    
    if not all_photos.exists():
        print("No photos found in the gallery.")
        return
    
    # Display available photos
    print("\n=== Available Photos ===")
    for i, photo in enumerate(all_photos[:20], 1):
        featured_status = "✓ FEATURED" if photo.is_featured else ""
        print(f"{i}. [{photo.id}] {photo.title} - Album: {photo.album.title} {featured_status}")
    
    print("\n" + "="*50)
    print("Enter photo IDs to mark as featured (comma-separated)")
    print("Example: 1,2,3 or press Enter to mark first 2 photos")
    print("="*50)
    
    user_input = input("\nPhoto IDs: ").strip()
    
    if not user_input:
        # Mark first 2 photos as featured
        photos_to_feature = all_photos[:2]
    else:
        # Parse user input
        try:
            photo_ids = [int(x.strip()) for x in user_input.split(',')]
            photos_to_feature = GalleryPhoto.objects.filter(id__in=photo_ids)
        except ValueError:
            print("Invalid input. Please enter comma-separated numbers.")
            return
    
    # Unmark all photos first
    GalleryPhoto.objects.all().update(is_featured=False)
    
    # Mark selected photos as featured
    count = 0
    for photo in photos_to_feature:
        photo.is_featured = True
        photo.save()
        count += 1
        print(f"✓ Marked as featured: {photo.title}")
    
    print(f"\n✅ Successfully marked {count} photo(s) as featured!")
    print("\nThese photos will now appear in the 'Our Essence' section on the home page.")

if __name__ == '__main__':
    mark_photos_as_featured()
