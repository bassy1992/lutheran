# Vercel CLI Deployment Guide

## Quick Start

### Step 1: Login to Vercel

```bash
vercel login
```

This will open your browser to authenticate. Choose your preferred login method (GitHub, GitLab, Bitbucket, or Email).

### Step 2: Navigate to Frontend Directory

```bash
cd front
```

### Step 3: Deploy to Vercel

For preview deployment:
```bash
vercel
```

For production deployment:
```bash
vercel --prod
```

The CLI will ask you:

1. **Set up and deploy?** → Yes
2. **Which scope?** → Select your account/team
3. **Link to existing project?** → No (first time) or Yes (subsequent deploys)
4. **Project name?** → `lutheran` or your preferred name
5. **Directory?** → `.` (current directory)
6. **Override settings?** → No

### Step 4: Set Environment Variables

After first deployment, add environment variables:

```bash
vercel env add VITE_API_BASE_URL
```

When prompted:
- **Value**: `https://your-railway-backend.railway.app/api`
- **Environment**: Production

Or add via dashboard:
```bash
vercel env ls
```

Then go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

---

## Common Commands

### Deploy Commands

```bash
# Preview deployment (test before production)
vercel

# Production deployment
vercel --prod

# Deploy with specific name
vercel --name my-church-site --prod

# Deploy and skip build cache
vercel --prod --force
```

### Project Management

```bash
# List all projects
vercel list

# Link to existing project
vercel link

# Remove link
vercel unlink

# Get project info
vercel inspect
```

### Environment Variables

```bash
# List environment variables
vercel env ls

# Add environment variable
vercel env add VITE_API_BASE_URL

# Remove environment variable
vercel env rm VITE_API_BASE_URL

# Pull environment variables to local .env file
vercel env pull
```

### Logs & Debugging

```bash
# View deployment logs
vercel logs

# View logs for specific deployment
vercel logs [deployment-url]

# View build logs
vercel logs --build
```

### Domain Management

```bash
# List domains
vercel domains ls

# Add custom domain
vercel domains add yourdomain.com

# Remove domain
vercel domains rm yourdomain.com
```

---

## Configuration File

The `vercel.json` file is already configured:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Environment Variables Setup

### Required Variables

1. **VITE_API_BASE_URL** (Required)
   - Production: `https://your-backend.railway.app/api`
   - Development: `http://localhost:8000/api`

2. **VITE_GEMINI_API_KEY** (Optional - for chatbot)
   - Your Gemini API key

### Add via CLI

```bash
cd front

# Add production environment variable
vercel env add VITE_API_BASE_URL production
# Enter: https://your-railway-backend.railway.app/api

# Add preview environment variable (optional)
vercel env add VITE_API_BASE_URL preview
# Enter: https://your-railway-backend.railway.app/api

# Add development environment variable (optional)
vercel env add VITE_API_BASE_URL development
# Enter: http://localhost:8000/api
```

### Add via Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Name: `VITE_API_BASE_URL`
6. Value: `https://your-railway-backend.railway.app/api`
7. Environment: Select **Production**, **Preview**, **Development**
8. Click **Save**

---

## Deployment Workflow

### First Time Deployment

```bash
# 1. Navigate to frontend
cd front

# 2. Install dependencies
npm install

# 3. Test build locally
npm run build

# 4. Login to Vercel
vercel login

# 5. Deploy to preview
vercel

# 6. Test the preview URL
# Visit the URL provided by Vercel

# 7. Add environment variables
vercel env add VITE_API_BASE_URL production

# 8. Deploy to production
vercel --prod
```

### Subsequent Deployments

```bash
cd front
vercel --prod
```

That's it! Vercel will automatically:
- Install dependencies
- Build your project
- Deploy to production
- Provide you with the URL

---

## Automatic Deployments (Git Integration)

### Enable Git Integration

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Git**
4. Connect your GitHub repository
5. Configure:
   - **Production Branch**: `main`
   - **Root Directory**: `front`

