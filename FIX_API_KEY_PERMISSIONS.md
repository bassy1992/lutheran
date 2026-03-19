# Fix API Key Permissions

## Issue
Your API key can read the bucket but cannot write to it. This needs to be fixed.

## Solution: Regenerate API Key with Full Permissions

### Step 1: Delete Current Key
1. Go to https://cloud.digitalocean.com/account/api/tokens
2. Scroll to "Spaces access keys"
3. Find your key (starts with DO8014...)
4. Click the trash icon to delete it

### Step 2: Create New Key with Full Permissions
1. Click "Generate New Key"
2. Name it: "Lutheran Church Django App"
3. **IMPORTANT**: Make sure it has full read/write permissions
4. Click "Generate Key"
5. **Copy both keys immediately** (you won't see the secret again!)

### Step 3: Update Configuration

#### For Railway:
1. Go to Railway dashboard → Your project → Backend service → Variables
2. Update these two variables:
   - `DO_SPACES_KEY` = your new access key
   - `DO_SPACES_SECRET` = your new secret key
3. Railway will auto-redeploy

#### For Local Testing:
Update `backend/.env.spaces`:
```bash
DO_SPACES_KEY=your-new-access-key
DO_SPACES_SECRET=your-new-secret-key
```

### Step 4: Test Again
```bash
cd backend
source venv/bin/activate
python quick_test.py
```

You should see:
```
✓ Bucket 'lutheran' is accessible!
✓ File uploaded: media/test/connection_test.txt
✓ Test file deleted
✓ ALL TESTS PASSED!
```

## Alternative: Check Space Permissions

If regenerating the key doesn't work, check your Space settings:

1. Go to your "lutheran" Space
2. Click "Settings" tab
3. Check "File Listing" - should be "Private" or "Public"
4. Ensure your API key has access to this Space

## Common Issues

### Issue: "Access Denied" on upload
**Solution**: Regenerate API key with full permissions

### Issue: "Bucket not found"
**Solution**: Verify bucket name is exactly "lutheran" (lowercase)

### Issue: "Invalid credentials"
**Solution**: Double-check you copied the keys correctly

## After Fixing

Once the test passes, you're ready to:
1. Add variables to Railway (see `ADD_TO_RAILWAY.md`)
2. Test upload via admin panel
3. Enjoy unlimited media storage!
