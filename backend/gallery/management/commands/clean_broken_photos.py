from django.core.management.base import BaseCommand
from gallery.models import GalleryPhoto


class Command(BaseCommand):
    help = 'Clean up photos with broken/malformed URLs'

    def handle(self, *args, **options):
        self.stdout.write("Cleaning up photos with broken URLs...")
        
        # Find photos with malformed URLs (containing %3A which is URL-encoded colon)
        broken_photos = GalleryPhoto.objects.filter(image__contains='%3A')
        
        count = broken_photos.count()
        
        if count == 0:
            self.stdout.write(self.style.SUCCESS('No broken photos found!'))
            return
        
        self.stdout.write(f"Found {count} photos with broken URLs")
        
        for photo in broken_photos:
            album_title = photo.album.title
            self.stdout.write(f"  - Deleting: {photo.title} from {album_title}")
            photo.delete()
        
        self.stdout.write(self.style.SUCCESS(f'\n✓ Cleaned up {count} broken sample photos'))
        self.stdout.write('\nYou can now upload real photos using the bulk upload feature in Django Admin')
