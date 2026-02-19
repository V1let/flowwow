// js/auth.js
// Авторизация через бэкенд с JWT-токеном

const API_BASE = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    // Переключение между вкладками вход/регистрация
    const tabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if (tabName === 'login') {
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            } else {
                loginForm.classList.add('hidden');
                registerForm.classList.remove('hidden');
            }

            // Очищаем сообщения об ошибках
            document.querySelectorAll('.error').forEach(el => {
                el.classList.add('hidden');
                el.textContent = '';
            });
        });
    });

    // Форма входа
    if (loginForm) {
        const loginErrorMsg = document.getElementById('login-error-msg');

        loginForm.addEventListener('submit', async e => {
            e.preventDefault();

            if (loginErrorMsg) {
                loginErrorMsg.classList.add('hidden');
                loginErrorMsg.textContent = '';
            }

            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value.trim();

            try {
                const response = await fetch(`${API_BASE}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (!response.ok) {
                    const errorText = await response.text().catch(() => 'Ошибка входа');
                    throw new Error(errorText || 'Неверный email или пароль');
                }

                const data = await response.json();

                // Сохраняем токен и данные пользователя
                localStorage.setItem('jwtToken', data.token);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userName', data.name || data.email || email);
                localStorage.setItem('userRole', data.role || 'USER');

                // Редирект в зависимости от роли
                if (data.role === 'ADMIN') {
                    window.location.href = '../other/admin.html';
                } else {
                    window.location.href = '../pages/index.html';
                }

            } catch (err) {
                console.error('Ошибка авторизации:', err);
                if (loginErrorMsg) {
                    loginErrorMsg.textContent = err.message || 'Неверный email или пароль';
                    loginErrorMsg.classList.remove('hidden');
                }
            }
        });
    }

    // Форма регистрации
    if (registerForm) {
        const registerErrorMsg = document.getElementById('register-error-msg');

        registerForm.addEventListener('submit', async e => {
            e.preventDefault();

            if (registerErrorMsg) {
                registerErrorMsg.classList.add('hidden');
                registerErrorMsg.textContent = '';
            }

            const name = document.getElementById('register-name').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const phone = document.getElementById('register-phone').value.trim();
            const password = document.getElementById('register-password').value.trim();
            const confirmPassword = document.getElementById('register-confirm').value.trim();

            if (password !== confirmPassword) {
                if (registerErrorMsg) {
                    registerErrorMsg.textContent = 'Пароли не совпадают';
                    registerErrorMsg.classList.remove('hidden');
                }
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, phone, password })
                });

                if (!response.ok) {
                    const errorText = await response.text().catch(() => 'Ошибка регистрации');
                    throw new Error(errorText || 'Ошибка регистрации');
                }

                // После регистрации можно автоматически войти
                const loginResponse = await fetch(`${API_BASE}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (loginResponse.ok) {
                    const data = await loginResponse.json();
                    localStorage.setItem('jwtToken', data.token);
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userName', data.name || data.email || email);
                    localStorage.setItem('userRole', data.role || 'USER');

                    window.location.href = '../pages/index.html';
                }

            } catch (err) {
                console.error('Ошибка регистрации:', err);
                if (registerErrorMsg) {
                    registerErrorMsg.textContent = err.message || 'Ошибка регистрации';
                    registerErrorMsg.classList.remove('hidden');
                }
            }
        });
    }
});
