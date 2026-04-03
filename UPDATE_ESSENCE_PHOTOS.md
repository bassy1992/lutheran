# Update "Our Essence" Section Photos

The "Our Essence" section on the home page now dynamically loads featured photos from your gallery. Here's how to update them with your actual church photos:

## Option 1: Using Django Admin (Recommended)

1. **Go to Django Admin**: Navigate to `/admin/gallery/galleryphoto/`

2. **Upload or Edit Photos**:
   - Click "Add Gallery Photo" to upload new photos
   - Or edit existing photos

3. **Mark as Featured**:
   - Check the "Is featured" checkbox
   - Only the first 2 featured photos will appear in the "Our Essence" section

4. **Save**: Click "Save" and the home page will automatically update

## Option 2: Using the Upload Script

Run the interactive script to upload photos with URLs:

```bash
cd backend
python upload_essence_photos.py
```

The script will prompt you for:
- Image URL 1 (left image in the grid)
- Image URL 2 (right image in the grid)

You can provide:
- DigitalOcean Spaces URLs (e.g., `https://your-space.fra1.digitaloceanspaces.com/photo.jpg`)
- Any direct image URL
- Local file paths (must be accessible by Django)

## Option 3: Mark Existing Photos as Featured

If you already have photos in your gallery:

```bash
cd backend
python mark_photos_featured.py
```

This script will:
1. Show you all available photos
2. Let you select which ones to mark as featured
3. The first 2 featured photos will appear on the home page

## Tips

- **Image Size**: Use high-quality images (at least 400x500px)
- **Aspect Ratio**: Portrait orientation works best (3:4 ratio)
- **Content**: Choose photos that showcase your church community and worship
- **Featured Photos**: Only mark 2 photos as featured for the "Our Essence" section
- **More Photos**: You can have more featured photos for other sections (they'll be used in order)

## Current Behavior

- If no featured photos exist, placeholder images will be shown
- Photos are loaded dynamically from the database
- Changes in the admin panel reflect immediately on the home page
- Loading skeletons are shown while photos are being fetched

## Example URLs

If using DigitalOcean Spaces:
```
https://trinity-lutheran.fra1.digitaloceanspaces.com/gallery/photos/church-service.jpg
https://trinity-lutheran.fra1.digitaloceanspaces.com/gallery/photos/congregation.jpg
```

## Troubleshooting

**Photos not showing?**
- Check that photos are marked as "Is featured" = True
- Verify the image URLs are accessible
- Check browser console for any errors
- Ensure at least 2 photos are marked as featured

**Wrong photos showing?**
- Run `python mark_photos_featured.py` to select different photos
- Or edit photos in Django admin and toggle "Is featured"
