import os
import json
import requests
from bs4 import BeautifulSoup
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


def extract_job_description(url):
    """
    AI-only approach: Let AI handle everything - extracting metadata and preserving
    job description formatting from the webpage content.

    Returns structured data: company_name, position_title, job_description,
    salary_range, location.
    """
    try:
        # Step 1: Fetch the webpage content
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        # Step 2: Parse and clean HTML content
        soup = BeautifulSoup(response.content, 'html.parser')

        # Remove noise elements
        for element in soup(['script', 'style', 'nav', 'header', 'footer', 'aside', 'iframe']):
            element.decompose()

        # Get cleaned text
        text = soup.get_text()

        # Clean up whitespace
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = '\n'.join(chunk for chunk in chunks if chunk)

        # Limit to token constraints (roughly 1 token = 4 chars)
        max_chars = 24000  # ~6000 tokens for input
        if len(text) > max_chars:
            text = text[:max_chars]

        # Step 3: Let AI extract everything
        client = Groq(api_key=os.getenv('GROQ_API_KEY'))

        prompt = f"""
You are a job information extraction assistant. Extract information from the job posting below.

Return valid JSON with these exact fields:
- company_name: The company/organization name (string)
- position_title: The job title/position name (string)
- job_description: The COMPLETE job description text EXACTLY as it appears. Preserve ALL formatting including bullet points, line breaks, and structure. Include responsibilities, qualifications, requirements, benefits, etc. DO NOT include legal disclaimers, copyright notices, or website footer text.
- salary_range: Salary/compensation if mentioned, or null (string or null)
- location: Job location (city, country, "Remote", etc.) (string)

CRITICAL INSTRUCTIONS:
- For job_description: Copy the entire job posting content verbatim, preserving all formatting
- Preserve bullet points exactly: •, -, *, numbers, etc.
- Preserve line breaks using \\n
- Keep text in original language (Korean stays Korean, English stays English)
- EXCLUDE: copyright text, legal disclaimers, footer content, "저작권자", "무단전재", "재배포금지", etc.
- If a field is not found, use null
- Return ONLY valid JSON

Job Posting Content:
{text}
"""

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.1,
            max_tokens=8000,  # Allow longer response for full job descriptions
        )

        # Parse AI response
        ai_response = chat_completion.choices[0].message.content

        # Extract JSON from response
        json_start = ai_response.find('{')
        json_end = ai_response.rfind('}') + 1
        if json_start != -1 and json_end > json_start:
            ai_response = ai_response[json_start:json_end]

        job_info = json.loads(ai_response)

        return job_info

    except json.JSONDecodeError as e:
        raise Exception(f"Failed to parse AI response: {str(e)}")
    except Exception as e:
        raise Exception(f"Failed to extract job information: {str(e)}")
