from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SermonSeriesViewSet, SermonViewSet

router = DefaultRouter()
router.register(r'series', SermonSeriesViewSet, basename='sermon-series')
router.register(r'sermons', SermonViewSet, basename='sermon')

urlpatterns = [
    path('', include(router.urls)),
]
