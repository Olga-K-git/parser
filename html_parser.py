"""Парсинг HTML и извлечение текста"""

from bs4 import BeautifulSoup

def get_text_with_spaces(element):
    """Извлекает текст, заменяя <br> на пробелы"""
    if element is None:
        return ""
    clone = element.__copy__()
    for br in clone.find_all('br'):
        br.replace_with(' ')
    return clone.get_text()

def extract_meta_info(soup):
    """Извлекает информацию из meta-тегов и title"""
    title_tag = soup.find('title')
    title = title_tag.get_text(strip=True) if title_tag else ""
    
    meta_desc = soup.find('meta', attrs={'name': 'description'})
    description = meta_desc.get('content', '') if meta_desc else ""
    
    meta_keywords = soup.find('meta', attrs={'name': 'keywords'})
    keywords = meta_keywords.get('content', '') if meta_keywords else ""
    
    return {
        'title': title,
        'description': description,
        'keywords': keywords
    }

def extract_body_text(soup):
    """Извлекает и очищает текст из тега body"""
    import re
    
    body_tag = soup.find('body')
    if not body_tag:
        return ""
    
    for element in body_tag(["script", "style", "noscript", "meta", "link"]):
        element.decompose()
    
    body_text = body_tag.get_text(separator=' ', strip=True)
    body_text = re.sub(r'\[\{.*?\}\]', ' ', body_text, flags=re.DOTALL)
    body_text = re.sub(r'\{\s*"[^"]+":.*?\}', ' ', body_text, flags=re.DOTALL)
    body_text = re.sub(r'\s+', ' ', body_text).strip()
    
    return body_text

def parse_page(soup, contact_tags, get_text_with_spaces_func, find_all_phones_func, find_unique_emails_func):
    """Основная функция парсинга страницы"""
    all_phones = []
    all_emails = []
    
    for block in soup.find_all(contact_tags):
        text = get_text_with_spaces_func(block)
        all_phones.extend(find_all_phones_func(text))
        all_emails.extend(find_unique_emails_func(text))
    
    return {
        'phones': list(dict.fromkeys(all_phones)),
        'emails': list(set(all_emails)),
        'phones_count': len(list(dict.fromkeys(all_phones))),
        'emails_count': len(list(set(all_emails)))
    }