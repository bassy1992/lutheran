# Vercel Deployment Guide

## Overview
This guide covers deploying your church website with:
- **Backend**: Railway (Django API)
- **Frontend**: Vercel (React/Vite)

## Prerequisites
- GitHub account with code pushed
- Vercel account (sign up at https://vercel.com)
- Railway account for backend (https://railway.app)
- Repository: https://github.com/bassy1992/lutheran.git

---

## Part 1: Deploy Backend to Railway

### Step 1: Create Railway Project

1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway and select `bassy1992/lutheran`

### Step 2: Add PostgreSQL Database

1. In Railway project, click "New" → "Database" → "Add PostgreSQL"
2. Railway auto-creates `DATABASE_URL` environment variable

### Step 3: Configure Backend Environment Variables

Add these in Railway project settings:

```
SECRET_KEY=your-generated-secret-key
DEBUG=False
ALLOWED_HOSTS=.railway.app
CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

Generate SECRET_KEY locally:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Step 4: Deploy Backend

Railway will automatically:
- Install dependencies
- Run migrations
- Collect static files
- Start gunicorn server

### Step 5: Create Superuser & Load Data

Open Railway shell and run:
```bash
python backend/manage.py createsuperuser

# Load sample data
python backend/manage.py shell < backend/create_church_info.py
python backend/manage.py shell < backend/create_sample_service_times.py
python backend/manage.py shell < backend/create_sample_core_values.py
python backend/manage.py shell < backend/create_sample_events.py
python backend/manage.py shell < backend/create_sample_sermons.py
python backend/manage.py shell < backend/create_sample_ministries.py
python backend/manage.py shell < backend/create_sample_gallery.py
```

### Step 6: Note Your Backend URL

Your Railway backend URL will be something like:
```
https://lutheran-production.up.railway.app
```

Save this URL - you'll need it for Vercel configuration.

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Project

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository: `bassy1992/lutheran`
4. Vercel will detect it's a monorepo

### Step 2: Configure Project Settings

**Root Directory**: `front`

**Framework Preset**: Vite

**Build Command**: `npm run build`

**Output Directory**: `dist`

**Install Command**: `npm install`

### Step 3: Add Environment Variables

In Vercel project settings, add:

```
VITE_API_URL=https://your-railway-backend.railway.app/api
VITE_GEMINI_API_KEY=your-gemini-api-key-if-needed
```

Replace `your-railway-backend.railway.app` with your actual Railway URL from Part 1, Step 6.

### Step 4: Deploy

1. Click "Deploy"
2. Vercel will build and deploy your frontend
3. You'll get a URL like: `https://lutheran.vercel.app`

### Step 5: Update Backend CORS

Go back to Railway and update the `CORS_ALLOWED_ORIGINS` variable:

```
CORS_ALLOWED_ORIGINS=https://lutheran.vercel.app,https://your-custom-domain.com
```

Replace with your actual Vercel URL.

---

## Part 3: Connect Frontend to Backend

### Update API Configuration

The frontend is already configured to use environment variables. Verify this file:

**File**: `front/constants.tsx`

Should have:
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
```

This will automatically use the `VITE_API_URL` from Vercel environment variables.

---

## Part 4: Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to Vercel project → "Settings" → "Domains"
2. Add your domain (e.g., `www.trinitylutheranchurch.com`)
3. Update DNS records as instructed by Vercel

### Add Custom Domain to Railway

1. Go to Railway project → "Settings" → "Domains"
2. Add subdomain (e.g., `api.trinitylutheranchurch.com`)
3. Update DNS records

### Update Environment Variables

**Railway**:
```
ALLOWED_HOSTS=.railway.app,api.trinitylutheranchurch.com
CORS_ALLOWED_ORIGINS=https://www.trinitylutheranchurch.com,https://trinitylutheranchurch.com
```

**Vercel**:
```
VITE_API_URL=https://api.trinitylutheranchurch.com/api
```

---

## Deployment Checklist

### Backend (Railway)
- [ ] PostgreSQL database added
- [ ] Environment variables configured
- [ ] Backend deployed successfully
- [ ] Migrations completed
- [ ] Static files collected
- [ ] Superuser created
- [ ] Sample data loaded
- [ ] Admin panel accessible at `/admin/`
- [ ] API endpoints working at `/api/`

### Frontend (Vercel)
- [ ] Project imported from GitHub
- [ ] Root directory set to `front`
- [ ] Environment variables added
- [ ] Build successful
- [ ] Frontend deployed
- [ ] Can access website
- [ ] API calls working
- [ ] No CORS errors

### Integration
- [ ] Frontend connects to backend
- [ ] All pages load correctly
- [ ] Images display properly
- [ ] Forms submit successfully
- [ ] Search functionality works
- [ ] Gallery loads
- [ ] Events display
- [ ] Sermons load
- [ ] Donations page works

---

## Testing Your Deployment

### Test Backend API

Visit these URLs (replace with your Railway URL):

```
https://your-backend.railway.app/api/church/info/
https://your-backend.railway.app/api/events/
https://your-backend.railway.app/api/sermons/
https://your-backend.railway.app/admin/
```

### Test Frontend

Visit your Vercel URL and check:
- Home page loads
- Navigation works
- Events page displays
- Sermons page works
- Gallery loads
- Contact form submits
- Search functionality
- Mobile responsiveness

---

## Troubleshooting

### CORS Errors

**Problem**: Frontend can't connect to backend

**Solution**: 
1. Check `CORS_ALLOWED_ORIGINS` in Railway includes your Vercel URL
2. Make sure URL has `https://` prefix
3. No trailing slash in the URL

### Build Fails on Vercel

**Problem**: Build command fails

**Solution**:
1. Check build logs in Vercel
2. Verify `package.json` has correct scripts
3. Ensure all dependencies are in `package.json`
4. Try deploying from a clean branch

### API Calls Return 404

**Problem**: Frontend can't find API endpoints

**Solution**:
1. Verify `VITE_API_URL` in Vercel environment variables
2. Check URL ends with `/api` (no trailing slash)
3. Redeploy frontend after changing env vars

### Images Not Loading

**Problem**: Gallery images don't display

**Solution**:
1. Check media files are uploaded in Railway admin
2. Verify `MEDIA_URL` in Railway settings
3. Check CORS allows media file access

### Environment Variables Not Working

**Problem**: Changes to env vars don't take effect

**Solution**:
1. After changing env vars, redeploy the project
2. In Vercel: Go to Deployments → Click "..." → "Redeploy"
3. In Railway: Changes trigger auto-redeploy

---

## Monitoring & Logs

### Vercel Logs

1. Go to your project in Vercel
2. Click "Deployments"
3. Click on a deployment
4. View "Build Logs" and "Function Logs"

### Railway Logs

1. Go to your project in Railway
2. Click on your service
3. Click "Deployments"
4. View real-time logs

---

## Cost Breakdown

### Vercel
- **Hobby Plan**: FREE
  - 100GB bandwidth
  - Unlimited deployments
  - Custom domains
  - Automatic HTTPS

- **Pro Plan**: $20/month
  - 1TB bandwidth
  - Advanced analytics
  - Team collaboration

### Railway
- **Hobby Plan**: $5/month
  - 512MB RAM
  - 1GB disk
  - PostgreSQL included

- **Pro Plan**: $20/month
  - 8GB RAM
  - 100GB disk
  - Priority support

### Total Cost
- **Free Tier**: $5/month (Railway only)
- **Paid Tier**: $25-40/month (both services)

---

## Continuous Deployment

Both Vercel and Railway support automatic deployments:

### Auto-Deploy on Git Push

1. **Vercel**: Automatically deploys when you push to `main` branch
2. **Railway**: Automatically deploys when you push to `main` branch

### Preview Deployments

**Vercel**: Creates preview URLs for pull requests
**Railway**: Can configure preview environments

---

## Security Best Practices

1. ✅ Use HTTPS (both platforms provide this)
2. ✅ Set `DEBUG=False` in production
3. ✅ Use strong `SECRET_KEY`
4. ✅ Restrict `ALLOWED_HOSTS`
5. ✅ Configure CORS properly
6. ✅ Never commit secrets to Git
7. ✅ Use environment variables
8. ✅ Regular dependency updates
9. ✅ Monitor logs for errors
10. ✅ Enable 2FA on accounts

---

## Backup Strategy

### Database Backups (Railway)
- Automatic daily backups
- Manual backup: Export from Railway dashboard

### Code Backups
- GitHub repository (already done)
- Keep local copy

### Media Files
For production, consider cloud storage:
- **Cloudinary**: Image hosting and optimization
- **AWS S3**: Object storage
- **Google Cloud Storage**: Scalable storage

---

## Performance Optimization

### Frontend (Vercel)
- ✅ Automatic CDN
- ✅ Image optimization
- ✅ Gzip compression
- ✅ HTTP/2 support

### Backend (Railway)
- Use database indexing
- Enable query caching
- Optimize API responses
- Use pagination

---

## Quick Reference

### Vercel Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from CLI
cd front
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs
```

### Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# View logs
railway logs

# Run commands
railway run python backend/manage.py migrate
```

---

## Support Resources

### Vercel
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord
- Support: https://vercel.com/support

### Railway
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Support: team@railway.app

### Your Project
- GitHub: https://github.com/bassy1992/lutheran
- Issues: https://github.com/bassy1992/lutheran/issues

---

## Next Steps

1. ✅ Code pushed to GitHub (completed)
2. 🚀 Deploy backend to Railway
3. 🚀 Deploy frontend to Vercel
4. ✅ Configure environment variables
5. ✅ Test all functionality
6. 🎯 Add custom domain (optional)
7. 📊 Set up monitoring
8. 🎉 Launch your website!

---

**Important Notes**:
- Keep your `SECRET_KEY` secure
- Never commit `.env` files
- Test thoroughly before going live
- Monitor logs after deployment
- Have a rollback plan ready

Good luck with your deployment! 🚀
