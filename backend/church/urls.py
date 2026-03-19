from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChurchInfoViewSet, PastorViewSet, ServiceTimeViewSet, CoreValueViewSet

router = DefaultRouter()
router.register(r'info', ChurchInfoViewSet, basename='church-info')
router.register(r'pastors', PastorViewSet, basename='pastor')
router.register(r'service-times', ServiceTimeViewSet, basename='service-time')
router.register(r'core-values', CoreValueViewSet, basename='core-value')

urlpatterns = [
    path('', include(router.urls)),
]

