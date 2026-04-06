"""Загрузка URL из файла"""

def load_urls_from_file(filepath):
    """Загружает ссылки из текстового файла (по одной на строку)"""
    urls = []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            for line in f:
                url = line.strip()
                if url and not url.startswith('#'):
                    if not url.startswith(('http://', 'https://')):
                        url = 'https://' + url
                    urls.append(url)
        print(f"[INFO] Загружено {len(urls)} ссылок из файла {filepath}")
        return urls
    except FileNotFoundError:
        print(f"[ERROR] Файл {filepath} не найден.")
        return []
    except Exception as e:
        print(f"[ERROR] Ошибка при чтении файла: {e}")
        return []