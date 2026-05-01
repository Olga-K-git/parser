import { getHistory, updateHistoryRequest, saveHistory } from './storage.js';
import { showPage } from './navigation.js';
import { DEMO_COMPANIES } from './constants.js';

let currentRequest = null;

export function initResult() {
    // Получаем ID запроса из sessionStorage
    const resultData = sessionStorage.getItem('result_data');
    if (resultData) {
        const data = JSON.parse(resultData);
        const history = getHistory();
        currentRequest = history.find(r => r.id === data.requestId);
        sessionStorage.removeItem('result_data');
    }
    
    if (!currentRequest) {
        // fallback: берём последний запрос
        const history = getHistory();
        if (history.length > 0) {
            currentRequest = history[0];
        }
    }
    
    if (currentRequest) {
        renderResultPage();
        setupResultButtons();
    } else {
        document.getElementById('companiesList').innerHTML = '<div class="alert alert-warning">Запрос не найден</div>';
    }
}

function renderResultPage() {
    if (!currentRequest) return;
    
    setText('resultKeywords', currentRequest.keywords);
    setText('resultProject', currentRequest.project);
    setText('resultStartDate', currentRequest.startDate);
    
    if (!currentRequest.companyData) {
        currentRequest.companyData = {};
    }
    
    const companiesContainer = document.getElementById('companiesList');
    if (!companiesContainer) return;
    
    companiesContainer.innerHTML = '';
    
    DEMO_COMPANIES.forEach(company => {
        const companyInfo = currentRequest.companyData[company.id] || { rating: null, comment: '' };
        const currentRating = companyInfo.rating;
        const currentComment = companyInfo.comment || '';
        
        const div = document.createElement('div');
        div.className = 'list-group-item company-card';
        div.innerHTML = `
            <div class="d-flex justify-content-between align-items-start flex-wrap">
                <div class="flex-grow-1">
                    <strong>${escapeHtml(company.name)}</strong><br>
                    <a href="${escapeHtml(company.url)}" target="_blank" class="text-primary">${escapeHtml(company.url)}</a><br>
                    <small class="text-muted">${escapeHtml(company.description)}</small><br>
                    <small><i class="fas fa-envelope"></i> ${escapeHtml(company.email)}</small><br>
                    <small><i class="fas fa-phone"></i> ${escapeHtml(company.phone)}</small><br>
                    <small><i class="fas fa-map-marker-alt"></i> ${escapeHtml(company.address)}</small>
                </div>
                <div class="ms-3">
                    <button class="btn btn-sm btn-outline-success rate-company me-1" data-id="${company.id}" data-rating="suitable"><i class="fas fa-thumbs-up"></i> Подошёл</button>
                    <button class="btn btn-sm btn-outline-danger rate-company" data-id="${company.id}" data-rating="not_suitable"><i class="fas fa-thumbs-down"></i> Не подошёл</button>
                    ${currentRating ? `<span class="company-rating-badge badge ${currentRating === 'suitable' ? 'bg-success' : 'bg-danger'} ms-2">${currentRating === 'suitable' ? 'Подошёл' : 'Не подошёл'}</span>` : ''}
                </div>
            </div>
            <div class="mt-2">
                <textarea class="form-control company-comment" data-id="${company.id}" rows="2" placeholder="Введите комментарий по этой компании...">${escapeHtml(currentComment)}</textarea>
                <button class="btn btn-sm btn-primary mt-1 save-comment-btn" data-id="${company.id}">Сохранить комментарий</button>
                <span class="comment-saved-msg text-success small ms-2" id="commentSavedMsg_${company.id}" style="display: none;">✓</span>
            </div>
        `;
        companiesContainer.appendChild(div);
    });
}

function setupResultButtons() {
    // Обработчики для кнопок оценки
    document.querySelectorAll('.rate-company').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const companyId = parseInt(btn.getAttribute('data-id'));
            const ratingValue = btn.getAttribute('data-rating');
            
            if (!currentRequest.companyData[companyId]) {
                currentRequest.companyData[companyId] = { rating: null, comment: '' };
            }
            currentRequest.companyData[companyId].rating = ratingValue;
            saveHistory();
            renderResultPage(); // перерисовка
            setupResultButtons(); // перепривязываем обработчики
        });
    });
    
    // Обработчики для кнопок сохранения комментария
    document.querySelectorAll('.save-comment-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const companyId = parseInt(btn.getAttribute('data-id'));
            const textarea = document.querySelector(`.company-comment[data-id="${companyId}"]`);
            const newComment = textarea ? textarea.value.trim() : '';
            
            if (!currentRequest.companyData[companyId]) {
                currentRequest.companyData[companyId] = { rating: null, comment: '' };
            }
            currentRequest.companyData[companyId].comment = newComment;
            saveHistory();
            
            const msgSpan = document.getElementById(`commentSavedMsg_${companyId}`);
            if (msgSpan) {
                msgSpan.style.display = 'inline';
                setTimeout(() => { msgSpan.style.display = 'none'; }, 1500);
            }
        });
    });
    
    // Кнопка экспорта
    const exportBtn = document.getElementById('exportExcelBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportToExcel);
    }
    
    // Кнопка назад
    const backBtn = document.getElementById('backToHistoryBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showPage('history');
        });
    }
}

function exportToExcel() {
    if (!currentRequest) {
        alert('Нет выбранного запроса');
        return;
    }
    
    const companies = DEMO_COMPANIES.map(comp => {
        const data = currentRequest.companyData?.[comp.id] || { rating: null, comment: '' };
        return {
            name: comp.name,
            url: comp.url,
            description: comp.description,
            email: comp.email,
            phone: comp.phone,
            address: comp.address,
            rating: data.rating === 'suitable' ? 'Подошёл' : (data.rating === 'not_suitable' ? 'Не подошёл' : 'Не оценено'),
            comment: data.comment || ''
        };
    });
    
    const csvRows = [];
    csvRows.push(['Название компании', 'Ссылка', 'Описание', 'Email', 'Телефон', 'Адрес', 'Оценка', 'Комментарий']);
    
    companies.forEach(comp => {
        csvRows.push([comp.name, comp.url, comp.description, comp.email, comp.phone, comp.address, comp.rating, comp.comment]);
    });
    
    const csvContent = csvRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';')).join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `results_${currentRequest.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function setText(elementId, text) {
    const el = document.getElementById(elementId);
    if (el) el.innerText = text || '';
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}