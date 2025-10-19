from rest_framework import serializers
from .models import Position, ProcessNote, InterviewEvent


class ProcessNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessNote
        fields = ['id', 'process_type', 'title', 'content', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class InterviewEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewEvent
        fields = [
            'id', 'position', 'event_type', 'title', 'description',
            'start_datetime', 'duration', 'meeting_type', 'location',
            'meeting_link', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class PositionSerializer(serializers.ModelSerializer):
    notes = ProcessNoteSerializer(many=True, read_only=True)
    events = InterviewEventSerializer(many=True, read_only=True)

    class Meta:
        model = Position
        fields = [
            'id', 'company_name', 'position_title', 'job_description',
            'recruiting_link', 'current_status', 'salary_range', 'location',
            'application_date', 'created_at', 'updated_at', 'notes', 'events'
        ]
        read_only_fields = ['created_at', 'updated_at']


class PositionListSerializer(serializers.ModelSerializer):
    """Lighter serializer for list views"""
    class Meta:
        model = Position
        fields = [
            'id', 'company_name', 'position_title', 'current_status',
            'location', 'application_date', 'updated_at'
        ]