Now every push to `main` will automatically deploy to production!

### Preview Deployments

Every pull request will get its own preview URL automatically.

---

## Troubleshooting

### Build Fails

**Check build logs:**
```bash
vercel logs --build
```

**Common issues:**
- Missing dependencies in `package.json`
- TypeScript errors
- Environment variables not set

**Solution:**
```bash
# Test build locally first
cd front
npm install
npm run build
```

### Environment Variables Not Working

**Problem:** Changes to env vars don't take effect

**Solution:**
```bash
# Redeploy after adding env vars
vercel --prod --force
```

Or in dashboard: **Deployments** → **...** → **Redeploy**

### CORS Errors

**Problem:** Frontend can't connect to backend

**Solution:**
1. Check `VITE_API_BASE_URL` is correct
2. Update Railway `CORS_ALLOWED_ORIGINS`:
   ```
   CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   ```

### 404 on Page Refresh

**Problem:** Direct URL access returns 404

**Solution:** Already configured in `vercel.json`:
```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

### Deployment URL Changed

**Problem:** Need to update backend CORS

**Solution:**
```bash
# Get your current deployment URL
vercel ls

# Update Railway CORS_ALLOWED_ORIGINS with new URL
```

---

## Custom Domain Setup

### Add Domain via CLI

```bash
# Add domain
vercel domains add www.trinitylutheranchurch.com

# Vercel will provide DNS records to add
```

### Add Domain via Dashboard

1. Go to **Settings** → **Domains**
2. Click **Add**
3. Enter your domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

### Update Backend CORS

After adding custom domain, update Railway:
```
CORS_ALLOWED_ORIGINS=https://www.trinitylutheranchurch.com,https://trinitylutheranchurch.com
```

---

## Monitoring & Analytics

### View Deployment Status

```bash
vercel ls
```

### View Real-time Logs

```bash
vercel logs --follow
```

### Analytics Dashboard

Go to: https://vercel.com/dashboard → Your Project → **Analytics**

View:
- Page views
- Unique visitors
- Top pages
- Performance metrics

---

## Rollback Deployment

### Via CLI

```bash
# List deployments
vercel ls

# Promote a previous deployment to production
vercel promote [deployment-url]
```

### Via Dashboard

1. Go to **Deployments**
2. Find the deployment you want to rollback to
3. Click **...** → **Promote to Production**

---

## Cost & Limits

### Hobby Plan (Free)
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Preview deployments
- ✅ Analytics

### Pro Plan ($20/month)
- ✅ Everything in Hobby
- ✅ 1TB bandwidth/month
- ✅ Advanced analytics
- ✅ Team collaboration
- ✅ Password protection
- ✅ Priority support

---

## Quick Reference

```bash
# Login
vercel login

# Deploy preview
vercel

# Deploy production
vercel --prod

# Add env var
vercel env add VARIABLE_NAME

# View logs
vercel logs

# List projects
vercel ls

# Get help
vercel --help
```

---

## Automated Deployment Script

Use the provided script for easy deployment:

```bash
# Make script executable (first time only)
chmod +x deploy-vercel.sh

# Run deployment
./deploy-vercel.sh
```

---

## Next Steps After Deployment

1. ✅ Deploy frontend to Vercel
2. ✅ Set `VITE_API_BASE_URL` environment variable
3. ✅ Update Railway `CORS_ALLOWED_ORIGINS`
4. ✅ Test all pages and functionality
5. ✅ Add custom domain (optional)
6. ✅ Enable analytics
7. ✅ Set up monitoring
8. 🎉 Launch!

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Vercel CLI Docs**: https://vercel.com/docs/cli
- **Discord**: https://vercel.com/discord
- **Support**: https://vercel.com/support

---

**Pro Tip**: Use `vercel --prod` for production deployments and test with `vercel` (preview) first!
