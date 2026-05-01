import { showPage } from './modules/navigation.js';
import { getCurrentUser, clearCurrentUser } from './modules/storage.js';

// Инициализация приложения
async function initApp() {
    // Настраиваем обработчики навигации
    setupNavigation();
    
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        if (currentUser.role === 'marketer') {
            await showPage('history');
        } else {
            await showPage('home');
        }
    } else {
        await showPage('auth');
    }
}

function setupNavigation() {
    // Навигация
    const navHome = document.getElementById('navHome');
    const navHomeLink = document.getElementById('navHomeLink');
    const navProfile = document.getElementById('navProfile');
    const navHistory = document.getElementById('navHistory');
    const navAdmin = document.getElementById('navAdmin');
    const navLogout = document.getElementById('navLogout');
    
    if (navHome) {
        navHome.addEventListener('click', async (e) => {
            e.preventDefault();
            const currentUser = getCurrentUser();
            if (currentUser && (currentUser.role === 'operator' || currentUser.role === 'admin')) {
                await showPage('home');
            } else if (currentUser?.role === 'marketer') {
                await showPage('history');
            } else {
                await showPage('auth');
            }
        });
    }
    
    if (navHomeLink) {
        navHomeLink.addEventListener('click', async (e) => {
            e.preventDefault();
            const currentUser = getCurrentUser();
            if (currentUser && (currentUser.role === 'operator' || currentUser.role === 'admin')) {
                await showPage('home');
            } else if (currentUser?.role === 'marketer') {
                await showPage('history');
            } else {
                await showPage('auth');
            }
        });
    }
    
    if (navProfile) {
        navProfile.addEventListener('click', async (e) => {
            e.preventDefault();
            if (getCurrentUser()) {
                await showPage('profile');
            } else {
                await showPage('auth');
            }
        });
    }
    
    if (navHistory) {
        navHistory.addEventListener('click', async (e) => {
            e.preventDefault();
            if (getCurrentUser()) {
                await showPage('history');
            } else {
                await showPage('auth');
            }
        });
    }
    
    if (navAdmin) {
        navAdmin.addEventListener('click', async (e) => {
            e.preventDefault();
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.role === 'admin') {
                await showPage('admin');
            } else {
                alert('Доступ запрещён');
            }
        });
    }
    
    if (navLogout) {
        navLogout.addEventListener('click', async (e) => {
            e.preventDefault();
            if (confirm('Выйти из аккаунта?')) {
                clearCurrentUser();
                await showPage('auth');
            }
        });
    }
    
    // Скрываем/показываем админ-пункт в зависимости от пользователя
    updateAdminMenuItem();
}

export function updateAdminMenuItem() {
    const adminItem = document.getElementById('navAdminItem');
    const currentUser = getCurrentUser();
    if (adminItem) {
        adminItem.style.display = (currentUser && currentUser.role === 'admin') ? 'block' : 'none';
    }
    
    const homeItem = document.getElementById('navHomeItem');
    if (homeItem) {
        if (currentUser && (currentUser.role === 'operator' || currentUser.role === 'admin')) {
            homeItem.style.display = 'block';
        } else {
            homeItem.style.display = 'none';
        }
    }
}

// Запуск приложения
initApp();