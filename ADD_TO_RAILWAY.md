# Add These Variables to Railway NOW

## Quick Copy-Paste for Railway

Go to: https://railway.app/dashboard
→ Select your project
→ Click backend service
→ Go to "Variables" tab
→ Click "New Variable" for each:

---

**Variable 1:**
```
Name: USE_SPACES
Value: True
```

**Variable 2:**
```
Name: DO_SPACES_KEY
Value: DO8014PDYEMPMGC8CMYR
```

**Variable 3:**
```
Name: DO_SPACES_SECRET
Value: MRio2V3xaCvUMJXWwGmzAjfJceHIggO1EH4ripqy5j8
```

**Variable 4:**
```
Name: DO_SPACES_BUCKET_NAME
Value: lutheran
```

**Variable 5:**
```
Name: DO_SPACES_ENDPOINT_URL
Value: https://sfo3.digitaloceanspaces.com
```

**Variable 6:**
```
Name: DO_SPACES_REGION
Value: sfo3
```

**Variable 7:**
```
Name: DO_SPACES_CDN_DOMAIN
Value: lutheran.sfo3.cdn.digitaloceanspaces.com
```

---

## After Adding Variables:

1. Railway will automatically redeploy (takes 2-3 minutes)
2. Watch the deployment logs
3. Once deployed, test by uploading an image in admin
4. Check your "lutheran" Space - files should appear in `media/` folder

## Your Space URLs:

- **Direct URL**: https://lutheran.sfo3.digitaloceanspaces.com/media/
- **CDN URL**: https://lutheran.sfo3.cdn.digitaloceanspaces.com/media/
- **Admin Panel**: https://web-production-4e622.up.railway.app/admin/

## Test Upload:

1. Go to admin → Gallery → Add Photo
2. Upload an image
3. Check DigitalOcean Space dashboard
4. You should see: `lutheran/media/gallery/photos/your-image.jpg`

## ⚠️ Security Reminder:

After confirming everything works, rotate your API keys:
1. DigitalOcean → API → Spaces Keys
2. Delete current key
3. Generate new key
4. Update Railway variables
