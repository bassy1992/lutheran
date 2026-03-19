# Logo Setup Instructions

To use your Lutheran rose logo:

1. Save your logo image as one of these:
   - `front/public/logo.png` (recommended)
   - `front/public/logo.svg` (for vector graphics)

2. The logo should be:
   - Square or circular format
   - Transparent background (PNG with alpha channel or SVG)
   - At least 200x200 pixels for PNG
   - Optimized file size (< 100KB)

3. After adding the logo file, commit and push:
   ```bash
   git add front/public/logo.png
   git commit -m "Add church logo"
   git push
   ```

4. Vercel will automatically redeploy with the new logo

## Current Setup
The navbar is configured to display:
- Logo image (48x48px in navbar, 40x40px in footer)
- Falls back to Church icon if logo.png is not found
- Text: "TRINITY LUTHERAN" and "GHANA"

## Recommended Logo Specifications
- Format: PNG with transparency or SVG
- Size: 512x512px (will be scaled down)
- Colors: Should work well on dark background (navbar is slate-900)
- File name: logo.png or logo.svg
