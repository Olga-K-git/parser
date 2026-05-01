// Загрузка HTML-шаблона страницы
export async function loadPage(pageName) {
    try {
        const response = await fetch(`pages/${pageName}.html`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const html = await response.text();
        document.getElementById('page-container').innerHTML = html;
        return true;
    } catch (error) {
        console.error(`Ошибка загрузки ${pageName}:`, error);
        // fallback: показываем сообщение об ошибке
        document.getElementById('page-container').innerHTML = `<div class="alert alert-danger">Ошибка загрузки страницы: ${pageName}</div>`;
        return false;
    }
}

// Переключение между страницами
export async function showPage(pageId, additionalData = null) {
    // Сохраняем данные для страницы результата
    if (additionalData) {
        sessionStorage.setItem('result_data', JSON.stringify(additionalData));
    }
    
    // Загружаем HTML страницы
    const success = await loadPage(pageId);
    if (!success) return;
    
    // Инициализируем JavaScript для этой страницы
    if (pageId === 'auth') {
        const { initAuth } = await import('./auth.js');
        initAuth();
    } else if (pageId === 'forgot') {
        const { initForgot } = await import('./auth.js');
        initForgot();
    } else if (pageId === 'home') {
        const { initSearch } = await import('./search.js');
        initSearch();
    } else if (pageId === 'history') {
        const { initHistory } = await import('./history.js');
        initHistory();
    } else if (pageId === 'profile') {
        const { initProfile } = await import('./user.js');
        initProfile();
    } else if (pageId === 'admin') {
        const { initAdmin } = await import('./admin.js');
        initAdmin();
    } else if (pageId === 'result') {
        const { initResult } = await import('./result.js');
        initResult();
    }
    
    // Обновляем активный пункт меню
    updateActiveNavItem(pageId);
}

function updateActiveNavItem(pageId) {
    // Убираем активный класс у всех пунктов
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Добавляем активный класс в зависимости от страницы
    const navMap = {
        'home': 'navHomeLink',
        'history': 'navHistory',
        'profile': 'navProfile',
        'admin': 'navAdmin'
    };
    
    const linkId = navMap[pageId];
    if (linkId) {
        const link = document.getElementById(linkId);
        if (link) link.classList.add('active');
    }
}