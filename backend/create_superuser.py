"""
Create a default superuser for testing
Run with: python manage.py shell < create_superuser.py
"""
from django.contrib.auth import get_user_model

User = get_user_model()

# Delete existing admin user if exists
User.objects.filter(username='admin').delete()

# Create new superuser
user = User.objects.create_superuser(
    username='admin',
    email='admin@church.com',
    password='admin123',
    first_name='Admin',
    last_name='User'
)

print(f"Superuser created successfully!")
print(f"Username: admin")
print(f"Password: admin123")
print(f"Access admin at: http://127.0.0.1:8000/admin/")
