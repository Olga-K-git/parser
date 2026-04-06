"""Главный файл парсера"""

import time
import random
import requests
from bs4 import BeautifulSoup

from config import (
    URLS_FILE, OUTPUT_DIR, OUTPUT_JSON, OUTPUT_CSV, OUTPUT_TXT,
    MIN_DELAY, MAX_DELAY, REQUEST_TIMEOUT, HEADERS, CONTACT_TAGS
)
from utils import get_domain, ensure_output_dir
from url_loader import load_urls_from_file
from html_parser import get_text_with_spaces, extract_meta_info, extract_body_text, parse_page
from contact_extractor import find_all_phones, find_unique_emails
from result_saver import save_results_to_files


def fetch_page(url):
    """Загружает страницу и возвращает BeautifulSoup объект"""
    response = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
    response.encoding = 'utf-8'
    response.raise_for_status()
    return BeautifulSoup(response.text, 'html.parser')


def process_single_page(url, domain, all_results):
    """Обрабатывает одну страницу и добавляет результат в all_results"""
    page_result = {
        'url': url,
        'status': 'pending',
        'error': None,
        'meta': {},
        'contacts': {},
        'body_text_preview': None
    }
    
    try:
        soup = fetch_page(url)
        
        # Извлекаем мета-информацию
        page_result['meta'] = extract_meta_info(soup)
        
        # Извлекаем текст body
        body_text = extract_body_text(soup)
        page_result['body_text_preview'] = body_text
        
        # Ищем контакты
        contacts = parse_page(soup, CONTACT_TAGS, get_text_with_spaces, find_all_phones, find_unique_emails)
        page_result['contacts'] = contacts
        page_result['status'] = 'success'
        
        print(f"    [OK] Найдено телефонов: {contacts['phones_count']}, email: {contacts['emails_count']}")
        if contacts['phones']:
            print(f"    Телефоны: {', '.join(contacts['phones'])}")
        if contacts['emails']:
            print(f"    Email: {', '.join(contacts['emails'])}")
        
    except requests.exceptions.Timeout:
        print(f"    [ERROR] Таймаут при загрузке страницы")
        page_result['status'] = 'error'
        page_result['error'] = 'Timeout'
    except requests.exceptions.ConnectionError:
        print(f"    [ERROR] Ошибка соединения")
        page_result['status'] = 'error'
        page_result['error'] = 'ConnectionError'
    except requests.exceptions.HTTPError as e:
        print(f"    [ERROR] HTTP ошибка: {e}")
        page_result['status'] = 'error'
        page_result['error'] = str(e)
    except Exception as e:
        print(f"    [ERROR] Ошибка: {e}")
        page_result['status'] = 'error'
        page_result['error'] = str(e)
    
    # Добавляем результат
    if domain not in all_results:
        all_results[domain] = {'pages': []}
    all_results[domain]['pages'].append(page_result)
    
    return page_result['status'] == 'success'


def print_final_report(all_results):
    """Выводит итоговый отчёт в консоль"""
    print("\n" + "="*60)
    print("ИТОГОВЫЙ ОТЧЕТ")
    print("="*60)
    
    for domain, data in all_results.items():
        all_phones = []
        all_emails = []
        success_count = 0
        error_count = 0
        
        for page in data['pages']:
            all_phones.extend(page.get('contacts', {}).get('phones', []))
            all_emails.extend(page.get('contacts', {}).get('emails', []))
            if page['status'] == 'success':
                success_count += 1
            else:
                error_count += 1
        
        unique_phones = list(dict.fromkeys(all_phones))
        unique_emails = list(set(all_emails))
        
        print(f"\nСайт: {domain}")
        print(f"  Обработано страниц: успешно - {success_count}, ошибок - {error_count}")
        print(f"  Телефоны ({len(unique_phones)}):")
        for phone in unique_phones:
            print(f"    - {phone}")
        print(f"  Email ({len(unique_emails)}):")
        for email in unique_emails:
            print(f"    - {email}")


def main():
    print("="*60)
    print("ПАРСЕР КОНТАКТНЫХ ДАННЫХ")
    print("="*60)
    
    # Создаём папку для результатов
    ensure_output_dir(OUTPUT_DIR)
    
    # Загружаем ссылки
    urls_to_parse = load_urls_from_file(URLS_FILE)
    
    if not urls_to_parse:
        print("[ERROR] Нет ссылок для обработки. Завершение работы.")
        return
    
    print(f"[INFO] Начинаю парсинг {len(urls_to_parse)} страниц...")
    print(f"[INFO] Задержка между запросами: от {MIN_DELAY} до {MAX_DELAY} сек.\n")
    
    all_results = {}
    
    for index, url in enumerate(urls_to_parse, 1):
        domain = get_domain(url)
        print(f"\n[{index}/{len(urls_to_parse)}] Обработка: {url}")
        
        # Обрабатываем страницу
        process_single_page(url, domain, all_results)
        
        # Задержка перед следующим запросом
        if index < len(urls_to_parse):
            delay = random.uniform(MIN_DELAY, MAX_DELAY)
            print(f"    [WAIT] Пауза {delay:.1f} сек...")
            time.sleep(delay)
    
    # Выводим отчёт и сохраняем результаты
    print_final_report(all_results)
    
    print("\n" + "="*60)
    print("СОХРАНЕНИЕ РЕЗУЛЬТАТОВ")
    print("="*60)
    save_results_to_files(all_results, OUTPUT_JSON, OUTPUT_CSV, OUTPUT_TXT)
    
    print("\n[INFO] Парсинг завершен!")


if __name__ == "__main__":
    main()