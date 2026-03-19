from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GalleryAlbumViewSet, GalleryPhotoViewSet

router = DefaultRouter()
router.register(r'albums', GalleryAlbumViewSet, basename='gallery-album')
router.register(r'photos', GalleryPhotoViewSet, basename='gallery-photo')

urlpatterns = [
    path('', include(router.urls)),
]
