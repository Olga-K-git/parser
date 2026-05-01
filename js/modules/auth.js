import { showPage } from './navigation.js';
import { getUsers, saveUsers, setCurrentUser, getCurrentUser, loadHistory } from './storage.js';

export function initAuth() {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', loginUser);
    }
    
    const forgotLink = document.getElementById('showForgotLink');
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('forgot');
        });
    }
    
    // Скрываем ошибку при вводе
    const inputs = document.querySelectorAll('#loginForm input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const errorDiv = document.getElementById('loginError');
            if (errorDiv) errorDiv.style.display = 'none';
        });
    });
}

export function initForgot() {
    const form = document.getElementById('forgotForm');
    if (form) {
        form.addEventListener('submit', changePassword);
    }
    
    const backLink = document.getElementById('backToLoginLink');
    if (backLink) {
        backLink.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('auth');
        });
    }
}

async function loginUser(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const selectedRole = document.getElementById('loginRole').value;
    const errorDiv = document.getElementById('loginError');
    
    if (errorDiv) errorDiv.style.display = 'none';
    
    if (!email || !password) {
        showError(errorDiv, 'Заполните все поля');
        return;
    }
    
    let users = getUsers();
    let user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        // Создаём нового пользователя
        user = {
            email, password, role: selectedRole,
            lastName: 'Новый', firstName: 'Пользователь', patronymic: '', phone: '', position: 'Сотрудник'
        };
        users.push(user);
        saveUsers();
    }
    
    setCurrentUser(user);
    loadHistory();
    
    // Перенаправление в зависимости от роли
    if (user.role === 'marketer') {
        await showPage('history');
    } else {
        await showPage('home');
    }
}

async function changePassword(e) {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value.trim();
    const newPass = document.getElementById('forgotNewPass').value;
    const confirm = document.getElementById('forgotNewPassConfirm').value;
    const successDiv = document.getElementById('forgotSuccess');
    const errorDiv = document.getElementById('forgotError');
    
    if (successDiv) successDiv.style.display = 'none';
    if (errorDiv) errorDiv.style.display = 'none';
    
    if (!email) {
        showError(errorDiv, 'Укажите логин');
        return;
    }
    
    if (newPass !== confirm) {
        showError(errorDiv, 'Пароли не совпадают');
        return;
    }
    
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
        showError(errorDiv, 'Пользователь не найден');
        return;
    }
    
    user.password = newPass;
    saveUsers();
    
    if (successDiv) {
        successDiv.textContent = 'Пароль успешно изменён! Теперь войдите.';
        successDiv.style.display = 'block';
    }
    
    setTimeout(() => {
        showPage('auth');
    }, 1500);
}

function showError(element, message) {
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
    }
}