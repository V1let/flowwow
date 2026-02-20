// js/reset-password.js

const API_BASE = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reset-password-form');
    const errorMsg = document.getElementById('error-msg');
    const successMsg = document.getElementById('success-msg');
    const tokenInput = document.getElementById('token');

    if (!form) return;

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        if (errorMsg) {
            errorMsg.textContent = 'Отсутствует токен сброса пароля';
            errorMsg.classList.remove('hidden');
        }
        return;
    }

    tokenInput.value = token;

    form.addEventListener('submit', async e => {
        e.preventDefault();

        if (errorMsg) {
            errorMsg.classList.add('hidden');
            errorMsg.textContent = '';
        }
        if (successMsg) {
            successMsg.classList.add('hidden');
            successMsg.textContent = '';
        }

        const newPassword = document.getElementById('new-password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();

        if (newPassword !== confirmPassword) {
            if (errorMsg) {
                errorMsg.textContent = 'Пароли не совпадают';
                errorMsg.classList.remove('hidden');
            }
            return;
        }

        if (newPassword.length < 6) {
            if (errorMsg) {
                errorMsg.textContent = 'Пароль должен содержать не менее 6 символов';
                errorMsg.classList.remove('hidden');
            }
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token, newPassword })
            });

            if (!response.ok) {
                const errorText = await response.text().catch(() => 'Ошибка сброса пароля');
                throw new Error(errorText || 'Ошибка сброса пароля');
            }

            if (successMsg) {
                successMsg.textContent = 'Пароль успешно изменен! Перенаправляем на страницу входа...';
                successMsg.classList.remove('hidden');
            }

            form.reset();

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } catch (err) {
            console.error('Ошибка сброса пароля:', err);
            if (errorMsg) {
                errorMsg.textContent = err.message || 'Ошибка сброса пароля';
                errorMsg.classList.remove('hidden');
            }
        }
    });
});
