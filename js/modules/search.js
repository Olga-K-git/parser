import { getCurrentUser, addToHistory, getHistory, saveLastRequestInfo, getLastRequestInfo } from './storage.js';
import { showPage } from './navigation.js';

let searchTimeout = null;

export function initSearch() {
    setupSearch();
    setupFilters();
    loadLastRequest();
}

function setupSearch() {
    const sendBtn = document.getElementById('sendSearchBtn');
    const input = document.getElementById('searchInput');
    const messagesDiv = document.querySelector('.messages');
    
    if (!sendBtn || !input) return;
    
    sendBtn.onclick = () => {
        const currentUser = getCurrentUser();
        
        if (currentUser && currentUser.role === 'marketer') {
            alert('Маркетолог не может создавать запросы');
            return;
        }
        
        const query = input.value.trim();
        if (!query) {
            alert('Введите ключевые слова');
            return;
        }
        
        const now = new Date().toLocaleString();
        const lastHtml = `<strong>Ключевые слова:</strong> ${query}<br><strong>Статус:</strong> <span class="status-inwork">в работе</span><br><strong>Дата:</strong> ${now}`;
        
        const lastDiv = document.getElementById('lastRequestInfo');
        if (lastDiv) lastDiv.innerHTML = lastHtml;
        saveLastRequestInfo(lastHtml);
        
        // Добавляем в историю
        const newReq = {
            id: Date.now(),
            project: 'Базальт',
            keywords: query,
            startDate: now,
            endDate: '',
            status: 'inwork',
            companyData: {}
        };
        addToHistory(newReq);
        
        // Показываем сообщение в чате
        if (messagesDiv) {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'text-end mb-2';
            msgDiv.innerHTML = `<span class="bg-primary text-white p-2 rounded">${escapeHtml(query)}</span>`;
            messagesDiv.appendChild(msgDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
        
        input.value = '';
        
        // Имитация завершения запроса через 3 секунды
        if (searchTimeout) clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const completedHtml = `<strong>Ключевые слова:</strong> ${query}<br><strong>Статус:</strong> <span class="status-completed">завершено</span><br><strong>Дата:</strong> ${now}`;
            if (lastDiv) lastDiv.innerHTML = completedHtml;
            saveLastRequestInfo(completedHtml);
            
            // Обновляем статус в истории
            const history = getHistory();
            const found = history.find(r => r.keywords === query && r.startDate === now);
            if (found) {
                found.status = 'completed';
                found.endDate = new Date().toLocaleString();
                localStorage.setItem('basalt_history', JSON.stringify(history));
            }
        }, 3000);
    };
}

function setupFilters() {
    const filterBtn = document.getElementById('filterBtn');
    const panel = document.getElementById('filterPanel');
    
    if (filterBtn && panel) {
        filterBtn.onclick = () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        };
    }
    
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.onclick = () => {
            document.querySelectorAll('#filterCountry option, #filterSubject option').forEach(opt => opt.selected = false);
        };
    }
    
    const applyBtn = document.getElementById('applyFilters');
    if (applyBtn) {
        applyBtn.onclick = () => {
            if (panel) panel.style.display = 'none';
            alert('Фильтры применены (демо)');
        };
    }
}

function loadLastRequest() {
    const lastDiv = document.getElementById('lastRequestInfo');
    if (lastDiv) {
        const savedLast = getLastRequestInfo();
        if (savedLast) {
            lastDiv.innerHTML = savedLast;
        }
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}