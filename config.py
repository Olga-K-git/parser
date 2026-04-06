"""Конфигурация парсера"""

# Файлы
URLS_FILE = "urls.txt"
OUTPUT_DIR = "results"
OUTPUT_JSON = f"{OUTPUT_DIR}/results.json"
OUTPUT_CSV = f"{OUTPUT_DIR}/results.csv"
OUTPUT_TXT = f"{OUTPUT_DIR}/results.txt"

# Задержки (в секундах)
MIN_DELAY = 3
MAX_DELAY = 4

# Таймаут запроса (секунды)
REQUEST_TIMEOUT = 15

# Заголовки для запросов
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

# Теги для поиска контактов
CONTACT_TAGS = ['div', 'footer', 'section', 'address', 'p', 'span', 'a']