"""Сохранение результатов в файлы"""

import json
import csv
from datetime import datetime

def save_results_to_files(all_results, output_json, output_csv, output_txt):
    """Сохраняет результаты в JSON, CSV и TXT файлы"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # JSON
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump({
            'timestamp': timestamp,
            'total_sites': len(all_results),
            'results': all_results
        }, f, ensure_ascii=False, indent=2)
    print(f"[INFO] Результаты сохранены в {output_json}")
    
    # CSV
    with open(output_csv, 'w', newline='', encoding='utf-8') as f:
        fieldnames = ['domain', 'url', 'title', 'description', 'phones', 'emails', 'status', 'error']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        
        for domain, data in all_results.items():
            for page_result in data.get('pages', []):
                writer.writerow({
                    'domain': domain,
                    'url': page_result.get('url', ''),
                    'title': page_result.get('meta', {}).get('title', ''),
                    'description': page_result.get('meta', {}).get('description', ''),
                    'phones': '; '.join(page_result.get('contacts', {}).get('phones', [])),
                    'emails': '; '.join(page_result.get('contacts', {}).get('emails', [])),
                    'status': page_result.get('status', 'unknown'),
                    'error': page_result.get('error', '')
                })
    print(f"[INFO] Результаты сохранены в {output_csv}")
    
    # TXT
    with open(output_txt, 'w', encoding='utf-8') as f:
        f.write("="*80 + "\n")
        f.write(f"ОТЧЕТ О ПАРСИНГЕ КОНТАКТОВ\n")
        f.write(f"Дата: {timestamp}\n")
        f.write(f"Всего сайтов: {len(all_results)}\n")
        f.write("="*80 + "\n\n")
        
        for domain, data in all_results.items():
            f.write(f"\n{'='*80}\n")
            f.write(f"САЙТ: {domain}\n")
            f.write(f"{'='*80}\n")
            
            all_site_phones = []
            all_site_emails = []
            for page in data.get('pages', []):
                all_site_phones.extend(page.get('contacts', {}).get('phones', []))
                all_site_emails.extend(page.get('contacts', {}).get('emails', []))
            
            unique_phones = list(dict.fromkeys(all_site_phones))
            unique_emails = list(set(all_site_emails))
            
            f.write(f"\n[ОБЩИЕ КОНТАКТЫ ДЛЯ САЙТА]\n")
            f.write(f"Телефоны ({len(unique_phones)}):\n")
            for phone in unique_phones:
                f.write(f"  - {phone}\n")
            f.write(f"\nEmail ({len(unique_emails)}):\n")
            for email in unique_emails:
                f.write(f"  - {email}\n")
            
            f.write(f"\n[ПОДРОБНО ПО СТРАНИЦАМ]\n")
            for page in data.get('pages', []):
                f.write(f"\n--- Страница: {page.get('url', 'unknown')} ---\n")
                f.write(f"Статус: {page.get('status', 'unknown')}\n")
                if page.get('error'):
                    f.write(f"Ошибка: {page.get('error')}\n")
                
                meta = page.get('meta', {})
                if meta.get('title'):
                    f.write(f"Title: {meta.get('title')}\n")
                if meta.get('description'):
                    f.write(f"Description: {meta.get('description')}\n")
                
                contacts = page.get('contacts', {})
                if contacts.get('phones'):
                    f.write(f"Телефоны: {', '.join(contacts.get('phones'))}\n")
                if contacts.get('emails'):
                    f.write(f"Email: {', '.join(contacts.get('emails'))}\n")
    
    print(f"[INFO] Результаты сохранены в {output_txt}")
