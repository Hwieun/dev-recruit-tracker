# API Examples

This document provides examples of how to use the Dev Recruit Tracker API.

## Base URL
```
http://localhost:8000/api
```

## Positions API

### List all positions
```bash
curl http://localhost:8000/api/positions/
```

### Create a new position
```bash
curl -X POST http://localhost:8000/api/positions/ \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Google",
    "position_title": "Senior Software Engineer",
    "location": "Mountain View, CA",
    "salary_range": "$150k - $200k",
    "recruiting_link": "https://careers.google.com/jobs/...",
    "current_status": "applied"
  }'
```

### Get position details
```bash
curl http://localhost:8000/api/positions/1/
```

### Update a position
```bash
curl -X PUT http://localhost:8000/api/positions/1/ \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Google",
    "position_title": "Senior Software Engineer",
    "location": "Mountain View, CA",
    "salary_range": "$150k - $200k",
    "current_status": "technical_interview"
  }'
```

### Fetch job description from link
```bash
curl -X POST http://localhost:8000/api/positions/1/fetch_jd/
```

### Delete a position
```bash
curl -X DELETE http://localhost:8000/api/positions/1/
```

## Notes API

### List notes for a position
```bash
curl http://localhost:8000/api/notes/?position_id=1
```

### Create a note
```bash
curl -X POST http://localhost:8000/api/notes/ \
  -H "Content-Type: application/json" \
  -d '{
    "position": 1,
    "process_type": "technical_interview",
    "title": "Preparation Notes",
    "content": "Review system design patterns, practice LeetCode medium problems, study company tech stack"
  }'
```

### Update a note
```bash
curl -X PUT http://localhost:8000/api/notes/1/ \
  -H "Content-Type: application/json" \
  -d '{
    "position": 1,
    "process_type": "technical_interview",
    "title": "Updated Preparation Notes",
    "content": "Completed system design review, practiced 10 LeetCode problems"
  }'
```

### Delete a note
```bash
curl -X DELETE http://localhost:8000/api/notes/1/
```

## Events API

### List all events
```bash
curl http://localhost:8000/api/events/
```

### List events for a position
```bash
curl http://localhost:8000/api/events/?position_id=1
```

### List events in a date range
```bash
curl "http://localhost:8000/api/events/?start_date=2024-01-01T00:00:00Z&end_date=2024-12-31T23:59:59Z"
```

### Create an event
```bash
curl -X POST http://localhost:8000/api/events/ \
  -H "Content-Type: application/json" \
  -d '{
    "position": 1,
    "event_type": "technical_interview",
    "title": "Technical Interview - Round 1",
    "description": "Live coding session with senior engineer",
    "start_datetime": "2024-03-15T14:00:00Z",
    "end_datetime": "2024-03-15T15:30:00Z",
    "location": "Google Meet",
    "meeting_link": "https://meet.google.com/xxx-yyyy-zzz"
  }'
```

### Update an event
```bash
curl -X PUT http://localhost:8000/api/events/1/ \
  -H "Content-Type: application/json" \
  -d '{
    "position": 1,
    "event_type": "technical_interview",
    "title": "Technical Interview - Round 1 (Rescheduled)",
    "description": "Live coding session with senior engineer",
    "start_datetime": "2024-03-16T14:00:00Z",
    "end_datetime": "2024-03-16T15:30:00Z",
    "location": "Google Meet",
    "meeting_link": "https://meet.google.com/xxx-yyyy-zzz"
  }'
```

### Delete an event
```bash
curl -X DELETE http://localhost:8000/api/events/1/
```

## Status Values

Available status values for positions:
- `applied` - Applied
- `screening` - Resume Screening
- `coding_test` - Coding Test
- `technical_interview` - Technical Interview
- `cultural_fit` - Cultural Fit Interview
- `final_interview` - Final Interview
- `offer` - Offer Received
- `rejected` - Rejected
- `accepted` - Accepted
- `declined` - Declined

## Process Types for Notes

- `general` - General Notes
- `coding_test` - Coding Test
- `technical_interview` - Technical Interview
- `cultural_fit` - Cultural Fit Interview
- `final_interview` - Final Interview

## Event Types

- `phone_screen` - Phone Screen
- `coding_test` - Coding Test
- `technical_interview` - Technical Interview
- `cultural_fit` - Cultural Fit Interview
- `final_interview` - Final Interview
- `other` - Other

## Response Format

All list endpoints return paginated results:

```json
{
  "count": 10,
  "next": "http://localhost:8000/api/positions/?page=2",
  "previous": null,
  "results": [...]
}
```

## Error Handling

The API returns standard HTTP status codes:

- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

Error response format:
```json
{
  "error": "Error message here"
}
```

or for validation errors:
```json
{
  "field_name": ["Error message for this field"]
}
```
