import { DEFAULT_USERS } from './constants.js';

// ========== ПОЛЬЗОВАТЕЛИ ==========
let usersDB = null;
let currentUser = null;
let requestsHistory = [];

export function loadUsers() {
    const stored = localStorage.getItem('basalt_users');
    if (stored) {
        usersDB = JSON.parse(stored);
    } else {
        usersDB = [...DEFAULT_USERS];
        saveUsers();
    }
    return usersDB;
}

export function saveUsers() {
    localStorage.setItem('basalt_users', JSON.stringify(usersDB));
}

export function getUsers() {
    if (!usersDB) loadUsers();
    return usersDB;
}

export function setCurrentUser(user) {
    currentUser = { ...user };
    delete currentUser.password;
    localStorage.setItem('basalt_current_user', JSON.stringify(currentUser));
}

export function getCurrentUser() {
    if (currentUser) return currentUser;
    const stored = localStorage.getItem('basalt_current_user');
    if (stored) {
        currentUser = JSON.parse(stored);
        return currentUser;
    }
    return null;
}

export function clearCurrentUser() {
    currentUser = null;
    localStorage.removeItem('basalt_current_user');
}

export function saveHistory() {
    localStorage.setItem('basalt_history', JSON.stringify(requestsHistory));
}

export function loadHistory() {
    const saved = localStorage.getItem('basalt_history');
    if (saved) {
        requestsHistory = JSON.parse(saved);
    } else {
        requestsHistory = [];
    }
    return requestsHistory;
}

export function getHistory() {
    return requestsHistory;
}

export function setHistory(history) {
    requestsHistory = history;
    saveHistory();
}

export function addToHistory(request) {
    requestsHistory.unshift(request);
    saveHistory();
}

export function updateHistoryRequest(id, updates) {
    const index = requestsHistory.findIndex(r => r.id === id);
    if (index !== -1) {
        requestsHistory[index] = { ...requestsHistory[index], ...updates };
        saveHistory();
    }
}

export function saveLastRequestInfo(html) {
    localStorage.setItem('last_request_info', html);
}

export function getLastRequestInfo() {
    return localStorage.getItem('last_request_info');
}