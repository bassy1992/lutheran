"""
Create church information
Run with: python manage.py shell < create_church_info.py
"""
from church.models import ChurchInfo

# Clear existing church info
ChurchInfo.objects.all().delete()

# Create church info
church_info = ChurchInfo.objects.create(
    name='Trinity Lutheran Church Ghana',
    tagline='Spreading Grace and Truth',
    description='Trinity Lutheran Church Ghana is a vibrant community of believers dedicated to spreading the grace and truth of Jesus Christ throughout Ghana. We are committed to worship, fellowship, discipleship, and service.',
    address='P.O BOX CO 143, Cocoa Village',
    city='Tema',
    country='Ghana',
    phone='+233 24 130 3374',
    email='info@trinitylutheranghana.org',
    website='https://trinitylutheranghana.org',
    founded_year=1995,
    facebook_url='https://www.facebook.com/share/1U3k2yAcP6/?mibextid=wwXIfr',
    twitter_url='https://x.com/trinityluthgh?s=11',
    instagram_url='https://www.instagram.com/trinitylutherangh?igsh=ZzhuajFxZnd6eHJp',
    youtube_url='https://youtube.com/@trinitylutheranghana',
)

print(f"Created church info: {church_info.name}")
print(f"Location: {church_info.city}, {church_info.country}")
print(f"Address: {church_info.address}")
print(f"Phone: {church_info.phone}")
print(f"Alt Phone: +233 27 741 6250")
print(f"Email: {church_info.email}")
print(f"\nSocial Media:")
print(f"Facebook: {church_info.facebook_url}")
print(f"Twitter/X: {church_info.twitter_url}")
print(f"Instagram: {church_info.instagram_url}")
print(f"YouTube: {church_info.youtube_url}")
