#!/bin/bash

# Script to load sample data into Railway deployment
# Run this after deploying to Railway

echo "Loading sample data into Railway database..."
echo ""
echo "Make sure you have Railway CLI installed: npm i -g @railway/cli"
echo "And you're logged in: railway login"
echo ""

# Link to your Railway project if not already linked
echo "Step 1: Link to Railway project"
railway link

echo ""
echo "Step 2: Create superuser"
railway run python backend/manage.py createsuperuser

echo ""
echo "Step 3: Load church information"
railway run python backend/manage.py shell < backend/create_church_info.py

echo ""
echo "Step 4: Load service times"
railway run python backend/manage.py shell < backend/create_sample_service_times.py

echo ""
echo "Step 5: Load core values"
railway run python backend/manage.py shell < backend/create_sample_core_values.py

echo ""
echo "Step 6: Load sample events"
railway run python backend/manage.py shell < backend/create_sample_events.py

echo ""
echo "Step 7: Load sample sermons"
railway run python backend/manage.py shell < backend/create_sample_sermons.py

echo ""
echo "Step 8: Load sample ministries"
railway run python backend/manage.py shell < backend/create_sample_ministries.py

echo ""
echo "Step 9: Load sample donation categories"
railway run python backend/manage.py shell < backend/create_sample_donation_categories.py

echo ""
echo "Step 10: Load sample gallery"
railway run python backend/manage.py shell < backend/create_sample_gallery.py

echo ""
echo "✅ Sample data loaded successfully!"
echo ""
echo "You can now:"
echo "  - Visit your admin panel: https://web-production-4e622.up.railway.app/admin/"
echo "  - Check your API: https://web-production-4e622.up.railway.app/api/church/info/"
echo "  - View your site: https://trinitylutheranchurchtema.com"
