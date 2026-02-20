// js/admin.js — Админ-панель с подключением к бэкенду

const API_BASE = 'http://localhost:8080/api';

// Проверка прав администратора
function isAdmin() {
    const role = localStorage.getItem('userRole');
    return role === 'ADMIN' && localStorage.getItem('isLoggedIn') === 'true';
}

function getJwtToken() {
    return localStorage.getItem('jwtToken');
}

async function apiRequest(url, options = {}) {
    const token = getJwtToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers: { ...headers, ...options.headers }
    });

    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole');
        window.location.href = '../other/login.html';
        throw new Error('Необходима авторизация администратора');
    }

    if (!response.ok) {
        const errorText = await response.text().catch(() => 'Ошибка сервера');
        const normalizedError = normalizeApiError(errorText, response.status);
        throw new Error(normalizedError || response.statusText);
    }

    if (response.status === 204) return null;

    const responseText = await response.text();
    if (!responseText) return null;

    try {
        return JSON.parse(responseText);
    } catch {
        return responseText;
    }
}

function normalizeApiError(raw, status) {
    const text = String(raw || '').trim();
    if (!text) return `Ошибка (${status})`;
    if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
        return `Ошибка сервера (${status})`;
    }
    if (text.length > 220) {
        return `${text.slice(0, 220)}...`;
    }
    return text;
}

// ────────────── ДАШБОРД ──────────────

async function loadDashboard() {
    try {
        const data = await apiRequest('/admin/dashboard');
        renderDashboard(data);
    } catch (error) {
        console.error('Ошибка загрузки дашборда:', error);
        const container = document.getElementById('dashboard-stats');
        if (container) {
            container.innerHTML = `<p class="error">Ошибка загрузки: ${error.message}</p>`;
        }
    }
}

