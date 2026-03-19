# Loading Sample Data into Railway

Your backend is deployed and connected! Now you need to populate the database with sample data.

## Method 1: Using Railway Dashboard (Easiest)

1. Go to https://railway.app/dashboard
2. Select your project: "appealing-communication"
3. Click on the "web" service
4. Look for the "Shell" or "Terminal" icon/tab
5. Click to open the shell

Once in the shell, run these commands one by one:

```bash
# Load church information
python backend/manage.py load_sample_data
```

That's it! The new management command will load all sample data automatically.

## Method 2: Load Data Individually

If you prefer to load data step by step, run these in the Railway shell:

```bash
# 1. Church info
python backend/manage.py shell <<EOF
exec(open('backend/create_church_info.py').read())
EOF

# 2. Service times
python backend/manage.py shell <<EOF
exec(open('backend/create_sample_service_times.py').read())
EOF

# 3. Core values
python backend/manage.py shell <<EOF
exec(open('backend/create_sample_core_values.py').read())
EOF

# 4. Events
python backend/manage.py shell <<EOF
exec(open('backend/create_sample_events.py').read())
EOF

# 5. Sermons
python backend/manage.py shell <<EOF
exec(open('backend/create_sample_sermons.py').read())
EOF

# 6. Ministries
python backend/manage.py shell <<EOF
exec(open('backend/create_sample_ministries.py').read())
EOF

# 7. Donation categories
python backend/manage.py shell <<EOF
exec(open('backend/create_sample_donation_categories.py').read())
EOF

# 8. Gallery
python backend/manage.py shell <<EOF
exec(open('backend/create_sample_gallery.py').read())
EOF
```

## Method 3: Create Superuser

To access the admin panel, create a superuser:

```bash
python backend/manage.py createsuperuser
```

Follow the prompts to set username, email, and password.

## Verify Data Loaded

After loading, check these URLs:

- **Church Info**: https://web-production-4e622.up.railway.app/api/church/info/
- **Events**: https://web-production-4e622.up.railway.app/api/events/
- **Sermons**: https://web-production-4e622.up.railway.app/api/sermons/
- **Admin Panel**: https://web-production-4e622.up.railway.app/admin/

## Check Your Website

Visit https://trinitylutheranchurchtema.com and you should see all the content!

## Troubleshooting

### Can't find the Shell in Railway Dashboard?
- Look for tabs like "Shell", "Terminal", or "Console"
- Or look for an icon that looks like `>_`
- It might be under "Settings" or in the service details page

### Commands not working?
Make sure you're in the Railway shell, not your local terminal. The Railway shell has access to your deployed code and database.

### Still seeing empty data?
- Refresh your browser with Ctrl+Shift+R (or Cmd+Shift+R on Mac)
- Check the Railway logs for any errors
- Verify the commands completed successfully in the shell
