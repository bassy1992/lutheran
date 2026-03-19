#!/usr/bin/env python
"""Check Space ACL and permissions"""

import boto3
from botocore.client import Config

ACCESS_KEY = 'DO8014PDYEMPMGC8CMYR'
SECRET_KEY = 'MRio2V3xaCvUMJXWwGmzAjfJceHIggO1EH4ripqy5j8'
BUCKET_NAME = 'lutheran'
ENDPOINT_URL = 'https://sfo3.digitaloceanspaces.com'
REGION = 'sfo3'

print("Checking Space ACL and Permissions...")
print("-" * 50)

try:
    session = boto3.session.Session()
    client = session.client(
        's3',
        region_name=REGION,
        endpoint_url=ENDPOINT_URL,
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,
        config=Config(signature_version='s3v4')
    )
    
    # Check bucket ACL
    print("\n1. Checking bucket ACL...")
    try:
        acl = client.get_bucket_acl(Bucket=BUCKET_NAME)
        print(f"   Owner: {acl['Owner']['DisplayName']}")
        print(f"   Grants:")
        for grant in acl['Grants']:
            grantee = grant['Grantee']
            permission = grant['Permission']
            if grantee['Type'] == 'CanonicalUser':
                print(f"   - {grantee.get('DisplayName', 'Unknown')}: {permission}")
            else:
                print(f"   - {grantee['Type']}: {permission}")
    except Exception as e:
        print(f"   ✗ Cannot read ACL: {e}")
    
    # Check bucket location
    print("\n2. Checking bucket location...")
    try:
        location = client.get_bucket_location(Bucket=BUCKET_NAME)
        print(f"   Location: {location.get('LocationConstraint', 'us-east-1')}")
    except Exception as e:
        print(f"   ✗ Cannot get location: {e}")
    
    # Try to upload without ACL
    print("\n3. Testing upload WITHOUT ACL...")
    test_key = 'test-no-acl.txt'
    try:
        client.put_object(
            Bucket=BUCKET_NAME,
            Key=test_key,
            Body=b'Test without ACL',
            ContentType='text/plain'
        )
        print(f"   ✓ Upload successful!")
        client.delete_object(Bucket=BUCKET_NAME, Key=test_key)
        print(f"   ✓ Cleanup successful!")
    except Exception as e:
        print(f"   ✗ Upload failed: {e}")
    
    # Try to upload with private ACL
    print("\n4. Testing upload WITH private ACL...")
    test_key = 'test-private-acl.txt'
    try:
        client.put_object(
            Bucket=BUCKET_NAME,
            Key=test_key,
            Body=b'Test with private ACL',
            ACL='private',
            ContentType='text/plain'
        )
        print(f"   ✓ Upload successful!")
        client.delete_object(Bucket=BUCKET_NAME, Key=test_key)
        print(f"   ✓ Cleanup successful!")
    except Exception as e:
        print(f"   ✗ Upload failed: {e}")
    
    # Try to upload with public-read ACL
    print("\n5. Testing upload WITH public-read ACL...")
    test_key = 'test-public-acl.txt'
    try:
        client.put_object(
            Bucket=BUCKET_NAME,
            Key=test_key,
            Body=b'Test with public-read ACL',
            ACL='public-read',
            ContentType='text/plain'
        )
        print(f"   ✓ Upload successful!")
        client.delete_object(Bucket=BUCKET_NAME, Key=test_key)
        print(f"   ✓ Cleanup successful!")
    except Exception as e:
        print(f"   ✗ Upload failed: {e}")
    
    print("\n" + "=" * 50)
    print("Diagnosis:")
    print("If ALL uploads failed, your API key lacks write permissions.")
    print("Solution: Generate a new API key in DigitalOcean.")
    print("=" * 50)
    
except Exception as e:
    print(f"\n✗ Error: {e}")
