# DigitalOcean Spaces Setup Guide

This guide will help you set up DigitalOcean Spaces for storing media files (images, uploads) for your Django church management system.

## Why Use DigitalOcean Spaces?

- **Scalable Storage**: Store unlimited media files without worrying about server disk space
- **CDN Integration**: Built-in CDN for fast global content delivery
- **Cost-Effective**: Pay only for what you use (~$5/month for 250GB)
- **S3-Compatible**: Works with standard S3 tools and libraries
- **Reliable**: 99.9% uptime SLA

## Step 1: Create a DigitalOcean Spaces Bucket

1. Log in to your DigitalOcean account at https://cloud.digitalocean.com/
2. Click on **Spaces** in the left sidebar
3. Click **Create a Space**
4. Configure your Space:
   - **Choose a datacenter region**: Select closest to your users (e.g., NYC3, SFO3, AMS3)
   - **Enable CDN**: Toggle ON (recommended for faster delivery)
   - **Choose a unique name**: e.g., `lutheran-church-media`
   - **Select a project**: Choose your project or create a new one
5. Click **Create a Space**

## Step 2: Generate API Keys

1. In the DigitalOcean dashboard, click on **API** in the left sidebar
2. Scroll down to **Spaces access keys**
3. Click **Generate New Key**
4. Give it a name (e.g., "Django Church App")
5. **IMPORTANT**: Copy both the **Access Key** and **Secret Key** immediately
   - You won't be able to see the Secret Key again!
6. Store these keys securely

## Step 3: Configure CORS (Cross-Origin Resource Sharing)

1. Go to your Space in the DigitalOcean dashboard
2. Click on **Settings** tab
3. Scroll to **CORS Configurations**
4. Click **Add** and configure:

```json
{
  "AllowedOrigins": ["*"],
  "AllowedMethods": ["GET", "HEAD", "POST", "PUT", "DELETE"],
  "AllowedHeaders": ["*"],
  "MaxAgeSeconds": 3000
}
```

For production, replace `"*"` in AllowedOrigins with your actual domain:
```json
{
  "AllowedOrigins": ["https://yourdomain.com", "https://www.yourdomain.com"],
  "AllowedMethods": ["GET", "HEAD", "POST", "PUT"],
  "AllowedHeaders": ["*"],
  "MaxAgeSeconds": 3000
}
```

## Step 4: Set Environment Variables

### For Railway Deployment:

1. Go to your Railway project dashboard
2. Click on your backend service
3. Go to **Variables** tab
4. Add the following environment variables:

```bash
USE_SPACES=True
DO_SPACES_KEY=your-access-key-here
DO_SPACES_SECRET=your-secret-key-here
DO_SPACES_BUCKET_NAME=lutheran-church-media
DO_SPACES_ENDPOINT_URL=https://nyc3.digitaloceanspaces.com
DO_SPACES_REGION=nyc3
DO_SPACES_CDN_DOMAIN=lutheran-church-media.nyc3.cdn.digitaloceanspaces.com
```

**Important Notes:**
- Replace `nyc3` with your chosen region (e.g., `sfo3`, `ams3`, `sgp1`)
- Replace `lutheran-church-media` with your actual bucket name
- The CDN domain format is: `{bucket-name}.{region}.cdn.digitaloceanspaces.com`
- The endpoint URL format is: `https://{region}.digitaloceanspaces.com`

### For Local Development:

Create a `.env` file in the backend directory:

```bash
# Local development - use local storage
USE_SPACES=False

# Or test with Spaces
USE_SPACES=True
DO_SPACES_KEY=your-access-key-here
DO_SPACES_SECRET=your-secret-key-here
DO_SPACES_BUCKET_NAME=lutheran-church-media
DO_SPACES_ENDPOINT_URL=https://nyc3.digitaloceanspaces.com
DO_SPACES_REGION=nyc3
DO_SPACES_CDN_DOMAIN=lutheran-church-media.nyc3.cdn.digitaloceanspaces.com
```

## Step 5: Install Dependencies

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

## Step 6: Test the Configuration

### Test Upload (Python Shell):

```bash
python manage.py shell
```

```python
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage

# Test upload
path = default_storage.save('test/test.txt', ContentFile(b'Hello DigitalOcean Spaces!'))
print(f"File saved to: {path}")
print(f"File URL: {default_storage.url(path)}")

# Test file exists
exists = default_storage.exists(path)
print(f"File exists: {exists}")

# Clean up
default_storage.delete(path)
print("Test file deleted")
```

### Test via Admin:

1. Go to your admin panel: https://your-domain.com/admin/
2. Upload an image in Gallery or Events
3. Check your DigitalOcean Space - you should see the file in the `media/` folder
4. The image URL should use your CDN domain

## Step 7: Migrate Existing Media Files (Optional)

If you have existing media files, you can migrate them to Spaces:

```bash
# Install AWS CLI or use this Python script
python manage.py shell
```

```python
import os
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

# Path to your local media directory
local_media_path = 'media/'

for root, dirs, files in os.walk(local_media_path):
    for filename in files:
        local_path = os.path.join(root, filename)
        relative_path = os.path.relpath(local_path, local_media_path)
        
        with open(local_path, 'rb') as f:
            content = f.read()
            default_storage.save(relative_path, ContentFile(content))
            print(f"Uploaded: {relative_path}")
```

## Pricing

DigitalOcean Spaces pricing (as of 2024):
- **$5/month** for 250 GB storage
- **$0.02/GB** for additional storage
- **$0.01/GB** for outbound transfer (first 1TB free with CDN)

Example costs:
- Small church (10GB media): $5/month
- Medium church (500GB media): $10/month
- Large church (1TB media): $20/month

## Troubleshooting

### Images not loading:
1. Check CORS configuration in your Space settings
2. Verify environment variables are set correctly
3. Check that files are public-read (set in settings.py)

### Upload errors:
1. Verify API keys are correct
2. Check bucket name matches exactly
3. Ensure region and endpoint URL match

### CDN not working:
1. Make sure CDN is enabled in Space settings
2. Use the CDN domain in `DO_SPACES_CDN_DOMAIN` variable
3. Wait a few minutes for CDN propagation

## Security Best Practices

1. **Never commit API keys** to version control
2. Use **environment variables** for all sensitive data
3. Restrict **CORS origins** to your actual domains in production
4. Consider using **IAM policies** to limit key permissions
5. Rotate API keys periodically
6. Use **separate Spaces** for development and production

## Monitoring

Monitor your Space usage:
1. Go to DigitalOcean dashboard
2. Click on your Space
3. View **Usage** tab for:
   - Storage used
   - Bandwidth used
   - Request count
   - Cost estimates

## Backup Strategy

DigitalOcean Spaces doesn't have automatic backups. Consider:
1. Enable **versioning** in Space settings (keeps old versions of files)
2. Use **rclone** or **s3cmd** for periodic backups
3. Keep critical files in multiple locations

## Additional Resources

- [DigitalOcean Spaces Documentation](https://docs.digitalocean.com/products/spaces/)
- [Django Storages Documentation](https://django-storages.readthedocs.io/)
- [boto3 Documentation](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html)

## Support

If you encounter issues:
1. Check DigitalOcean status page
2. Review Django logs for error messages
3. Test with the Python shell commands above
4. Contact DigitalOcean support if needed
