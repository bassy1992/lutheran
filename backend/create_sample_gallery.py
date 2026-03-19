"""
Create sample gallery albums and photos
Run with: python manage.py shell < create_sample_gallery.py
"""
from gallery.models import GalleryAlbum, GalleryPhoto
from datetime import datetime, timedelta
from django.utils import timezone

# Clear existing gallery data
GalleryPhoto.objects.all().delete()
GalleryAlbum.objects.all().delete()

# Create sample albums
albums_data = [
    {
        'title': 'Easter Sunday Celebration 2026',
        'description': 'Celebrating the resurrection of our Lord Jesus Christ with joy and thanksgiving.',
        'cover_image': 'https://picsum.photos/seed/easter2026/1200/800',
        'date': datetime(2026, 4, 5).date(),
        'is_featured': True,
        'is_published': True,
    },
    {
        'title': 'Youth Conference 2026',
        'description': 'Young people gathering for worship, learning, and fellowship.',
        'cover_image': 'https://picsum.photos/seed/youth-conf-2026/1200/800',
        'date': datetime(2026, 3, 15).date(),
        'is_featured': True,
        'is_published': True,
    },
    {
        'title': 'Christmas Service 2025',
        'description': 'Celebrating the birth of our Savior with carols, drama, and worship.',
        'cover_image': 'https://picsum.photos/seed/christmas2025/1200/800',
        'date': datetime(2025, 12, 25).date(),
        'is_featured': False,
        'is_published': True,
    },
    {
        'title': 'Community Outreach - Tema',
        'description': 'Serving our community with food, clothing, and the love of Christ.',
        'cover_image': 'https://picsum.photos/seed/outreach-tema/1200/800',
        'date': datetime(2026, 2, 20).date(),
        'is_featured': True,
        'is_published': True,
    },
    {
        'title': 'Baptism Service',
        'description': 'New believers publicly declaring their faith through baptism.',
        'cover_image': 'https://picsum.photos/seed/baptism2026/1200/800',
        'date': datetime(2026, 1, 10).date(),
        'is_featured': False,
        'is_published': True,
    },
]

albums = []
for album_data in albums_data:
    album = GalleryAlbum.objects.create(**album_data)
    albums.append(album)
    print(f"Created album: {album.title}")

# Create sample photos for each album
photos_per_album = [
    # Easter Sunday photos
    [
        {'title': 'Sunrise Service', 'description': 'Early morning worship as the sun rises', 'order': 1, 'is_featured': True},
        {'title': 'Choir Performance', 'description': 'The choir leading us in worship', 'order': 2, 'is_featured': False},
        {'title': 'Children\'s Program', 'description': 'Children presenting the Easter story', 'order': 3, 'is_featured': False},
        {'title': 'Congregation Worship', 'description': 'The congregation in praise and worship', 'order': 4, 'is_featured': False},
        {'title': 'Pastor\'s Message', 'description': 'Pastor delivering the resurrection message', 'order': 5, 'is_featured': False},
        {'title': 'Fellowship Time', 'description': 'Members fellowshipping after service', 'order': 6, 'is_featured': False},
    ],
    # Youth Conference photos
    [
        {'title': 'Opening Session', 'description': 'Youth gathering for the opening session', 'order': 1, 'is_featured': True},
        {'title': 'Worship Team', 'description': 'Youth worship team leading praise', 'order': 2, 'is_featured': False},
        {'title': 'Workshop Session', 'description': 'Interactive workshop on faith and life', 'order': 3, 'is_featured': False},
        {'title': 'Group Discussion', 'description': 'Small group discussions and prayer', 'order': 4, 'is_featured': False},
        {'title': 'Guest Speaker', 'description': 'Inspiring message from guest speaker', 'order': 5, 'is_featured': False},
    ],
    # Christmas Service photos
    [
        {'title': 'Christmas Decorations', 'description': 'Beautiful church decorations', 'order': 1, 'is_featured': True},
        {'title': 'Nativity Play', 'description': 'Children performing the nativity story', 'order': 2, 'is_featured': False},
        {'title': 'Carol Singing', 'description': 'Congregation singing Christmas carols', 'order': 3, 'is_featured': False},
        {'title': 'Candlelight Service', 'description': 'Beautiful candlelight worship', 'order': 4, 'is_featured': False},
    ],
    # Community Outreach photos
    [
        {'title': 'Food Distribution', 'description': 'Distributing food to families in need', 'order': 1, 'is_featured': True},
        {'title': 'Medical Checkup', 'description': 'Free health screenings for the community', 'order': 2, 'is_featured': False},
        {'title': 'Children\'s Activities', 'description': 'Fun activities for children', 'order': 3, 'is_featured': False},
        {'title': 'Prayer Ministry', 'description': 'Praying with community members', 'order': 4, 'is_featured': False},
        {'title': 'Volunteer Team', 'description': 'Our dedicated volunteer team', 'order': 5, 'is_featured': False},
    ],
    # Baptism Service photos
    [
        {'title': 'Baptism Ceremony', 'description': 'New believers being baptized', 'order': 1, 'is_featured': True},
        {'title': 'Baptism Candidates', 'description': 'Candidates preparing for baptism', 'order': 2, 'is_featured': False},
        {'title': 'Family Celebration', 'description': 'Families celebrating together', 'order': 3, 'is_featured': False},
        {'title': 'Congregation Witness', 'description': 'Congregation witnessing the baptisms', 'order': 4, 'is_featured': False},
    ],
]

for i, album in enumerate(albums):
    for j, photo_data in enumerate(photos_per_album[i]):
        photo = GalleryPhoto.objects.create(
            album=album,
            title=photo_data['title'],
            description=photo_data['description'],
            image=f'https://picsum.photos/seed/{album.title.lower().replace(" ", "-")}-{j}/1200/800',
            thumbnail=f'https://picsum.photos/seed/{album.title.lower().replace(" ", "-")}-{j}/400/300',
            photographer='Church Media Team',
            date_taken=album.date,
            order=photo_data['order'],
            is_featured=photo_data['is_featured'],
        )
        print(f"  Created photo: {photo.title}")

print(f"\nTotal albums created: {GalleryAlbum.objects.count()}")
print(f"Total photos created: {GalleryPhoto.objects.count()}")
