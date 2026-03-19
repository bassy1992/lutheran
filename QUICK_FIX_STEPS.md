# Quick Fix - 3 Simple Steps

## Your Issue
✗ API key can READ but cannot WRITE to the Space

## The Fix (5 minutes)

### Step 1: Delete Old Key
1. Open: https://cloud.digitalocean.com/account/api/spaces
2. Find key starting with `DO8014...`
3. Click trash icon 🗑️
4. Confirm deletion

### Step 2: Create New Key
1. Click **"Generate New Key"** button
2. Name: `Lutheran Church Django`
3. Click **"Generate Key"**
4. **IMMEDIATELY COPY BOTH**:
   ```
   Access Key: DO_____________ (copy this)
   Secret Key: ________________ (copy this)
   ```
   ⚠️ You can't see the Secret Key again!

### Step 3: Test New Key

Edit `backend/quick_test.py` - replace lines 8-9:
```python
ACCESS_KEY = 'paste-your-new-access-key-here'
SECRET_KEY = 'paste-your-new-secret-key-here'
```

Run test:
```bash
cd backend
source venv/bin/activate
python quick_test.py
```

### Expected Result:
```
✓ Bucket 'lutheran' is accessible!
✓ File uploaded: media/test/connection_test.txt
✓ Test file deleted
✓ ALL TESTS PASSED!
```

## After Success

### Update Railway:
1. Go to Railway dashboard
2. Your project → Backend service → Variables
3. Update these 2 variables:
   - `DO_SPACES_KEY` = your new access key
   - `DO_SPACES_SECRET` = your new secret key
4. Railway auto-redeploys

### Test Upload:
1. Go to: https://web-production-4e622.up.railway.app/admin/
2. Gallery → Add Photo
3. Upload an image
4. Check your "lutheran" Space - file should appear!

## Still Not Working?

Check `CHECK_SPACE_SETTINGS.md` for Space configuration issues.

---

**TL;DR**: Delete old key → Generate new key → Update quick_test.py → Run test → Update Railway
