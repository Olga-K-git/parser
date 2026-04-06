"""Вспомогательные функции"""

import re
from urllib.parse import urlparse

def get_domain(url):
    """Извлекает основной домен из URL"""
    parsed = urlparse(url)
    domain = parsed.netloc
    if domain.startswith('www.'):
        domain = domain[4:]
    return domain

def clean_text(text):
    """Очищает текст от мусора"""
    if not text:
        return ""
    text = text.replace('\n', ' ')
    text = re.sub(r'"', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def ensure_output_dir(output_dir):
    """Создаёт папку для результатов, если её нет"""
    import os
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
