# Railway Deployment Guide

## Prerequisites
- GitHub account with your code pushed
- Railway account (sign up at https://railway.app)
- Your repository: https://github.com/bassy1992/lutheran.git

## Step 1: Create Railway Project

1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub
5. Select the `bassy1992/lutheran` repository

## Step 2: Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically create a PostgreSQL database
4. The `DATABASE_URL` environment variable will be automatically set

## Step 3: Configure Environment Variables

In your Railway project settings, add these environment variables:

### Required Variables
```
SECRET_KEY=your-super-secret-key-here-change-this
DEBUG=False
ALLOWED_HOSTS=.railway.app
CORS_ALLOWED_ORIGINS=https://your-frontend-url.com
```

### Generate a Secret Key
Run this command locally to generate a secure secret key:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## Step 4: Deploy

1. Railway will automatically detect your `railway.json` configuration
2. It will install dependencies from `requirements.txt`
3. Run migrations automatically
4. Collect static files
5. Start the gunicorn server

## Step 5: Create Superuser

After deployment, you need to create an admin user:

1. Go to your Railway project
2. Click on your service
3. Go to "Settings" → "Deploy"
4. Click "Open Shell" or use Railway CLI
5. Run:
```bash
python backend/manage.py createsuperuser
```

## Step 6: Load Sample Data

To populate your database with sample data:

```bash
# In Railway shell
python backend/manage.py shell < backend/create_church_info.py
python backend/manage.py shell < backend/create_sample_service_times.py
python backend/manage.py shell < backend/create_sample_core_values.py
python backend/manage.py shell < backend/create_sample_events.py
python backend/manage.py shell < backend/create_sample_sermons.py
python backend/manage.py shell < backend/create_sample_ministries.py
python backend/manage.py shell < backend/create_sample_gallery.py
```

## Step 7: Configure Frontend

Update your frontend API configuration to point to your Railway backend:

**File**: `front/src/services/api/config.ts`

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  'https://your-railway-app.railway.app/api';
```

## Step 8: Deploy Frontend

### Option A: Deploy Frontend on Railway

1. Create a new service in Railway
2. Select your repository
3. Set root directory to `front`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
5. Railway will auto-detect Vite and deploy

### Option B: Deploy Frontend on Vercel/Netlify

1. Connect your GitHub repo
2. Set build command: `cd front && npm run build`
3. Set output directory: `front/dist`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```

## Railway Configuration Files

### `railway.json`
Configures the deployment process:
- Build command
- Start command
- Restart policy

### `Procfile`
Defines the web process:
- Runs migrations
- Collects static files
- Starts gunicorn server

### `runtime.txt`
Specifies Python version: `python-3.9.18`

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key | `django-insecure-...` |
| `DEBUG` | Debug mode (False in production) | `False` |
| `ALLOWED_HOSTS` | Allowed hostnames | `.railway.app,yourdomain.com` |
| `DATABASE_URL` | PostgreSQL connection (auto-set) | `postgresql://...` |
| `CORS_ALLOWED_ORIGINS` | Frontend URLs | `https://yoursite.com` |

## Post-Deployment Checklist

- [ ] Backend deployed successfully
- [ ] Database connected
- [ ] Migrations ran successfully
- [ ] Static files collected
- [ ] Superuser created
- [ ] Sample data loaded
- [ ] Admin panel accessible
- [ ] API endpoints working
- [ ] Frontend deployed
- [ ] Frontend can connect to backend
- [ ] CORS configured correctly
- [ ] Media uploads working
- [ ] SSL/HTTPS enabled

## Accessing Your Application

### Backend
- API: `https://your-app.railway.app/api/`
- Admin: `https://your-app.railway.app/admin/`
- Media: `https://your-app.railway.app/media/`

### Frontend
- Website: `https://your-frontend-url.com/`

## Troubleshooting

### Issue: Migrations not running
**Solution**: Manually run in Railway shell:
```bash
python backend/manage.py migrate
```

### Issue: Static files not loading
**Solution**: Run collectstatic:
```bash
python backend/manage.py collectstatic --noinput
```

### Issue: CORS errors
**Solution**: Update `CORS_ALLOWED_ORIGINS` in Railway environment variables

### Issue: Database connection error
**Solution**: Check that PostgreSQL service is running and `DATABASE_URL` is set

### Issue: 500 Internal Server Error
**Solution**: Check Railway logs:
1. Go to your service
2. Click "Deployments"
3. View logs for error details

## Monitoring

### View Logs
1. Go to your Railway project
2. Click on your service
3. Click "Deployments"
4. View real-time logs

### Check Metrics
- CPU usage
- Memory usage
- Network traffic
- Request count

## Scaling

Railway automatically scales based on your plan:
- **Hobby Plan**: $5/month, 512MB RAM
- **Pro Plan**: $20/month, 8GB RAM
- **Team Plan**: Custom pricing

## Backup Strategy

### Database Backups
Railway automatically backs up PostgreSQL databases.

To manually backup:
```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql
```

### Media Files Backup
For production, consider using cloud storage:
- AWS S3
- Cloudinary
- Google Cloud Storage

## Custom Domain

1. Go to Railway project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `ALLOWED_HOSTS` in environment variables

## Security Best Practices

1. ✅ Use strong `SECRET_KEY`
2. ✅ Set `DEBUG=False` in production
3. ✅ Use HTTPS (Railway provides this)
4. ✅ Restrict `ALLOWED_HOSTS`
5. ✅ Configure CORS properly
6. ✅ Use environment variables for secrets
7. ✅ Regular security updates
8. ✅ Monitor logs for suspicious activity

## Cost Estimation

### Railway Costs
- **Hobby Plan**: $5/month
  - 512MB RAM
  - 1GB disk
  - Shared CPU

- **Pro Plan**: $20/month
  - 8GB RAM
  - 100GB disk
  - Dedicated CPU

### PostgreSQL
- Included in Railway plan
- Automatic backups
- Managed service

## Support

### Railway Support
- Documentation: https://docs.railway.app
- Discord: https://discord.gg/railway
- Email: team@railway.app

### Project Issues
- GitHub Issues: https://github.com/bassy1992/lutheran/issues

## Next Steps

1. Deploy backend to Railway
2. Configure environment variables
3. Create superuser
4. Load sample data
5. Deploy frontend
6. Test all functionality
7. Configure custom domain (optional)
8. Set up monitoring
9. Plan backup strategy
10. Launch! 🚀

---

**Note**: Keep your `SECRET_KEY` and database credentials secure. Never commit them to Git!
