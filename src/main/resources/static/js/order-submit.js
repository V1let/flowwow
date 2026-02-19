// js/order-submit.js — Оформление заказа

let currentCart = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Проверка авторизации
    if (!isLoggedIn()) {
        showToast('Войдите для оформления заказа', 'error');
        window.location.href = '../other/login.html';
        return;
    }

    // Загрузка корзины
    try {
        currentCart = await api.getCart();
        renderOrderSummary();
    } catch (error) {
        showToast('Не удалось загрузить корзину', 'error');
        document.getElementById('order-items').innerHTML = 
            `<p class="error">Ошибка: ${error.message}</p>`;
        return;
    }

    // Если корзина пуста
    if (!currentCart.items || currentCart.items.length === 0) {
        showToast('Ваша корзина пуста', 'error');
        window.location.href = '../pages/catalog.html';
        return;
    }

    // Установка минимальной даты доставки (сегодня)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('delivery-date').min = today;
    document.getElementById('delivery-date').value = today;

    // Автозаполнение данных пользователя
    await fillUserData();

    // Обработчик формы
    document.getElementById('order-form').addEventListener('submit', submitOrder);
});

// ────────────── ЗАПОЛНЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ ──────────────
async function fillUserData() {
    try {
        // Получаем данные пользователя из localStorage
        const userName = localStorage.getItem('userName') || '';
        
        // Пытаемся получить email из токена или localStorage
        // В реальном приложении можно сделать запрос к /api/users/me
        
        if (userName) {
            document.getElementById('customer-name').value = userName;
        }
    } catch (error) {
        console.error('Ошибка заполнения данных:', error);
    }
}

// ────────────── РЕНДЕР СВОДКИ ЗАКАЗА ──────────────
function renderOrderSummary() {
    const itemsContainer = document.getElementById('order-items');
    const totalEl = document.getElementById('order-total');

    if (!currentCart.items || currentCart.items.length === 0) {
        itemsContainer.innerHTML = '<p>Корзина пуста</p>';
        totalEl.textContent = '0 ₽';
        return;
    }

    itemsContainer.innerHTML = currentCart.items.map(item => {
        const imageRaw = item.productImage || '../images/placeholder.jpg';
        const image = window.resolveAssetUrl ? window.resolveAssetUrl(imageRaw) : imageRaw;
        const name = item.productName || 'Товар';
        const price = item.price || 0;
        const quantity = item.quantity || 1;
        const total = price * quantity;

        return `
            <div class="order-item">
                <div class="order-item-img" style="background-image: url('${image}')"></div>
                <div class="order-item-info">
                    <h4>${name}</h4>
                    <p>${quantity} шт. × ${price.toLocaleString()} ₽ = ${total.toLocaleString()} ₽</p>
                </div>
            </div>
        `;
    }).join('');

    const total = currentCart.totalPrice || 
        currentCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    totalEl.textContent = `${total.toLocaleString()} ₽`;
}

// ────────────── ОТПРАВКА ЗАКАЗА ──────────────
async function submitOrder(e) {
    e.preventDefault();

    if (!currentCart || !currentCart.items || currentCart.items.length === 0) {
        showToast('Корзина пуста', 'error');
        return;
    }

    const orderData = {
        customerName: document.getElementById('customer-name').value.trim(),
        customerPhone: document.getElementById('customer-phone').value.trim(),
        customerEmail: document.getElementById('customer-email').value.trim(),
        deliveryAddress: document.getElementById('delivery-address').value.trim(),
        deliveryDate: document.getElementById('delivery-date').value,
        deliveryTime: document.getElementById('delivery-time').value,
        comment: document.getElementById('comment').value.trim(),
        items: currentCart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity || 1
        }))
    };

    // Валидация
    if (!orderData.customerName || !orderData.customerPhone || 
        !orderData.customerEmail || !orderData.deliveryAddress || 
        !orderData.deliveryDate) {
        showToast('Заполните все обязательные поля', 'error');
        return;
    }

    try {
        const order = await api.createOrder(orderData);
        
        showToast('Заказ успешно оформлен!', 'success');

        // Очищаем корзину после успешного оформления
        try {
            await api.clearCart();
        } catch (e) {
            // Если очистка не удалась, не блокируем редирект
            console.warn('Не удалось очистить корзину:', e);
        }
        
        // Перенаправление на страницу успеха
        setTimeout(() => {
            window.location.href = `order-success.html?id=${order.id}`;
        }, 1000);
        
    } catch (error) {
        showToast(error.message || 'Не удалось оформить заказ', 'error');
    }
}

