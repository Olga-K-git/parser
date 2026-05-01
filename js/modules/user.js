import { showPage } from './navigation.js';
import { getCurrentUser, clearCurrentUser } from './storage.js';

export function initProfile() {
    updateProfile();
    setupLogoutButton();
}

function updateProfile() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const fullName = `${currentUser.lastName || ''} ${currentUser.firstName || ''} ${currentUser.patronymic || ''}`.trim() || 'Ч';
    
    setText('profileFullName', fullName);
    setText('profileEmail', currentUser.email);
    setText('profileMail', currentUser.email);
    setText('profilePhone', currentUser.phone || 'Ч');
    setText('profilePosition', currentUser.position || 'Ч');
    
    const roleName = { marketer: 'ћаркетолог', operator: 'ќператор', admin: 'јдминистратор' }[currentUser.role] || currentUser.role;
    setText('profileRole', roleName);
}

function setText(elementId, text) {
    const el = document.getElementById(elementId);
    if (el) el.innerText = text;
}

function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

function logout() {
    if (confirm('¬ыйти из аккаунта?')) {
        clearCurrentUser();
        showPage('auth');
    }
}