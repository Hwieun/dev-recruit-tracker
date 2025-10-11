from django.contrib import admin
from .models import Position, ProcessNote, InterviewEvent


@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'position_title', 'current_status', 'application_date', 'updated_at']
    list_filter = ['current_status', 'application_date']
    search_fields = ['company_name', 'position_title', 'location']


@admin.register(ProcessNote)
class ProcessNoteAdmin(admin.ModelAdmin):
    list_display = ['position', 'process_type', 'title', 'created_at']
    list_filter = ['process_type', 'created_at']
    search_fields = ['title', 'content']


@admin.register(InterviewEvent)
class InterviewEventAdmin(admin.ModelAdmin):
    list_display = ['position', 'event_type', 'title', 'start_datetime', 'end_datetime']
    list_filter = ['event_type', 'start_datetime']
    search_fields = ['title', 'description']
