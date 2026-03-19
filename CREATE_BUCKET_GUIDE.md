# Create Your DigitalOcean Space Bucket

## Step 1: Create the Space

1. Go to https://cloud.digitalocean.com/spaces
2. Click **"Create a Space"**
3. Configure:
   - **Region**: San Francisco 3 (SFO3) - matches your credentials
   - **Enable CDN**: Toggle ON ✓
   - **Space Name**: `lutheran-church-media` (or your preferred name)
   - **File Listing**: Private (recommended)
4. Click **"Create a Space"**

## Step 2: Configure CORS

1. Click on your newly created Space
2. Go to **Settings** tab
3. Scroll to **CORS Configurations**
4. Click **Add CORS Configuration**
5. Add this configuration:

```json
{
  "AllowedOrigins": ["*"],
  "AllowedMethods": ["GET", "HEAD", "POST", "PUT", "DELETE"],
  "AllowedHeaders": ["*"],
  "MaxAgeSeconds": 3000
}
```

6. Click **Save**

## Step 3: Note Your CDN Domain

After creating the Space, you'll see:
- **Space URL**: `https://lutheran-church-media.sfo3.digitaloceanspaces.com`
- **CDN Endpoint**: `https://lutheran-church-media.sfo3.cdn.digitaloceanspaces.com`

Use the CDN endpoint for faster delivery!

## Step 4: Update Environment Variables

If you used a different bucket name, update these in Railway:

```bash
DO_SPACES_BUCKET_NAME=your-actual-bucket-name
DO_SPACES_CDN_DOMAIN=your-actual-bucket-name.sfo3.cdn.digitaloceanspaces.com
```

## Step 5: Test Upload

After Railway redeploys:
1. Go to your admin: https://web-production-4e622.up.railway.app/admin/
2. Navigate to Gallery → Add Photo
3. Upload an image
4. Check your Space - you should see it in the `media/` folder
5. The image URL should use your CDN domain

## Folder Structure

Your Space will automatically organize files like this:

```
lutheran-church-media/
└── media/
    ├── gallery/
    │   ├── albums/
    │   ├── photos/
    │   └── thumbnails/
    ├── events/
    ├── sermons/
    └── ...
```

## Troubleshooting

### Images not loading?
- Check CORS configuration
- Verify bucket name matches exactly
- Ensure files are public-read (configured in Django settings)

### Upload fails?
- Verify API keys are correct
- Check bucket exists in SFO3 region
- Review Django logs for errors

## Cost Estimate

- **Base**: $5/month (250GB storage + 1TB transfer)
- Your church media will likely stay within this base tier
- Monitor usage in DigitalOcean dashboard