function renderDashboard(data) {
    // Основные статистики - исправлено соответствие номеров элементов
    document.getElementById('stat-products').textContent = data.totalProducts || 0;
    document.getElementById('stat-orders').textContent = data.totalOrders || 0;
    document.getElementById('stat-users').textContent = data.totalUsers || 0;
    document.getElementById('stat-revenue').textContent = `${(data.totalRevenue || 0).toLocaleString()} ₽`;

    // Таблица заказов по статусам
    const ordersByStatusContainer = document.getElementById('orders-by-status');
    if (ordersByStatusContainer && data.ordersByStatus) {
        ordersByStatusContainer.innerHTML = `
            <h3>Заказы по статусам</h3>
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Статус</th>
                        <th>Количество</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.ordersByStatus.map(item => `
                        <tr>
                            <td>${translateOrderStatus(item.status)}</td>
                            <td>${item.count}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // Популярные товары
    const popularProductsContainer = document.getElementById('popular-products');
    if (popularProductsContainer && data.popularProducts) {
        popularProductsContainer.innerHTML = `
            <h3>Популярные товары</h3>
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Товар</th>
                        <th>Продаж</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.popularProducts.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.orderCount}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
}

function translateOrderStatus(status) {
    const translations = {
        'PENDING': 'Ожидает',
        'CONFIRMED': 'Подтверждён',
        'PROCESSING': 'В обработке',
        'SHIPPED': 'Отправлен',
        'DELIVERED': 'Доставлен',
        'CANCELLED': 'Отменён',
        'NEW': 'Новый',
        'COMPLETED': 'Завершён'
    };
    return translations[status] || status;
}

// ────────────── ТОВАРЫ (ADMIN) ──────────────

async function loadAdminProducts() {
    try {
        const products = await apiRequest('/admin/products');
        renderAdminProducts(products);
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        const container = document.getElementById('admin-products-table');
        if (container) {
            container.innerHTML = `<p class="error">Ошибка загрузки: ${error.message}</p>`;
        }
    }
}

async function renderAdminProducts(products) {
    const container = document.getElementById('admin-products-table');
    if (!container) return;

    if (!products || products.length === 0) {
        container.innerHTML = '<p>Товары не найдены</p>';
        return;
    }

    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Цена</th>
                    <th>Категория</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                ${products.map(product => `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.price.toLocaleString()} ₽</td>
                        <td>${product.category?.name || 'Без категории'}</td>
                        <td>
                            <button class="btn-small" onclick="editProduct(${product.id})">✏️</button>
                            <button class="btn-small btn-danger" onclick="deleteProduct(${product.id})">🗑️</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

async function deleteProduct(id) {
    if (!confirm('Удалить этот товар?')) return;

    try {
        await apiRequest(`/admin/products/${id}`, { method: 'DELETE' });
        showToast('Товар удалён', 'success');
        loadAdminProducts();
        loadArchivedProducts();
        loadDashboard();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Глобальная функция для редактирования
window.editProduct = function(id) {
    window.location.href = `../other/admin-product-edit.html?id=${id}`;
};

window.deleteProduct = deleteProduct;

window.createNewProduct = function() {
    window.location.href = '../other/admin-product-edit.html';
};

// ────────────── КАТЕГОРИИ (ADMIN) ──────────────
let adminCategoriesCache = [];

function resetCategoryForm() {
    const idEl = document.getElementById('category-id');
    const nameEl = document.getElementById('category-name');
    const descEl = document.getElementById('category-description');
    const imagePathEl = document.getElementById('category-image-path');
    const sortEl = document.getElementById('category-sort-order');
    const activeEl = document.getElementById('category-is-active');

    if (!idEl || !nameEl || !descEl || !imagePathEl || !sortEl || !activeEl) return;

    idEl.value = '';
    nameEl.value = '';
    descEl.value = '';
    imagePathEl.value = '';
    sortEl.value = '0';
    activeEl.checked = true;
}

async function loadAdminCategories() {
    try {
        const categories = await apiRequest('/admin/categories');
        adminCategoriesCache = Array.isArray(categories) ? categories : [];
        renderAdminCategories(adminCategoriesCache);
    } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
        const container = document.getElementById('admin-categories-table');
        if (container) {
            container.innerHTML = `<p class="error">Ошибка загрузки: ${error.message}</p>`;
        }
    }
}

function renderAdminCategories(categories) {
    const container = document.getElementById('admin-categories-table');
    if (!container) return;

    if (!categories.length) {
        container.innerHTML = '<p>Категории не найдены</p>';
        return;
    }

    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Slug</th>
                    <th>Порядок</th>
                    <th>Активна</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                ${categories.map(category => `
                    <tr>
                        <td>${category.id}</td>
                        <td>${category.name || '-'}</td>
                        <td>${category.slug || '-'}</td>
                        <td>${category.sortOrder ?? 0}</td>
                        <td>${category.isActive === false ? 'Нет' : 'Да'}</td>
                        <td>
                            <button class="btn-small" onclick="editCategory(${category.id})">✏️</button>
                            <button class="btn-small btn-danger" onclick="deleteCategory(${category.id})">🗑️</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

async function saveCategory(event) {
    event.preventDefault();

    const id = document.getElementById('category-id').value;
    const sortOrderRaw = document.getElementById('category-sort-order').value;
    const sortOrder = Number(sortOrderRaw);
    const payload = {
        name: document.getElementById('category-name').value.trim(),
        description: document.getElementById('category-description').value.trim(),
        imagePath: document.getElementById('category-image-path').value.trim() || null,
        sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
        isActive: document.getElementById('category-is-active').checked
    };

    if (!payload.name) {
        showToast('Введите название категории', 'error');
        return;
    }

    try {
        if (id) {
            await apiRequest(`/admin/categories/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
            showToast('Категория обновлена', 'success');
        } else {
            await apiRequest('/admin/categories', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            showToast('Категория создана', 'success');
        }

        resetCategoryForm();
        loadAdminCategories();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function editCategory(id) {
    try {
        if (!adminCategoriesCache.length) {
            await loadAdminCategories();
        }

        const category = adminCategoriesCache.find(c => String(c.id) === String(id));
        if (!category) {
            showToast('Категория не найдена', 'error');
            return;
        }

        document.getElementById('category-id').value = category.id;
        document.getElementById('category-name').value = category.name || '';
        document.getElementById('category-description').value = category.description || '';
        document.getElementById('category-image-path').value = category.imagePath || '';
        document.getElementById('category-sort-order').value = category.sortOrder ?? 0;
        document.getElementById('category-is-active').checked = category.isActive !== false;
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function deleteCategory(id) {
    if (!confirm('Удалить категорию?')) return;

    try {
        await apiRequest(`/admin/categories/${id}`, { method: 'DELETE' });
        showToast('Категория удалена', 'success');
        resetCategoryForm();
        loadAdminCategories();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

window.editCategory = editCategory;
window.deleteCategory = deleteCategory;

// ────────────── АРХИВ ТОВАРОВ ──────────────

async function loadArchivedProducts() {
    try {
        const products = await apiRequest('/admin/products/archive');
        renderArchivedProducts(products);
    } catch (error) {
        console.error('Ошибка загрузки архива товаров:', error);
        const container = document.getElementById('archived-products-table');
        if (container) {
            container.innerHTML = `<p class="error">Ошибка загрузки: ${error.message}</p>`;
        }
    }
}

function renderArchivedProducts(products) {
    const container = document.getElementById('archived-products-table');
    if (!container) return;

    if (!products || products.length === 0) {
        container.innerHTML = '<p>Архив пуст</p>';
        return;
    }

    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Цена</th>
                    <th>Категория</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                ${products.map(product => `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.price.toLocaleString()} ₽</td>
                        <td>${product.category?.name || 'Без категории'}</td>
                        <td>
                            <button class="btn-small" onclick="restoreProduct(${product.id})">Восстановить</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

async function restoreProduct(id) {
    try {
        await apiRequest(`/admin/products/${id}/restore`, { method: 'POST' });
        showToast('Товар восстановлен', 'success');
        loadArchivedProducts();
        loadAdminProducts();
        loadDashboard();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

window.restoreProduct = restoreProduct;

// ────────────── ЗАКАЗЫ (ADMIN) ──────────────

async function loadAdminOrders(page = 0, size = 10) {
    try {
        const result = await apiRequest(`/admin/orders?page=${page}&size=${size}`);
        renderAdminOrders(result);
    } catch (error) {
        console.error('Ошибка загрузки заказов:', error);
        const container = document.getElementById('admin-orders-table');
        if (container) {
            container.innerHTML = `<p class="error">Ошибка загрузки: ${error.message}</p>`;
        }
    }
}

async function renderAdminOrders(pageData) {
    const container = document.getElementById('admin-orders-table');
    const paginationContainer = document.getElementById('orders-pagination');

    if (!container) return;

    const orders = pageData.content || [];

    if (orders.length === 0) {
        container.innerHTML = '<p>Заказов не найдено</p>';
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>№ заказа</th>
                    <th>Клиент</th>
                    <th>Сумма</th>
                    <th>Статус</th>
                    <th>Дата</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                ${orders.map(order => `
                    <tr>
                        <td>${order.id}</td>
                        <td>${order.orderNumber || '#' + order.id}</td>
                        <td>${order.customerName || order.user?.name || 'Гость'}</td>
                        <td>${order.totalAmount?.toLocaleString() || 0} ₽</td>
                        <td>
                            <select onchange="updateOrderStatus(${order.id}, this.value)">
                                ${renderOrderStatusOptions(order.status)}
                            </select>
                        </td>
                        <td>${formatDate(order.createdAt)}</td>
                        <td>
                            <button class="btn-small" onclick="viewOrder(${order.id})">👁️</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // Пагинация
    if (paginationContainer) {
        paginationContainer.innerHTML = `
            <div class="pagination">
                <button ${pageData.first ? 'disabled' : ''} onclick="loadOrdersPage(${pageData.number - 1})">← Назад</button>
                <span>Страница ${pageData.number + 1} из ${pageData.totalPages}</span>
                <button ${pageData.last ? 'disabled' : ''} onclick="loadOrdersPage(${pageData.number + 1})">Вперёд →</button>
            </div>
        `;
    }
}

function renderOrderStatusOptions(currentStatus) {
    const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    return statuses.map(status =>
        `<option value="${status}" ${status === currentStatus ? 'selected' : ''}>${translateOrderStatus(status)}</option>`
    ).join('');
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        await apiRequest(`/admin/orders/${orderId}/status?status=${newStatus}`, {
            method: 'PUT'
        });
        showToast('Статус обновлён', 'success');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

window.viewOrder = function(id) {
    window.location.href = `../other/admin-order-detail.html?id=${id}`;
};

window.loadOrdersPage = function(page) {
    loadAdminOrders(page, 10);
};

// ────────────── ПОЛЬЗОВАТЕЛИ (ADMIN) ──────────────

async function loadAdminUsers(page = 0, size = 10) {
    try {
        const result = await apiRequest(`/admin/users?page=${page}&size=${size}`);
        renderAdminUsers(result);
    } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
        const container = document.getElementById('admin-users-table');
        if (container) {
            container.innerHTML = `<p class="error">Ошибка загрузки: ${error.message}</p>`;
        }
    }
}

async function renderAdminUsers(pageData) {
    const container = document.getElementById('admin-users-table');
    const paginationContainer = document.getElementById('users-pagination');

    if (!container) return;

    const users = pageData.content || [];

    if (users.length === 0) {
        container.innerHTML = '<p>Пользователей не найдено</p>';
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Имя</th>
                    <th>Email</th>
                    <th>Телефон</th>
                    <th>Роль</th>
                    <th>Статус</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.phone}</td>
                        <td>${user.role || 'USER'}</td>
                        <td>
                            <span style="color: ${user.isActive ? '#27ae60' : '#e74c3c'}">
                                ${user.isActive ? 'Активен' : 'Заблокирован'}
                            </span>
                        </td>
                        <td>
                            <button class="btn-small" onclick="toggleUserStatus(${user.id}, ${!user.isActive})">
                                ${user.isActive ? 'Заблокировать' : 'Разблокировать'}
                            </button>
                            <button class="btn-small btn-danger" onclick="deleteUser(${user.id})">🗑️</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    if (paginationContainer) {
        paginationContainer.innerHTML = `
            <div class="pagination">
                <button ${pageData.first ? 'disabled' : ''} onclick="loadUsersPage(${pageData.number - 1})">← Назад</button>
                <span>Страница ${pageData.number + 1} из ${pageData.totalPages}</span>
                <button ${pageData.last ? 'disabled' : ''} onclick="loadUsersPage(${pageData.number + 1})">Вперёд →</button>
            </div>
        `;
    }
}

async function toggleUserStatus(userId, isActive) {
    try {
        await apiRequest(`/admin/users/${userId}/status?isActive=${isActive}`, {
            method: 'PUT'
        });
        showToast(isActive ? 'Пользователь активирован' : 'Пользователь заблокирован', 'success');
        loadAdminUsers();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function deleteUser(id) {
    if (!confirm('Удалить этого пользователя? Это действие нельзя отменить!')) return;

    try {
        await apiRequest(`/admin/users/${id}`, { method: 'DELETE' });
        showToast('Пользователь удалён', 'success');
        loadAdminUsers();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

window.loadUsersPage = function(page) {
    loadAdminUsers(page, 10);
};

// ────────────── ОТЗЫВЫ (ADMIN) ──────────────

async function loadAdminReviews(page = 0, size = 10) {
    try {
        const result = await apiRequest(`/admin/reviews/pending?page=${page}&size=${size}`);
        renderAdminReviews(result);
    } catch (error) {
        console.error('Ошибка загрузки отзывов:', error);
        const container = document.getElementById('admin-reviews-table');
        if (container) {
            container.innerHTML = `<p class="error">Ошибка загрузки: ${error.message}</p>`;
        }
    }
}

function renderAdminReviews(pageData) {
    const container = document.getElementById('admin-reviews-table');
    const paginationContainer = document.getElementById('reviews-pagination');
    if (!container) return;

    const reviews = pageData?.content || [];
    if (reviews.length === 0) {
        container.innerHTML = '<p>Отзывов на модерации нет</p>';
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Автор</th>
                    <th>Товар</th>
                    <th>Оценка</th>
                    <th>Текст</th>
                    <th>Дата</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                ${reviews.map(review => `
                    <tr>
                        <td>${review.id}</td>
                        <td>${review.authorName || 'Аноним'}</td>
                        <td>${review.product?.name || 'Товар удален'}</td>
                        <td>${review.rating || 0}/5</td>
                        <td style="max-width: 320px; white-space: normal;">${review.text || ''}</td>
                        <td>${formatDate(review.createdAt)}</td>
                        <td>
                            <button class="btn-small" onclick="approveReview(${review.id})">Одобрить</button>
                            <button class="btn-small btn-danger" onclick="rejectReview(${review.id})">Отклонить</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    if (paginationContainer) {
        paginationContainer.innerHTML = `
            <div class="pagination">
                <button ${pageData.first ? 'disabled' : ''} onclick="loadReviewsPage(${pageData.number - 1})">← Назад</button>
                <span>Страница ${pageData.number + 1} из ${pageData.totalPages}</span>
                <button ${pageData.last ? 'disabled' : ''} onclick="loadReviewsPage(${pageData.number + 1})">Вперёд →</button>
            </div>
        `;
    }
}

async function approveReview(id) {
    try {
        await apiRequest(`/admin/reviews/${id}/approve`, { method: 'POST' });
        showToast('Отзыв одобрен', 'success');
        loadAdminReviews();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function rejectReview(id) {
    if (!confirm('Отклонить этот отзыв?')) return;
    try {
        await apiRequest(`/admin/reviews/${id}/reject`, { method: 'POST' });
        showToast('Отзыв отклонен', 'info');
        loadAdminReviews();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

window.approveReview = approveReview;
window.rejectReview = rejectReview;
window.loadReviewsPage = function(page) {
    loadAdminReviews(page, 10);
};

// ────────────── УВЕДОМЛЕНИЯ ──────────────

// ────────────── ИНИЦИАЛИЗАЦИЯ ──────────────

document.addEventListener('DOMContentLoaded', () => {
    // Проверка прав администратора
    if (!isAdmin()) {
        window.location.href = '../other/login.html';
        return;
    }

    // Выход
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', e => {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
            window.location.href = '../other/login.html';
        });
    }

    const categoryForm = document.getElementById('category-form');
    if (categoryForm) {
        categoryForm.addEventListener('submit', saveCategory);
    }

    const categoryCancelBtn = document.getElementById('category-cancel-btn');
    if (categoryCancelBtn) {
        categoryCancelBtn.addEventListener('click', resetCategoryForm);
    }

    // Навигация по разделам
    const links = document.querySelectorAll('.admin-nav a:not(#logout-btn)');
    const sections = document.querySelectorAll('.admin-section');
    const overlay = document.getElementById('admin-overlay');

    links.forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href') || '';
            if (!href.startsWith('#')) {
                return;
            }

            e.preventDefault();
            const targetId = href.substring(1);

            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            sections.forEach(sec => sec.classList.remove('active'));
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                loadSectionData(targetId);
            }

            // Закрываем мобильный сайдбар после выбора раздела
            const sidebar = document.querySelector('.admin-sidebar');
            if (window.innerWidth <= 768 && sidebar) {
                sidebar.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });

    // Мобильное меню
    const hamburger = document.querySelector('.admin-header .hamburger');
    const sidebar = document.querySelector('.admin-sidebar');
    if (hamburger && sidebar) {
        hamburger.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            if (overlay) {
                overlay.classList.toggle('active', sidebar.classList.contains('active'));
            }
            document.body.classList.toggle('menu-open', sidebar.classList.contains('active'));
        });
    }

    if (overlay && sidebar) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    }

    // Загрузка нужного раздела по hash, иначе дашборд
    const hash = window.location.hash ? window.location.hash.substring(1) : 'dashboard';
    const sectionIds = new Set(['dashboard', 'products', 'orders', 'users', 'archive', 'categories', 'reviews']);
    const targetId = sectionIds.has(hash) ? hash : 'dashboard';

    links.forEach(l => l.classList.remove('active'));
    const activeLink = Array.from(links).find(l => l.getAttribute('href') === `#${targetId}` || l.getAttribute('href') === `admin.html#${targetId}`);
    if (activeLink) activeLink.classList.add('active');

    sections.forEach(sec => sec.classList.remove('active'));
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    loadSectionData(targetId);

    // Отображение имени администратора
    const userName = localStorage.getItem('userName') || 'Администратор';
    const welcomeEl = document.querySelector('#dashboard h2');
    if (welcomeEl) {
        welcomeEl.textContent = `Добро пожаловать, ${userName}`;
    }
});

// Загрузка данных для секции
function loadSectionData(sectionId) {
    switch (sectionId) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'products':
            loadAdminProducts();
            break;
        case 'orders':
            loadAdminOrders();
            break;
        case 'users':
            loadAdminUsers();
            break;
        case 'archive':
            loadArchivedProducts();
            break;
        case 'categories':
            loadAdminCategories();
            break;
        case 'reviews':
            loadAdminReviews();
            break;
    }
}
