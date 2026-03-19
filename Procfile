web: python backend/manage.py migrate && python backend/manage.py collectstatic --noinput && gunicorn --chdir backend church_backend.wsgi:application --bind 0.0.0.0:$PORT
