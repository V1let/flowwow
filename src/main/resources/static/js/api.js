// js/api.js — центральный клиент для всего фронта
const API_BASE = 'http://localhost:8080/api';

const api = {
    // ────────────── JWT TOKEN ──────────────
    get token() {
        return localStorage.getItem('jwtToken');
    },

    set token(value) {
        if (value) localStorage.setItem('jwtToken', value);
        else localStorage.removeItem('jwtToken');
    },

    headers() {
        const h = { 'Content-Type': 'application/json' };
        if (this.token) h.Authorization = `Bearer ${this.token}`;
        return h;
    },

    async request(url, options = {}) {
        const res = await fetch(API_BASE + url, {
            ...options,
            headers: { ...this.headers(), ...options.headers }
        });

        if (res.status === 401) {
            this.token = null;
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userRole');
            window.location.href = '../other/login.html';
            throw new Error('Unauthorized');
        }

        if (res.status === 403) {
            throw new Error('Доступ запрещён');
        }

        if (!res.ok) {
            const err = await res.text().catch(() => 'Unknown error');
            throw new Error(err || res.statusText);
        }

        if (res.status === 204) return null;

        const responseText = await res.text();
        if (!responseText) return null;

        try {
            return JSON.parse(responseText);
        } catch {
            return responseText;
        }
    },

    // ────────────── AUTH ──────────────
    login(data) {
        return this.request('/auth/login', { method: 'POST', body: JSON.stringify(data) });
    },

    register(data) {
        return this.request('/auth/register', { method: 'POST', body: JSON.stringify(data) });
    },

    forgotPassword(email) {
        return this.request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
    },

    resetPassword(token, newPassword) {
        return this.request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, newPassword }) });
    },

    // ────────────── PRODUCTS ──────────────
    getProducts(params = {}) {
        const q = new URLSearchParams(params).toString();
        return this.request(`/products?${q}`);
    },

    getProductBySlug(slug) {
        return this.request(`/products/${slug}`);
    },

    getProductById(id) {
        return this.request(`/products/id/${id}`);
    },

    getHits() {
        return this.request('/products/hits');
    },

    getNew() {
        return this.request('/products/new');
    },

    // ────────────── CATEGORIES ──────────────
    getCategories() {
        return this.request('/categories');
    },

    getCategoryBySlug(slug) {
        return this.request(`/categories/${slug}`);
    },

    getCategoryById(id) {
        return this.request(`/categories/id/${id}`);
    },

    // ────────────── CART ──────────────
    getCart() {
        return this.request('/cart');
    },

    addToCart(productId, quantity = 1) {
        return this.request('/cart/items', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity })
        });
    },

    updateCartItem(itemId, quantity) {
        return this.request(`/cart/items/${itemId}?quantity=${quantity}`, { method: 'PUT' });
    },

    removeFromCart(itemId) {
        return this.request(`/cart/items/${itemId}`, { method: 'DELETE' });
    },

    clearCart() {
        return this.request('/cart', { method: 'DELETE' });
    },

    // ────────────── FAVORITES ──────────────
    getFavorites() {
        return this.request('/favorites');
    },

    addToFavorite(productId) {
        return this.request(`/favorites/${productId}`, { method: 'POST' });
    },

    removeFromFavorite(productId) {
        return this.request(`/favorites/${productId}`, { method: 'DELETE' });
    },

    isFavorite(productId) {
        return this.request(`/favorites/check/${productId}`);
    },

    // ────────────── ORDERS ──────────────
    getMyOrders() {
        return this.request('/orders/my');
    },

    getOrderById(id) {
        return this.request(`/orders/${id}`);
    },

    createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    },

    // ────────────── REVIEWS ──────────────
    getProductReviews(productId) {
        return this.request(`/reviews/product/${productId}`);
    },

    getRecentReviews(limit = 3) {
        return this.request(`/reviews/recent?limit=${limit}`);
    },

    createReview(productId, rating, comment) {
        const authorName = localStorage.getItem('userName') || 'Пользователь';
        return this.request('/reviews', {
            method: 'POST',
            body: JSON.stringify({ productId, authorName, rating, text: comment })
        });
    },

    // ────────────── CONTENT ──────────────
    getTestimonials() {
        return this.request('/content/testimonials');
    },

    getTeamMembers() {
        return this.request('/content/team');
    },

    getBlogPosts(page = 0, size = 10) {
        return this.request(`/content/blog?page=${page}&size=${size}`);
    },

    getBlogPostBySlug(slug) {
        return this.request(`/content/blog/${slug}`);
    },

    // ────────────── ADMIN: DASHBOARD ──────────────
    getDashboard() {
        return this.request('/admin/dashboard');
    },

    // ────────────── ADMIN: PRODUCTS ──────────────
    getAdminProducts() {
        return this.request('/admin/products');
    },

    getArchivedAdminProducts() {
        return this.request('/admin/products/archive');
    },

    createProduct(productData) {
        return this.request('/admin/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        });
    },

    updateProduct(id, productData) {
        return this.request(`/admin/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        });
    },

    updateProductPartial(id, productData) {
        return this.request(`/admin/products/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(productData)
        });
    },

    uploadProductImage(productId, file, isMain = false) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('isMain', isMain ? 'true' : 'false');

        return fetch(`${API_BASE}/products/${productId}/images/upload`, {
            method: 'POST',
            headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
            body: formData
        }).then(async res => {
            if (!res.ok) {
                const err = await res.text().catch(() => 'Upload error');
                throw new Error(err || res.statusText);
            }
            return res.json();
        });
    },

    deleteProduct(id) {
        return this.request(`/admin/products/${id}`, { method: 'DELETE' });
    },

    restoreProduct(id) {
        return this.request(`/admin/products/${id}/restore`, { method: 'POST' });
    },

    // ────────────── ADMIN: ORDERS ──────────────
    getAdminOrders(page = 0, size = 10) {
        return this.request(`/admin/orders?page=${page}&size=${size}`);
    },

    getAdminOrderById(id) {
        return this.request(`/admin/orders/${id}`);
    },

    updateOrderStatus(id, status) {
        return this.request(`/admin/orders/${id}/status?status=${status}`, { method: 'PUT' });
    },

    // ────────────── ADMIN: CATEGORIES ──────────────
    getAdminCategories() {
        return this.request('/admin/categories');
    },

    createCategory(categoryData) {
        return this.request('/admin/categories', {
            method: 'POST',
            body: JSON.stringify(categoryData)
        });
    },

    updateCategory(id, categoryData) {
        return this.request(`/admin/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(categoryData)
        });
    },

    deleteCategory(id) {
        return this.request(`/admin/categories/${id}`, { method: 'DELETE' });
    },

    // ────────────── ADMIN: USERS ──────────────
    getAdminUsers(page = 0, size = 10) {
        return this.request(`/admin/users?page=${page}&size=${size}`);
    },

    updateUserStatus(id, isActive) {
        return this.request(`/admin/users/${id}/status?isActive=${isActive}`, { method: 'PUT' });
    },

    deleteUser(id) {
        return this.request(`/admin/users/${id}`, { method: 'DELETE' });
    },

    // ────────────── ADMIN: REVIEWS ──────────────
    getPendingReviews(page = 0, size = 10) {
        return this.request(`/reviews/pending?page=${page}&size=${size}`);
    },

    approveReview(id) {
        return this.request(`/reviews/${id}/approve`, { method: 'POST' });
    },

    rejectReview(id) {
        return this.request(`/reviews/${id}/reject`, { method: 'POST' });
    }
};

// Глобальный доступ
window.api = api;

// ────────────── ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ──────────────
window.isLoggedIn = function() {
    return localStorage.getItem('isLoggedIn') === 'true';
};

window.isAdmin = function() {
    return localStorage.getItem('userRole') === 'ADMIN' && window.isLoggedIn();
};

window.getJwtToken = function() {
    return localStorage.getItem('jwtToken');
};
