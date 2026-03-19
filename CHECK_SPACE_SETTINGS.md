# Check Your Space Settings

Before regenerating the API key, let's verify your Space settings are correct.

## Step 1: Check Space Permissions

1. Go to: https://cloud.digitalocean.com/spaces
2. Click on your "lutheran" Space
3. Click the "Settings" tab
4. Check these settings:

### File Listing
- Should be: **Private** (recommended) or **Public**
- If it's restricted, your API key might not have access

### CORS Configuration
Make sure you have CORS configured:

```json
{
  "AllowedOrigins": ["*"],
  "AllowedMethods": ["GET", "HEAD", "POST", "PUT", "DELETE"],
  "AllowedHeaders": ["*"],
  "MaxAgeSeconds": 3000
}
```

## Step 2: Check API Key Scope

1. Go to: https://cloud.digitalocean.com/account/api/spaces
2. Look at your Spaces access keys
3. Check if there are any restrictions on the key

## Step 3: Try Creating a New Key

The easiest solution is to create a fresh key:

1. **Delete old key**: Click trash icon next to your current key
2. **Generate new key**: Click "Generate New Key"
3. **Name it**: "Lutheran Church Django"
4. **Copy both keys immediately**:
   - Access Key: DO...
   - Secret Key: (long string)

## Step 4: Update and Test

Update `backend/quick_test.py` with new keys:
```python
ACCESS_KEY = 'your-new-access-key'
SECRET_KEY = 'your-new-secret-key'
```

Run test:
```bash
cd backend
source venv/bin/activate
python quick_test.py
```

## Expected Success Output:

```
Testing DigitalOcean Spaces Connection...
Bucket: lutheran
Region: sfo3
--------------------------------------------------

1. Testing bucket access...
   ✓ Bucket 'lutheran' is accessible!

2. Testing upload...
   ✓ File uploaded: media/test/connection_test.txt

3. File URLs:
   Direct: https://sfo3.digitaloceanspaces.com/lutheran/media/test/connection_test.txt
   CDN:    https://lutheran.sfo3.cdn.digitaloceanspaces.com/media/test/connection_test.txt

4. Listing files in media/test/...
   - media/test/connection_test.txt (27 bytes)

5. Cleaning up...
   ✓ Test file deleted

==================================================
✓ ALL TESTS PASSED!
Your Spaces configuration is working correctly.
==================================================
```

## If Still Failing

Contact DigitalOcean support - there might be an account-level restriction on your Spaces access.

## After Success

Once the test passes:
1. Update `backend/.env.spaces` with new keys
2. Add variables to Railway (see `ADD_TO_RAILWAY.md`)
3. Test upload via admin panel
