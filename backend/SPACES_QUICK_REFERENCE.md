# DigitalOcean Spaces - Quick Reference

## Environment Variables

```bash
USE_SPACES=True
DO_SPACES_KEY=your-access-key
DO_SPACES_SECRET=your-secret-key
DO_SPACES_BUCKET_NAME=your-bucket-name
DO_SPACES_ENDPOINT_URL=https://nyc3.digitaloceanspaces.com
DO_SPACES_REGION=nyc3
DO_SPACES_CDN_DOMAIN=your-bucket-name.nyc3.cdn.digitaloceanspaces.com
```

## Common Regions

| Region | Endpoint URL |
|--------|-------------|
| NYC3 | https://nyc3.digitaloceanspaces.com |
| SFO3 | https://sfo3.digitaloceanspaces.com |
| AMS3 | https://ams3.digitaloceanspaces.com |
| SGP1 | https://sgp1.digitaloceanspaces.com |
| FRA1 | https://fra1.digitaloceanspaces.com |

## CDN Domain Format

```
{bucket-name}.{region}.cdn.digitaloceanspaces.com
```

Example: `lutheran-church.nyc3.cdn.digitaloceanspaces.com`

## Test Upload (Django Shell)

```python
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage

# Upload test file
path = default_storage.save('test.txt', ContentFile(b'Hello!'))
print(default_storage.url(path))

# Delete test file
default_storage.delete(path)
```

## Switch Between Local and Spaces

### Use Spaces (Production)
```bash
USE_SPACES=True
```

### Use Local Storage (Development)
```bash
USE_SPACES=False
```

## File Structure in Spaces

```
your-bucket-name/
└── media/
    ├── gallery/
    │   ├── albums/
    │   ├── photos/
    │   └── thumbnails/
    ├── events/
    ├── sermons/
    └── ...
```

## Useful Commands

### List files in Space
```python
from django.core.files.storage import default_storage
files = default_storage.listdir('media/gallery')[1]
print(files)
```

### Check if file exists
```python
exists = default_storage.exists('media/gallery/photo.jpg')
```

### Get file URL
```python
url = default_storage.url('media/gallery/photo.jpg')
```

### Delete file
```python
default_storage.delete('media/gallery/photo.jpg')
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Images not loading | Check CORS settings in Space |
| Upload fails | Verify API keys and bucket name |
| Wrong URL | Check CDN domain setting |
| Slow loading | Ensure CDN is enabled |

## Cost Calculator

- Base: $5/month (250GB + 1TB transfer)
- Extra storage: $0.02/GB
- Extra transfer: $0.01/GB

Example: 500GB storage + 2TB transfer = $5 + $5 + $10 = $20/month
