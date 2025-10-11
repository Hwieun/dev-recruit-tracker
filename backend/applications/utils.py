import json
import requests
from bs4 import BeautifulSoup


def extract_job_description(url):
    """
    Classic HTML parsing approach - NO AI.
    Extracts job information directly from HTML structure.
    Supports Next.js sites (extracts from __NEXT_DATA__ script tag).

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

        # Step 2: Parse HTML
        soup = BeautifulSoup(response.content, 'html.parser')
        breakpoint  

        next_data = extract_from_next_data(soup)
        if next_data:
            return next_data

        # Step 3: return parsing
        job_info = {
            'company_name': extract_company_name(soup),
            'position_title': extract_position_title(soup),
            'job_description': extract_job_desc_content(soup),
            'salary_range': extract_salary(soup),
            'location': extract_location(soup),
        }

        return job_info

    except Exception as e:
        raise Exception(f"Failed to extract job information: {str(e)}")


def extract_from_next_data(soup):
    """
    Extract job information from __NEXT_DATA__ script tag (for Next.js sites like Wanted).
    Returns complete job info if found, otherwise returns None.
    """
    try:
        # Find the __NEXT_DATA__ script tag
        next_data_script = soup.find('script', {'id': '__NEXT_DATA__'})
        if not next_data_script:
            return None

        # Parse JSON data
        next_data = json.loads(next_data_script.string)

        # For Wanted: props.pageProps.initialData
        job_detail = None

        # Try different common paths
        paths_to_try = [
            ['props', 'pageProps', 'initialData'],  # Wanted structure
            ['props', 'pageProps', 'jobDetail'],
            ['props', 'pageProps', 'job'],
            ['props', 'pageProps', 'data'],
        ]

        for path in paths_to_try:
            try:
                temp = next_data
                for key in path:
                    temp = temp[key]
                job_detail = temp
                break
            except (KeyError, TypeError):
                continue

        if not job_detail:
            return None

        # Build complete job description from all relevant fields
        job_description_parts = []

        # Add intro (회사 소개)
        if job_detail.get('intro'):
            job_description_parts.append(f"[소개]\n{job_detail['intro']}")

        # Add main tasks (주요 업무)
        if job_detail.get('main_tasks'):
            job_description_parts.append(f"\n[주요 업무]\n{job_detail['main_tasks']}")

        # Add requirements (자격 요건)
        if job_detail.get('requirements'):
            job_description_parts.append(f"\n[자격 요건]\n{job_detail['requirements']}")

        # Add preferred points (우대 사항)
        if job_detail.get('preferred_points'):
            job_description_parts.append(f"\n[우대 사항]\n{job_detail['preferred_points']}")

        # Add benefits (복지 및 혜택)
        if job_detail.get('benefits'):
            job_description_parts.append(f"\n[복지 및 혜택]\n{job_detail['benefits']}")

        # Add hire rounds (채용 절차)
        if job_detail.get('hire_rounds'):
            job_description_parts.append(f"\n[채용 절차]\n{job_detail['hire_rounds']}")

        job_description = '\n'.join(job_description_parts)

        # Extract fields
        job_info = {
            'company_name': job_detail.get('company', {}).get('company_name'),
            'position_title': job_detail.get('position'),
            'job_description': job_description if job_description else None,
            'salary_range': extract_salary_from_json(job_detail),
            'location': extract_location_from_json(job_detail),
        }

        # Only return if we got the job description (most important field)
        if job_info['job_description']:
            return job_info

        return None

    except (json.JSONDecodeError, KeyError, TypeError, AttributeError):
        return None


def extract_salary_from_json(job_detail):
    """Extract salary from JSON data"""
    try:
        # Try different salary fields
        if 'salary' in job_detail:
            salary = job_detail['salary']
            if isinstance(salary, dict):
                min_sal = salary.get('min') or salary.get('minSalary')
                max_sal = salary.get('max') or salary.get('maxSalary')
                if min_sal and max_sal:
                    return f"{min_sal} ~ {max_sal}"
            elif isinstance(salary, str):
                return salary

        if 'compensation' in job_detail:
            comp = job_detail['compensation']
            if isinstance(comp, str):
                return comp

        return None
    except:
        return None


def extract_location_from_json(job_detail):
    """Extract location from JSON data"""
    try:
        # Try different location fields
        if 'address' in job_detail:
            addr = job_detail['address']
            if isinstance(addr, dict):
                return addr.get('full_location') or addr.get('location') or addr.get('country')
            elif isinstance(addr, str):
                return addr

        if 'location' in job_detail:
            loc = job_detail['location']
            if isinstance(loc, dict):
                return loc.get('name') or loc.get('city')
            elif isinstance(loc, str):
                return loc

        if 'company' in job_detail:
            company = job_detail['company']
            if isinstance(company, dict) and 'address' in company:
                addr = company['address']
                if isinstance(addr, dict):
                    return addr.get('location') or addr.get('country')
                elif isinstance(addr, str):
                    return addr

        return None
    except:
        return None


def extract_company_name(soup):
    """Extract company name from HTML"""
    # Common patterns for company name
    selectors = [
        ('meta', {'property': 'og:site_name'}),
        ('meta', {'name': 'author'}),
        ('h1', {'class': lambda x: x and 'company' in x.lower()}),
        ('span', {'class': lambda x: x and 'company' in x.lower()}),
        ('div', {'class': lambda x: x and 'company' in x.lower()}),
    ]

    for tag, attrs in selectors:
        element = soup.find(tag, attrs)
        if element:
            if tag == 'meta':
                return element.get('content', '').strip()
            else:
                text = element.get_text(strip=True)
                if text:
                    return text

    return None


def extract_position_title(soup):
    """Extract position title from HTML"""
    # Common patterns for job title
    selectors = [
        ('meta', {'property': 'og:title'}),
        ('h1', {}),
        ('h2', {'class': lambda x: x and any(k in x.lower() for k in ['title', 'position', 'job'])}),
        ('title', {}),
    ]

    for tag, attrs in selectors:
        element = soup.find(tag, attrs)
        if element:
            if tag == 'meta':
                return element.get('content', '').strip()
            else:
                text = element.get_text(strip=True)
                if text and len(text) < 200:  # Reasonable title length
                    return text

    return None


def extract_job_desc_content(soup):
    """Extract job description with preserved formatting"""

    # Try to extract from __NEXT_DATA__ (Next.js sites like Wanted)
    breakpoint
    next_data = extract_from_next_data(soup)
    breakpoint
    if next_data:
        return next_data
    
    # Remove noise elements first
    for element in soup(['script', 'style', 'nav', 'header', 'footer', 'aside', 'iframe']):
        element.decompose()

    # Common selectors for job description sections
    job_desc_selectors = [
        # Wanted
        {'class': lambda x: x and 'JobDescription_JobDescription' in str(x)},
        {'data-cy': 'job-description'},
        # Saramin
        {'class': 'user_content'},
        {'class': 'content'},
        # Jobkorea
        {'class': 'sumBx'},
        {'class': 'jd-section'},
        # LinkedIn
        {'class': 'show-more-less-html__markup'},
        # Indeed
        {'id': 'jobDescriptionText'},
        # Generic patterns
        {'class': lambda x: x and 'job-description' in str(x).lower()},
        {'id': lambda x: x and 'job-description' in str(x).lower()},
    ]

    job_desc_element = None

    # Try each selector
    for selector in job_desc_selectors:
        job_desc_element = soup.find(['div', 'section', 'article'], selector)
        if job_desc_element:
            break

    # Fallback: look for largest text block
    if not job_desc_element:
        # Find all divs and get the one with most text
        all_divs = soup.find_all(['div', 'section', 'article'])
        max_length = 0
        for div in all_divs:
            text_length = len(div.get_text(strip=True))
            if text_length > max_length:
                max_length = text_length
                job_desc_element = div

    if not job_desc_element:
        return "Job description not found"

    # Extract text with formatting preserved
    return extract_text_with_formatting(job_desc_element)


def extract_salary(soup):
    """Extract salary information from HTML"""
    # Common patterns for salary
    salary_keywords = ['salary', 'compensation', '연봉', '급여', '임금']

    # Look in meta tags first
    meta_tags = soup.find_all('meta')
    for meta in meta_tags:
        content = meta.get('content', '')
        if any(keyword in content.lower() for keyword in salary_keywords):
            # Try to extract salary pattern
            import re
            # Patterns: $50k-70k, 5000만원, etc.
            salary_patterns = [
                r'\$[\d,]+k?\s*-?\s*\$?[\d,]+k?',
                r'[\d,]+만원\s*~?\s*[\d,]+만원',
                r'[\d,]+원\s*~?\s*[\d,]+원',
            ]
            for pattern in salary_patterns:
                match = re.search(pattern, content)
                if match:
                    return match.group(0)

    # Look in text content
    elements = soup.find_all(['span', 'div', 'p', 'li'])
    for element in elements:
        text = element.get_text(strip=True)
        if any(keyword in text.lower() for keyword in salary_keywords):
            import re
            salary_patterns = [
                r'\$[\d,]+k?\s*-?\s*\$?[\d,]+k?',
                r'[\d,]+만원\s*~?\s*[\d,]+만원',
                r'[\d,]+원\s*~?\s*[\d,]+원',
            ]
            for pattern in salary_patterns:
                match = re.search(pattern, text)
                if match:
                    return match.group(0)

    return None


def extract_location(soup):
    """Extract location from HTML"""
    # Common patterns for location
    selectors = [
        ('meta', {'property': 'og:location'}),
        ('span', {'class': lambda x: x and 'location' in str(x).lower()}),
        ('div', {'class': lambda x: x and 'location' in str(x).lower()}),
    ]

    for tag, attrs in selectors:
        element = soup.find(tag, attrs)
        if element:
            if tag == 'meta':
                return element.get('content', '').strip()
            else:
                text = element.get_text(strip=True)
                if text:
                    return text

    # Look for common location keywords
    location_keywords = ['location', '위치', '근무지', '지역']
    elements = soup.find_all(['span', 'div', 'p'])
    for element in elements:
        class_str = ' '.join(element.get('class', []))
        if any(keyword in class_str.lower() for keyword in location_keywords):
            text = element.get_text(strip=True)
            if text and len(text) < 100:  # Reasonable location length
                return text

    return None


def extract_text_with_formatting(element):
    """
    Extract text from HTML element while preserving bullets, line breaks, and structure.
    NO AI - pure HTML parsing.
    """
    result = []
    previous_was_block = False

    for child in element.descendants:
        if isinstance(child, str):
            # Text node
            text = str(child).strip()
            if text:
                result.append(text)
                previous_was_block = False
        elif child.name:
            # Element node
            if child.name in ['script', 'style']:
                continue
            elif child.name == 'br':
                result.append('\n')
                previous_was_block = True
            elif child.name in ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
                if result and not previous_was_block:
                    result.append('\n')
                previous_was_block = True
            elif child.name == 'li':
                if result and not result[-1].endswith('\n'):
                    result.append('\n')
                result.append('• ')
                previous_was_block = False
            elif child.name == 'ul' or child.name == 'ol':
                if result and not previous_was_block:
                    result.append('\n')
                previous_was_block = True

    # Join and clean up
    text = ''.join(result)

    # Clean up excessive whitespace
    lines = text.split('\n')
    cleaned_lines = []
    for line in lines:
        line = ' '.join(line.split())  # Normalize spaces
        if line:  # Skip empty lines
            cleaned_lines.append(line)

    # Join with single line breaks
    final_text = '\n'.join(cleaned_lines)

    # Remove excessive blank lines (more than 2)
    while '\n\n\n' in final_text:
        final_text = final_text.replace('\n\n\n', '\n\n')

    # Filter out copyright/legal text
    lines = final_text.split('\n')
    filtered_lines = []
    skip_keywords = ['저작권자', '무단전재', '재배포금지', 'copyright', '©']

    for line in lines:
        if not any(keyword in line for keyword in skip_keywords):
            filtered_lines.append(line)

    return '\n'.join(filtered_lines).strip()
