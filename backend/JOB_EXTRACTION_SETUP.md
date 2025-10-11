# Job Information Extraction Setup

This feature uses **Groq AI** (free) to automatically extract job information from recruiting links.

## 🎯 Features

The `fetch_jd` endpoint will extract:
- Company name
- Position title
- Job description (responsibilities, requirements, benefits)
- Salary range (if available)
- Location

## 📋 Setup Instructions

### 1. Get a Free Groq API Key

1. Go to [Groq Console](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to [API Keys](https://console.groq.com/keys)
4. Create a new API key
5. Copy the API key

### 2. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Groq API key:
   ```
   GROQ_API_KEY=your-actual-api-key-here
   ```

### 3. Install Dependencies

```bash
source venv/bin/activate
pip install -r requirements.txt
```

## 🚀 Usage

### API Endpoint

**POST** `/api/positions/fetch_jd/`

### Request Body

```json
{
  "url": "https://example.com/job-posting"
}
```

### Response

```json
{
  "success": true,
  "message": "Job information extracted successfully",
  "data": {
    "company_name": "Tech Company Inc",
    "position_title": "Senior Software Engineer",
    "job_description": "We are looking for...",
    "salary_range": "$120k - $150k",
    "location": "San Francisco, CA / Remote",
    "recruiting_link": "https://example.com/job-posting"
  }
}
```

### Example Usage (curl)

```bash
curl -X POST http://localhost:8000/api/positions/fetch_jd/ \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/job-posting"}'
```

### Example Usage (Python)

```python
import requests

response = requests.post(
    'http://localhost:8000/api/positions/fetch_jd/',
    json={'url': 'https://example.com/job-posting'}
)

data = response.json()
print(data)
```

### Example Usage (JavaScript/Fetch)

```javascript
fetch('http://localhost:8000/api/positions/fetch_jd/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://example.com/job-posting'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## 🔍 How It Works

1. **Fetch Page**: The function fetches the job posting webpage
2. **Parse HTML**: Extracts text content using BeautifulSoup
3. **AI Extraction**: Sends the text to Groq AI (using Llama 3.1 70B model)
4. **Structured Output**: AI returns structured JSON with job information
5. **Return Data**: The endpoint returns the extracted information

## 💰 Pricing

**Groq is FREE** with generous rate limits:
- 30 requests per minute
- 14,400 requests per day
- Completely free to use

## 🛠️ Debugging

To debug the extraction process, you can add breakpoints in [applications/utils.py](applications/utils.py):

```python
def extract_job_description(url):
    # ... code ...

    # Add this to debug
    breakpoint()  # Pause execution here

    # ... more code ...
```

Then run the Django server and make a request. The execution will pause at the breakpoint where you can inspect variables.

## ⚠️ Troubleshooting

### Error: "Failed to extract job information"

**Possible causes:**
1. Invalid URL or webpage not accessible
2. GROQ_API_KEY not set in `.env` file
3. Rate limit exceeded (wait a minute and try again)

**Solution:**
1. Check that the URL is valid and accessible
2. Verify your `.env` file has the correct API key
3. Check Django logs for detailed error messages

### Error: "URL is required in the request body"

**Solution:**
Make sure you're sending a POST request with JSON body containing the `url` field:
```json
{"url": "https://example.com/job-posting"}
```

## 📚 Related Files

- [applications/utils.py](applications/utils.py) - Extraction logic
- [applications/views.py](applications/views.py) - API endpoint
- [requirements.txt](requirements.txt) - Python dependencies
- [.env.example](.env.example) - Environment variables template
