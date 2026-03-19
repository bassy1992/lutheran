# DigitalOcean Spaces Setup - Quick Start

## Your Configuration

- **Region**: SFO3 (San Francisco)
- **Access Key**: DO8014PDYEMPMGC8CMYR
- **Endpoint**: https://sfo3.digitaloceanspaces.com

## Setup Checklist

### ☐ 1. Create Space Bucket
- Go to: https://cloud.digitalocean.com/spaces
- Create new Space in SFO3 region
- Enable CDN
- Name it (e.g., `lutheran-church-media`)
- See: `CREATE_BUCKET_GUIDE.md`

### ☐ 2. Configure CORS
- In Space settings, add CORS configuration
- Allow GET, POST, PUT, DELETE methods
- See: `CREATE_BUCKET_GUIDE.md`

### ☐ 3. Add Environment Variables to Railway
- Go to Railway dashboard
- Add variables from `RAILWAY_SPACES_ENV_VARS.md`
- Update bucket name if different
- Railway will auto-redeploy

### ☐ 4. Test Connection (Optional - Local)
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Copy environment variables
cp .env.spaces .env

# Run test
python test_spaces_connection.py
```

### ☐ 5. Test Upload via Admin
- Go to: https://web-production-4e622.up.railway.app/admin/
- Upload an image in Gallery
- Verify it appears in your Space
- Check URL uses CDN domain

### ☐ 6. Rotate API Keys (Security)
⚠️ **IMPORTANT**: Your keys were shared publicly
- Go to DigitalOcean → API → Spaces Keys
- Delete current key
- Generate new key
- Update Railway variables

## Files Created

1. `RAILWAY_SPACES_ENV_VARS.md` - Variables to add to Railway
2. `CREATE_BUCKET_GUIDE.md` - Step-by-step bucket creation
3. `DIGITALOCEAN_SPACES_SETUP.md` - Complete documentation
4. `backend/SPACES_QUICK_REFERENCE.md` - Quick reference
5. `backend/test_spaces_connection.py` - Connection test script
6. `backend/.env.spaces` - Local environment template

## Quick Commands

### Test locally:
```bash
cd backend
source venv/bin/activate
cp .env.spaces .env
python test_spaces_connection.py
```

### Check Django shell:
```bash
python manage.py shell
```
```python
from django.core.files.storage import default_storage
print(default_storage.url('test.jpg'))
```

## Expected Behavior

### Before Spaces:
- Media files stored on Railway server
- Limited storage space
- Files lost on redeployment

### After Spaces:
- Media files stored in DigitalOcean
- Unlimited scalable storage
- Files persist across deployments
- Fast CDN delivery globally

## Cost

- **$5/month** for 250GB storage + 1TB transfer
- Most churches stay within this tier
- Monitor usage in DigitalOcean dashboard

## Support

If you need help:
1. Check `DIGITALOCEAN_SPACES_SETUP.md` for detailed guide
2. Run `test_spaces_connection.py` to diagnose issues
3. Review Django logs for error messages
4. Check DigitalOcean Space settings (CORS, permissions)

## Next Steps

1. ✓ Code is ready and deployed
2. → Create your Space bucket
3. → Add environment variables to Railway
4. → Test upload via admin
5. → Rotate API keys for security
