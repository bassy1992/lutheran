#!/usr/bin/env python
"""
Test DigitalOcean Spaces connection
Run: python test_spaces_connection.py
"""

import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'church_backend.settings')
django.setup()

from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.conf import settings

def test_spaces_connection():
    print("=" * 60)
    print("DigitalOcean Spaces Connection Test")
    print("=" * 60)
    
    # Check if Spaces is enabled
    print(f"\n1. Spaces Enabled: {settings.USE_SPACES}")
    
    if not settings.USE_SPACES:
        print("   ⚠️  Spaces is disabled. Set USE_SPACES=True to test.")
        return
    
    # Display configuration
    print(f"\n2. Configuration:")
    print(f"   Bucket: {settings.AWS_STORAGE_BUCKET_NAME}")
    print(f"   Region: {settings.AWS_S3_REGION_NAME}")
    print(f"   Endpoint: {settings.AWS_S3_ENDPOINT_URL}")
    print(f"   CDN Domain: {settings.AWS_S3_CUSTOM_DOMAIN or 'Not set'}")
    
    # Test file upload
    print(f"\n3. Testing file upload...")
    test_content = b"Hello from Lutheran Church Management System!"
    test_filename = "test/connection_test.txt"
    
    try:
        path = default_storage.save(test_filename, ContentFile(test_content))
        print(f"   ✓ Upload successful!")
        print(f"   Path: {path}")
        
        # Get URL
        url = default_storage.url(path)
        print(f"\n4. File URL:")
        print(f"   {url}")
        
        # Check if file exists
        exists = default_storage.exists(path)
        print(f"\n5. File exists check: {'✓ Yes' if exists else '✗ No'}")
        
        # Get file size
        size = default_storage.size(path)
        print(f"\n6. File size: {size} bytes")
        
        # Read file back
        print(f"\n7. Reading file back...")
        with default_storage.open(path, 'rb') as f:
            content = f.read()
            if content == test_content:
                print(f"   ✓ Content matches!")
            else:
                print(f"   ✗ Content mismatch!")
        
        # Clean up
        print(f"\n8. Cleaning up test file...")
        default_storage.delete(path)
        print(f"   ✓ Test file deleted")
        
        print("\n" + "=" * 60)
        print("✓ All tests passed! Spaces is working correctly.")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n✗ Error: {str(e)}")
        print("\nTroubleshooting:")
        print("1. Check your API keys are correct")
        print("2. Verify bucket name matches exactly")
        print("3. Ensure bucket exists in the specified region")
        print("4. Check CORS configuration in your Space")
        print("=" * 60)
        return False
    
    return True

if __name__ == "__main__":
    test_spaces_connection()
