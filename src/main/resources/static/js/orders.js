// js/orders.js — Мои заказы

document.addEventListener('DOMContentLoaded', async () => {
    if (!isLoggedIn()) {
        window.location.href = '../other/login.html';
        return;
    }

    const listEl = document.getElementById('orders-list');
    const emptyEl = document.getElementById('orders-empty');

    try {
        const orders = await api.getMyOrders();

        if (!orders || orders.length === 0) {
            emptyEl.style.display = 'block';
            listEl.innerHTML = '';
            return;
        }

        listEl.innerHTML = orders.map(o => {
            const number = o.orderNumber || `#${o.id}`;
            const total = o.totalAmount ? Number(o.totalAmount).toLocaleString() : '0';
            const date = o.createdAt ? new Date(o.createdAt).toLocaleDateString('ru-RU') : '';
            const deliveryDate = o.deliveryDate ? new Date(o.deliveryDate).toLocaleDateString('ru-RU') : '';
            const itemsCount = Array.isArray(o.items) ? o.items.length : 0;

            return `
                <div class="order-summary" style="margin: 16px 0;">
                    <div style="display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
                        <div>
                            <h3 style="margin: 0 0 6px;">Заказ ${number}</h3>
                            <div style="color: #666; font-size: 0.95rem;">
                                ${date ? `Дата: ${date}` : ''}${deliveryDate ? ` · Доставка: ${deliveryDate}` : ''}
                            </div>
                            <div style="color: #666; font-size: 0.95rem;">
                                Статус: ${o.status || 'NEW'} · Позиций: ${itemsCount}
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 1.2rem; font-weight: 700;">${total} ₽</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        listEl.innerHTML = `<p class="error">Ошибка загрузки заказов: ${error.message}</p>`;
    }
});
