// js/forgot-password.js

const API_BASE = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forgot-password-form');
    const errorMsg = document.getElementById('error-msg');
    const successMsg = document.getElementById('success-msg');

    if (!form) return;

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

        const email = document.getElementById('email').value.trim();

        try {
            const response = await fetch(`${API_BASE}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                const errorText = await response.text().catch(() => 'Ошибка отправки');
                throw new Error(errorText || 'Ошибка отправки запроса');
            }

            if (successMsg) {
                successMsg.textContent = 'Инструкции по восстановлению пароля отправлены на ваш email';
                successMsg.classList.remove('hidden');
            }

            form.reset();
        } catch (err) {
            console.error('Ошибка восстановления пароля:', err);
            if (errorMsg) {
                errorMsg.textContent = err.message || 'Ошибка отправки запроса';
                errorMsg.classList.remove('hidden');
            }
        }
    });
});
