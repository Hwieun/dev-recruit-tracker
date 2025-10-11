from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PositionViewSet, ProcessNoteViewSet, InterviewEventViewSet

router = DefaultRouter()
router.register(r'positions', PositionViewSet, basename='position')
router.register(r'notes', ProcessNoteViewSet, basename='processnote')
router.register(r'events', InterviewEventViewSet, basename='interviewevent')

urlpatterns = [
    path('', include(router.urls)),
]
