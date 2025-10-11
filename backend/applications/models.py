from django.db import models
from django.utils import timezone


class Position(models.Model):
    """Model for job positions/applications"""
    PROCESS_STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('screening', 'Resume Screening'),
        ('coding_test', 'Coding Test'),
        ('technical_interview', 'Technical Interview'),
        ('cultural_fit', 'Cultural Fit Interview'),
        ('final_interview', 'Final Interview'),
        ('offer', 'Offer Received'),
        ('rejected', 'Rejected'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
    ]

    company_name = models.CharField(max_length=255)
    position_title = models.CharField(max_length=255)
    job_description = models.TextField(blank=True, null=True)
    recruiting_link = models.URLField(blank=True, null=True)
    current_status = models.CharField(
        max_length=50,
        choices=PROCESS_STATUS_CHOICES,
        default='applied'
    )
    salary_range = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    application_date = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.company_name} - {self.position_title}"


class ProcessNote(models.Model):
    """Notes for each stage of the recruitment process"""
    PROCESS_TYPE_CHOICES = [
        ('coding_test', 'Coding Test'),
        ('technical_interview', 'Technical Interview'),
        ('cultural_fit', 'Cultural Fit Interview'),
        ('final_interview', 'Final Interview'),
        ('general', 'General Notes'),
    ]

    position = models.ForeignKey(
        Position,
        on_delete=models.CASCADE,
        related_name='notes'
    )
    process_type = models.CharField(max_length=50, choices=PROCESS_TYPE_CHOICES)
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.position.company_name} - {self.title}"


class InterviewEvent(models.Model):
    """Calendar events for interviews and other recruitment-related activities"""
    EVENT_TYPE_CHOICES = [
        ('coding_test', 'Coding Test'),
        ('technical_interview', 'Technical Interview'),
        ('cultural_fit', 'Cultural Fit Interview'),
        ('final_interview', 'Final Interview'),
        ('phone_screen', 'Phone Screen'),
        ('other', 'Other'),
    ]

    position = models.ForeignKey(
        Position,
        on_delete=models.CASCADE,
        related_name='events'
    )
    event_type = models.CharField(max_length=50, choices=EVENT_TYPE_CHOICES)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    location = models.CharField(max_length=255, blank=True, null=True)
    meeting_link = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['start_datetime']

    def __str__(self):
        return f"{self.position.company_name} - {self.title}"
