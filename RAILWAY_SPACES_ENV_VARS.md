# Railway Environment Variables for DigitalOcean Spaces

Add these environment variables to your Railway backend service:

## Go to Railway Dashboard:
1. Open https://railway.app/dashboard
2. Select your project
3. Click on your backend service
4. Go to "Variables" tab
5. Add each variable below:

## Environment Variables to Add:

```bash
USE_SPACES=True
DO_SPACES_KEY=DO8014PDYEMPMGC8CMYR
DO_SPACES_SECRET=MRio2V3xaCvUMJXWwGmzAjfJceHIggO1EH4ripqy5j8
DO_SPACES_BUCKET_NAME=lutheran
DO_SPACES_ENDPOINT_URL=https://sfo3.digitaloceanspaces.com
DO_SPACES_REGION=sfo3
DO_SPACES_CDN_DOMAIN=lutheran.sfo3.cdn.digitaloceanspaces.com
```

## Important Notes:

1. **Bucket name**: `lutheran` ✓
2. **Region is SFO3** (San Francisco) ✓
3. **CDN Domain**: `lutheran.sfo3.cdn.digitaloceanspaces.com` ✓
4. After adding variables, Railway will automatically redeploy

## Security Warning:

⚠️ **IMPORTANT**: Your API keys were shared publicly. After setup, please:
1. Go to DigitalOcean → API → Spaces Keys
2. Delete the current key
3. Generate a new key
4. Update Railway with the new credentials

## Test After Deployment:

1. Go to your admin panel
2. Upload an image in Gallery or Events
3. Check your DigitalOcean Space - file should appear in `media/` folder
4. Image URL should use your CDN domain
