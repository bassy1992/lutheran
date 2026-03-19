# Setting Up Vercel Environment Variables

## Your Issue
The frontend is trying to connect to `http://127.0.0.1:8000` instead of your Railway backend.

## Your Railway Backend URL
```
https://web-production-4e622.up.railway.app/api
```

## Solution: Set Environment Variable in Vercel Dashboard

### Step-by-Step Instructions:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/bassys-projects-fca17413/trinity-lutheran-church-ghana/settings/environment-variables

2. **Add Environment Variable**
   - Click "Add New" or "Add Variable"
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://web-production-4e622.up.railway.app/api`
   - **Environments**: Select all three:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Click **Save**

3. **Redeploy Your Application**
   - Go to: https://vercel.com/bassys-projects-fca17413/trinity-lutheran-church-ghana
   - Click on the latest deployment
   - Click the three dots menu (⋯)
   - Select "Redeploy"
   - Confirm the redeployment

### Alternative: Use Vercel CLI

If you prefer the command line:

```bash
cd front

# Add the environment variable (you'll be prompted to enter the value)
vercel env add VITE_API_BASE_URL

# When prompted:
# - Enter value: https://web-production-4e622.up.railway.app/api
# - Select environments: Production, Preview, Development (use space to select, enter to confirm)

# Then redeploy
vercel --prod
```

## Verify the Backend is Working

Test these URLs in your browser:

1. **Church Info**: https://web-production-4e622.up.railway.app/api/church/info/
2. **Events**: https://web-production-4e622.up.railway.app/api/events/
3. **Admin Panel**: https://web-production-4e622.up.railway.app/admin/

If these work, your backend is ready. You just need to connect the frontend.

## After Setting the Environment Variable

Once you've set the variable and redeployed:

1. Visit your site: https://trinitylutheranchurchtema.com
2. Open browser console (F12)
3. Check the API requests - they should now go to Railway instead of localhost
4. The 404 errors should be gone

## Troubleshooting

### If you still see localhost in API requests:
- Clear your browser cache
- Do a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Verify the environment variable is set in Vercel dashboard
- Make sure you redeployed after adding the variable

### If you see CORS errors:
The backend already has `CORS_ALLOW_ALL_ORIGINS = True` in production, so CORS should work.

### If the backend returns 404:
Make sure the URL includes `/api` at the end:
- ✅ Correct: `https://web-production-4e622.up.railway.app/api`
- ❌ Wrong: `https://web-production-4e622.up.railway.app`

