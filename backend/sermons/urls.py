from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SermonSeriesViewSet, SermonViewSet, WeeklyBulletinViewSet

router = DefaultRouter()
router.register(r'series', SermonSeriesViewSet, basename='sermon-series')
router.register(r'sermons', SermonViewSet, basename='sermon')
router.register(r'bulletins', WeeklyBulletinViewSet, basename='weekly-bulletin')

urlpatterns = [
    path('', include(router.urls)),
]
