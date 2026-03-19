#!/usr/bin/env python
"""Quick test of DigitalOcean Spaces connection"""

import boto3
from botocore.client import Config

# Your credentials
ACCESS_KEY = 'DO8014PDYEMPMGC8CMYR'
SECRET_KEY = 'MRio2V3xaCvUMJXWwGmzAjfJceHIggO1EH4ripqy5j8'
BUCKET_NAME = 'lutheran'
ENDPOINT_URL = 'https://sfo3.digitaloceanspaces.com'
REGION = 'sfo3'

print("Testing DigitalOcean Spaces Connection...")
print(f"Bucket: {BUCKET_NAME}")
print(f"Region: {REGION}")
print("-" * 50)

try:
    # Create S3 client
    session = boto3.session.Session()
    client = session.client(
        's3',
        region_name=REGION,
        endpoint_url=ENDPOINT_URL,
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,
        config=Config(signature_version='s3v4')
    )
    
    # Test 1: Check bucket access
    print("\n1. Testing bucket access...")
    try:
        client.head_bucket(Bucket=BUCKET_NAME)
        print(f"   ✓ Bucket '{BUCKET_NAME}' is accessible!")
    except Exception as e:
        print(f"   ✗ Cannot access bucket: {e}")
        exit(1)
    
    # Test 2: Upload test file
    print("\n2. Testing upload...")
    test_key = 'media/test/connection_test.txt'
    test_content = b'Hello from Lutheran Church!'
    
    # Try without ACL first
    try:
        client.put_object(
            Bucket=BUCKET_NAME,
            Key=test_key,
            Body=test_content,
            ContentType='text/plain'
        )
        print(f"   ✓ File uploaded: {test_key}")
    except Exception as e:
        print(f"   ✗ Upload failed: {e}")
        print("\n   Trying with public-read ACL...")
        client.put_object(
            Bucket=BUCKET_NAME,
            Key=test_key,
            Body=test_content,
            ACL='public-read',
            ContentType='text/plain'
        )
        print(f"   ✓ File uploaded with ACL: {test_key}")
    
    # Test 3: Generate URL
    print("\n3. File URLs:")
    direct_url = f"{ENDPOINT_URL}/{BUCKET_NAME}/{test_key}"
    cdn_url = f"https://{BUCKET_NAME}.{REGION}.cdn.digitaloceanspaces.com/{test_key}"
    print(f"   Direct: {direct_url}")
    print(f"   CDN:    {cdn_url}")
    
    # Test 4: List files
    print("\n4. Listing files in media/test/...")
    response = client.list_objects_v2(
        Bucket=BUCKET_NAME,
        Prefix='media/test/'
    )
    if 'Contents' in response:
        for obj in response['Contents']:
            print(f"   - {obj['Key']} ({obj['Size']} bytes)")
    
    # Test 5: Delete test file
    print("\n5. Cleaning up...")
    client.delete_object(Bucket=BUCKET_NAME, Key=test_key)
    print(f"   ✓ Test file deleted")
    
    print("\n" + "=" * 50)
    print("✓ ALL TESTS PASSED!")
    print("Your Spaces configuration is working correctly.")
    print("=" * 50)
    print("\nNext step: Add variables to Railway")
    print("See: ADD_TO_RAILWAY.md")
    
except Exception as e:
    print(f"\n✗ Error: {str(e)}")
    print("\nTroubleshooting:")
    print("1. Check your API keys are correct")
    print("2. Verify bucket name is 'lutheran'")
    print("3. Ensure bucket is in SFO3 region")
    print("4. Check CORS configuration")
