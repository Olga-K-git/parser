import { getHistory, getCurrentUser } from './storage.js';
import { showPage } from './navigation.js';

let currentFilteredHistory = null;

export function initHistory() {
    setupHistoryFilters();
    renderHistory();
}

function renderHistory() {
    const history = getHistory();
    const tbody = document.getElementById('historyBody');
    const emptyDiv = document.getElementById('emptyHistory');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!history.length) {
        if (emptyDiv) emptyDiv.style.display = 'block';
        return;
    }
    
    if (emptyDiv) emptyDiv.style.display = 'none';
    
    history.forEach(req => {
        const row = tbody.insertRow();
        const statusClass = req.status === 'completed' ? 'status-completed' : (req.status === 'inwork' ? 'status-inwork' : 'status-error');
        const statusText = req.status === 'completed' ? 'завершено' : (req.status === 'inwork' ? 'в работе' : 'ошибка');
        const summary = getRatingsSummary(req.companyData);
        const commentsSummary = getCommentsSummary(req.companyData);
        
        row.innerHTML = `
            <td>${escapeHtml(req.project)}</td>
            <td title="${escapeHtml(req.keywords)}">${escapeHtml(req.keywords.length > 30 ? req.keywords.substring(0, 27) + '…' : req.keywords)}</td>
            <td>${escapeHtml(req.startDate)}</td>
            <td>${escapeHtml(req.endDate || '—')}</td>
            <td><span class="${statusClass}">${statusText}</span></td>
            <td>${summary}</td>
            <td><span class="comment-text" title="${escapeHtml(commentsSummary)}">${escapeHtml(commentsSummary)}</span></td>
        `;
        
        row.addEventListener('click', () => {
            showPage('result', { requestId: req.id });
        });
    });
}

function getRatingsSummary(companyData) {
    if (!companyData) return '—';
    const suitable = Object.values(companyData).filter(v => v.rating === 'suitable').length;
    const notSuitable = Object.values(companyData).filter(v => v.rating === 'not_suitable').length;
    if (suitable === 0 && notSuitable === 0) return '—';
    return `👍 ${suitable} / 👎 ${notSuitable}`;
}

function getCommentsSummary(companyData) {
    if (!companyData) return '—';
    const comments = Object.values(companyData).map(v => v.comment).filter(c => c && c.trim().length > 0);
    if (comments.length === 0) return '—';
    if (comments.length === 1) return comments[0].substring(0, 30) + (comments[0].length > 30 ? '…' : '');
    return `${comments.length} коммент.`;
}

function setupHistoryFilters() {
    const applyBtn = document.getElementById('applyHistoryFilters');
    if (applyBtn) {
        applyBtn.onclick = () => {
            const kw = document.getElementById('filterKeywords')?.value.toLowerCase() || '';
            const history = getHistory();
            const filtered = history.filter(r => r.keywords.toLowerCase().includes(kw));
            renderFilteredHistory(filtered);
        };
    }
    
    // Сброс фильтров при загрузке страницы
    const filterKeywords = document.getElementById('filterKeywords');
    if (filterKeywords) {
        filterKeywords.value = '';
    }
}

function renderFilteredHistory(requests) {
    const tbody = document.getElementById('historyBody');
    const emptyDiv = document.getElementById('emptyHistory');
    
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (!requests.length) {
        if (emptyDiv) emptyDiv.style.display = 'block';
        return;
    }
    
    if (emptyDiv) emptyDiv.style.display = 'none';
    
    requests.forEach(req => {
        const row = tbody.insertRow();
        const statusClass = req.status === 'completed' ? 'status-completed' : (req.status === 'inwork' ? 'status-inwork' : 'status-error');
        const statusText = req.status === 'completed' ? 'завершено' : (req.status === 'inwork' ? 'в работе' : 'ошибка');
        const summary = getRatingsSummary(req.companyData);
        const commentsSummary = getCommentsSummary(req.companyData);
        
        row.innerHTML = `
            <td>${escapeHtml(req.project)}</td>
            <td title="${escapeHtml(req.keywords)}">${escapeHtml(req.keywords.substring(0, 30))}</td>
            <td>${escapeHtml(req.startDate)}</td>
            <td>${escapeHtml(req.endDate || '—')}</td>
            <td><span class="${statusClass}">${statusText}</span></td>
            <td>${summary}</td>
            <td><span class="comment-text" title="${escapeHtml(commentsSummary)}">${escapeHtml(commentsSummary)}</span></td>
        `;
        
        row.addEventListener('click', () => {
            showPage('result', { requestId: req.id });
        });
    });
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