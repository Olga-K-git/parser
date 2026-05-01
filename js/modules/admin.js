import { getUsers, saveUsers, getCurrentUser, setCurrentUser } from './storage.js';

export function initAdmin() {
    renderAdminUsers();
    setupAdminForms();
}

function renderAdminUsers() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    const users = getUsers();
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const fullName = `${user.lastName || ''} ${user.firstName || ''} ${user.patronymic || ''}`.trim() || '—';
        const row = tbody.insertRow();
        
        row.innerHTML = `
            <td>${escapeHtml(user.email)}</td>
            <td>${escapeHtml(fullName)}</td>
            <td>${escapeHtml(user.phone || '—')}</td>
            <td>${escapeHtml(user.position || '—')}</td>
            <td>${getRoleName(user.role)}</td>
            <td>
                <button class="btn btn-sm btn-warning reset-pwd" data-email="${escapeHtml(user.email)}">Сбросить пароль</button>
                <button class="btn btn-sm btn-info edit-user" data-email="${escapeHtml(user.email)}">Редактировать</button>
            </td>
        `;
    });
    
    // Обработчики для кнопок
    document.querySelectorAll('.reset-pwd').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const email = btn.getAttribute('data-email');
            const newPwd = prompt(`Введите новый пароль для ${email}:`, 'newpass123');
            if (newPwd) {
                const usersList = getUsers();
                const user = usersList.find(u => u.email === email);
                if (user) {
                    user.password = newPwd;
                    saveUsers();
                    renderAdminUsers();
                    alert('Пароль изменён');
                }
            }
        });
    });
    
    document.querySelectorAll('.edit-user').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const email = btn.getAttribute('data-email');
            const usersList = getUsers();
            const user = usersList.find(u => u.email === email);
            if (!user) return;
            
            const newLastName = prompt('Фамилия:', user.lastName || '');
            if (newLastName !== null) user.lastName = newLastName;
            const newFirstName = prompt('Имя:', user.firstName || '');
            if (newFirstName !== null) user.firstName = newFirstName;
            const newPatronymic = prompt('Отчество:', user.patronymic || '');
            if (newPatronymic !== null) user.patronymic = newPatronymic;
            const newPhone = prompt('Телефон:', user.phone || '');
            if (newPhone !== null) user.phone = newPhone;
            const newPosition = prompt('Должность:', user.position || '');
            if (newPosition !== null) user.position = newPosition;
            
            saveUsers();
            renderAdminUsers();
            
            // Обновляем текущего пользователя, если редактируем его
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.email === email) {
                setCurrentUser(user);
            }
            alert('Данные обновлены');
        });
    });
}

function setupAdminForms() {
    const showBtn = document.getElementById('showAddUserFormBtn');
    const addForm = document.getElementById('addUserForm');
    const cancelBtn = document.getElementById('cancelAddUserBtn');
    const createBtn = document.getElementById('createUserBtn');
    
    if (showBtn && addForm) {
        showBtn.onclick = () => {
            addForm.style.display = 'block';
        };
    }
    
    if (cancelBtn && addForm) {
        cancelBtn.onclick = () => {
            addForm.style.display = 'none';
            clearAddUserForm();
        };
    }
    
    if (createBtn) {
        createBtn.onclick = createUser;
    }
}

function createUser() {
    const email = document.getElementById('newUserEmail')?.value.trim();
    const password = document.getElementById('newUserPassword')?.value.trim();
    
    if (!email || !password) {
        alert('Заполните email и пароль');
        return;
    }
    
    const users = getUsers();
    if (users.find(u => u.email === email)) {
        alert('Пользователь уже существует');
        return;
    }
    
    const newUser = {
        email,
        password,
        role: document.getElementById('newUserRole')?.value || 'operator',
        lastName: document.getElementById('newUserLastName')?.value.trim() || '',
        firstName: document.getElementById('newUserFirstName')?.value.trim() || '',
        patronymic: document.getElementById('newUserPatronymic')?.value.trim() || '',
        phone: document.getElementById('newUserPhone')?.value.trim() || '',
        position: document.getElementById('newUserPosition')?.value.trim() || ''
    };
    
    users.push(newUser);
    saveUsers();
    renderAdminUsers();
    
    const addForm = document.getElementById('addUserForm');
    if (addForm) addForm.style.display = 'none';
    clearAddUserForm();
    alert('Пользователь создан');
}

function clearAddUserForm() {
    const fields = ['newUserEmail', 'newUserPassword', 'newUserLastName', 'newUserFirstName', 
                    'newUserPatronymic', 'newUserPhone', 'newUserPosition'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const roleSelect = document.getElementById('newUserRole');
    if (roleSelect) roleSelect.value = 'operator';
}

function getRoleName(role) {
    const roles = {
        marketer: 'Маркетолог',
        operator: 'Оператор',
        admin: 'Администратор'
    };
    return roles[role] || role;
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