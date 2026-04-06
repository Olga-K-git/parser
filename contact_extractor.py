"""Поиск телефонов и email в тексте"""

import re
from utils import clean_text

def find_all_phones(text):
    """Ищет телефоны в разных форматах"""
    phones = []
    if not text:
        return phones
    
    text = clean_text(text)
    
    phone_patterns = [
        r'\+7\s*\(?\d{5}\)?\s*\d[-\s]?\d{2}[-\s]?\d{2}',
        r'\+7\s*\(?\d{3}\)?\s*\d{3}[-\s]?\d{2}[-\s]?\d{2}',
        r'\+7\s*\d{3}\s*\d{3}[-\s]?\d{2}[-\s]?\d{2}',
        r'8\s*\(?\d{5}\)?\s*\d[-\s]?\d{2}[-\s]?\d{2}',
        r'8\s*\(?\d{3}\)?\s*\d{3}[-\s]?\d{2}[-\s]?\d{2}',
        r'8\s*\d{3}\s*\d{3}[-\s]?\d{2}[-\s]?\d{2}',
        r'\+7\(?\d{5}\)?\d{5,7}',
        r'\+7\s\d{3}\s\d{3}\s\d{2}\s\d{2}',
        r'8\s\d{3}\s\d{3}\s\d{2}\s\d{2}',
        r'\+7\d{10}',
        r'8\d{10}',
    ]
    
    for pattern in phone_patterns:
        matches = re.findall(pattern, text)
        for match in matches:
            clean_phone = re.sub(r'\s+', ' ', match).strip()
            phones.append(clean_phone)
    
    return list(dict.fromkeys(phones))

def find_unique_emails(text):
    """Ищет email с защитой от склеивания"""
    if not text:
        return []
    
    text = clean_text(text)
    email_pattern = r'(?<!\S)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?!\S)'
    emails = re.findall(email_pattern, text, re.IGNORECASE)
    
    return list(set([email.lower() for email in emails]))