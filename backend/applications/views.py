from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Position, ProcessNote, InterviewEvent
from .serializers import (
    PositionSerializer, PositionListSerializer,
    ProcessNoteSerializer, InterviewEventSerializer
)
from .utils import extract_job_description


class PositionViewSet(viewsets.ModelViewSet):
    queryset = Position.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return PositionListSerializer
        return PositionSerializer

    @action(detail=False, methods=['post'])
    def fetch_jd(self, request):
        """Fetch job description from recruiting link and extract information using AI"""
        # Get URL from request payload
        url = request.data.get('url')

        if not url:
            return Response(
                {'error': 'URL is required in the request body'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Extract job information using AI
            job_info = extract_job_description(url)

            # Add the URL to the extracted data
            job_info['recruiting_link'] = url

            # Return the extracted information
            return Response({
                'success': True,
                'data': job_info,
                'message': 'Job information extracted successfully'
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ProcessNoteViewSet(viewsets.ModelViewSet):
    serializer_class = ProcessNoteSerializer

    def get_queryset(self):
        queryset = ProcessNote.objects.all()
        position_id = self.request.query_params.get('position_id', None)
        if position_id is not None:
            queryset = queryset.filter(position_id=position_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save()


class InterviewEventViewSet(viewsets.ModelViewSet):
    serializer_class = InterviewEventSerializer

    def get_queryset(self):
        queryset = InterviewEvent.objects.all()
        position_id = self.request.query_params.get('position_id', None)
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)

        if position_id is not None:
            queryset = queryset.filter(position_id=position_id)
        if start_date is not None:
            queryset = queryset.filter(start_datetime__gte=start_date)
        if end_date is not None:
            queryset = queryset.filter(end_datetime__lte=end_date)

        return queryset

    def perform_create(self, serializer):
        serializer.save()
