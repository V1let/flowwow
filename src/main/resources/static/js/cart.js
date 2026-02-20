// js/cart.js — Корзина + Избранное
// Использует api.js для работы с бэкендом

// ────────────── КОРЗИНА (БЭКЕНД) ──────────────

let currentCart = null; // Кэш корзины

async function renderCart() {
    const cartItemsEl = document.getElementById('cart-items');
    const cartEmptyEl = document.getElementById('cart-empty');
    const cartSummaryEl = document.getElementById('cart-summary');
    const totalPriceEl = document.getElementById('total-price');
    const cartCountSidebar = document.getElementById('cart-count-sidebar');

    if (!cartItemsEl) return;

    // Проверка авторизации
    if (!isLoggedIn()) {
        cartItemsEl.style.display = 'none';
        cartEmptyEl.style.display = 'block';
        cartEmptyEl.innerHTML = `
            <div style="padding: 80px 20px; text-align: center;">
                <i class="fas fa-lock" style="font-size: 5rem; color: #ddd; margin-bottom: 20px;"></i>
                <h2>Войдите для просмотра корзины</h2>
                <p style="margin: 15px 0 30px; color: #666;">
                    Корзина доступна только авторизованным пользователям
                </p>
                <a href="../other/login.html" class="btn">Войти</a>
            </div>
        `;
        cartSummaryEl.style.display = 'none';
        if (totalPriceEl) totalPriceEl.textContent = '0';
        return;
    }

    try {
        currentCart = await api.getCart();
    } catch (error) {
        cartItemsEl.innerHTML = `<p class="error">Ошибка загрузки корзины: ${error.message}</p>`;
        cartEmptyEl.style.display = 'none';
        cartSummaryEl.style.display = 'none';
        return;
    }

    if (window.applyCartState) {
        window.applyCartState(currentCart);
    }

    const items = currentCart.items || [];

    // Обновляем счётчик в хедере
    if (cartCountSidebar) {
        cartCountSidebar.textContent = currentCart.totalItems || 0;
    }

    if (items.length === 0) {
        cartItemsEl.style.display = 'none';
        cartEmptyEl.style.display = 'block';
        cartEmptyEl.innerHTML = `
            <div style="padding: 80px 20px; text-align: center;">
                <i class="fas fa-shopping-cart" style="font-size: 5rem; color: #ddd; margin-bottom: 20px;"></i>
                <h2>Ваша корзина пуста</h2>
                <p style="margin: 15px 0 30px; color: #666;">
                    Добавьте товары из каталога, чтобы оформить заказ
                </p>
                <a href="../pages/catalog.html" class="btn">Перейти в каталог</a>
            </div>
        `;
        cartSummaryEl.style.display = 'none';
        if (totalPriceEl) totalPriceEl.textContent = '0';
        return;
    }

    // Рендерим товары
    cartItemsEl.innerHTML = '';
    let total = 0;

    items.forEach(item => {
        const itemTotal = item.totalPrice || (item.price * (item.quantity || 1));
        total += itemTotal;
        const itemImageRaw = item.productImage || '../images/placeholder.jpg';
        const itemImage = window.resolveAssetUrl ? window.resolveAssetUrl(itemImageRaw) : itemImageRaw;

        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-img" style="background-image: url('${itemImage}')"></div>
            <div class="cart-item-info">
                <h4>${item.productName}</h4>
                <p>${item.price.toLocaleString()} ₽</p>
            </div>
            <div class="cart-item-quantity">
                <button class="qty-btn" onclick="changeQuantity('${item.id}', -1)">−</button>
                <span>${item.quantity || 1}</span>
                <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
            </div>
            <div class="cart-item-total">
                ${itemTotal.toLocaleString()} ₽
            </div>
            <button class="remove-from-cart" data-item-id="${item.id}">×</button>
        `;
        cartItemsEl.appendChild(itemEl);
    });

    if (totalPriceEl) {
        totalPriceEl.textContent = currentCart.totalPrice ? currentCart.totalPrice.toLocaleString() : total.toLocaleString();
    }

    cartItemsEl.style.display = 'block';
    cartEmptyEl.style.display = 'none';
    cartSummaryEl.style.display = 'block';

    // Обработчики удаления
    cartItemsEl.querySelectorAll('.remove-from-cart').forEach(btn => {
        btn.addEventListener('click', async () => {
            const itemId = btn.dataset.itemId;
            try {
                currentCart = await api.removeFromCart(itemId);
                await renderCart();
                showToast('Товар удалён из корзины', 'info');
            } catch (error) {
                showToast(error.message, 'error');
            }
        });
    });
}

// Изменить количество (глобальная функция)
window.changeQuantity = async function(itemId, delta) {
    if (!currentCart) return;

    const item = currentCart.items.find(i => i.id == itemId);
    if (!item) return;

    const newQuantity = Math.max(1, (item.quantity || 1) + delta);

    try {
        currentCart = await api.updateCartItem(itemId, newQuantity);
        await renderCart();
        showToast('Корзина обновлена', 'success');
    } catch (error) {
        showToast(error.message, 'error');
    }
};

// ────────────── ДОБАВИТЬ В КОРЗИНУ ──────────────

async function addToCart(productId, quantity = 1) {
    if (!isLoggedIn()) {
        showToast('Войдите, чтобы добавить в корзину', 'error');
        window.location.href = '../other/login.html';
        return;
    }

    try {
        const cart = await api.addToCart(productId, quantity);
        showToast('Товар добавлен в корзину', 'success');
        // Обновляем корзину если мы на странице корзины
        if (document.getElementById('cart-items')) {
            currentCart = cart;
        }
        if (window.applyCartState) {
            window.applyCartState(cart);
        } else {
            updateCartCount();
        }
    } catch (error) {
        showToast(error.message || 'Не удалось добавить в корзину', 'error');
    }
}

function updateCartCount() {
    if (window.applyCartState && currentCart) {
        window.applyCartState(currentCart);
    }
}

// ────────────── ИЗБРАННОЕ (БЭКЕНД + LOCALSTORAGE) ──────────────

async function getFavorites() {
    if (!isLoggedIn()) {
        return JSON.parse(localStorage.getItem('favorites')) || [];
    }
    try {
        return await api.getFavorites();
    } catch (error) {
        return [];
    }
}

async function saveFavorites(favs) {
    if (isLoggedIn()) {
        // Для бэкенда избранное управляется через API
    }
    localStorage.setItem('favorites', JSON.stringify(favs));
}

async function toggleFavorite(id, name, price, image, heartIcon) {
    if (!isLoggedIn()) {
        showToast('Войдите, чтобы управлять избранным', 'error');
        window.location.href = '../other/login.html';
        return;
    }

    try {
        const isFav = await api.isFavorite(id);
        
        if (isFav) {
            await api.removeFromFavorite(id);
            if (heartIcon) {
                heartIcon.classList.remove('fas', 'active');
                heartIcon.classList.add('far');
            }
            showToast('Удалено из избранного', 'info');
        } else {
            await api.addToFavorite(id);
            if (heartIcon) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas', 'active');
            }
            showToast('Добавлено в избранное', 'success');
        }

        // Если мы на странице избранного — перерисовываем
        if (document.getElementById('favorites-list')) {
            renderFavorites();
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Рендер страницы избранного
async function renderFavorites() {
    const listEl = document.getElementById('favorites-list');
    const emptyEl = document.getElementById('favorites-empty');

    if (!listEl) return;

    const favs = await getFavorites();

    if (!favs || favs.length === 0) {
        listEl.style.display = 'none';
        emptyEl.style.display = 'block';
        return;
    }

    listEl.innerHTML = '';
    favs.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Для бэкенда favorite может иметь другую структуру
        const productId = item.product?.id || item.productId;
        const productName = item.product?.name || item.name || 'Товар';
        const productPrice = item.product?.price || item.price || 0;
        const productImageRaw = item.product?.images?.[0]?.imagePath || item.image || '../images/placeholder.jpg';
        const productImage = window.resolveAssetUrl ? window.resolveAssetUrl(productImageRaw) : productImageRaw;

        if (!productId) return;
        card.dataset.id = productId;

        card.innerHTML = `
            <div class="product-img" style="background-image: url('${productImage}')">
                <button class="wishlist-btn">
                    <i class="fas fa-heart active" data-id="${productId}"></i>
                </button>
            </div>
            <div class="product-info">
                <h3>${productName}</h3>
                <div class="product-price">
                    <span class="current-price">${productPrice.toLocaleString()} ₽</span>
                </div>
                <button class="btn btn-small add-to-cart"
                        data-id="${productId}"
                        data-name="${productName}"
                        data-price="${productPrice}"
                        data-image="${productImage}">
                    В корзину
                </button>
            </div>
        `;
        listEl.appendChild(card);

        card.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart') || e.target.closest('.wishlist-btn')) return;
            const id = card.dataset.id;
            if (id) window.location.href = `product.html?id=${id}`;
        });
    });

    listEl.style.display = 'grid';
    emptyEl.style.display = 'none';

    if (window.applyCartState && window.__lastCartState) {
        window.applyCartState(window.__lastCartState);
    } else if (window.refreshCartState) {
        window.refreshCartState();
    }

    // Обработчики удаления из избранного
    listEl.querySelectorAll('.wishlist-btn i').forEach(heart => {
        heart.addEventListener('click', () => {
            const id = heart.dataset.id;
            toggleFavorite(id, '', 0, '', heart);
        });
    });
}

// ────────────── ИНИЦИАЛИЗАЦИЯ ──────────────

document.addEventListener('DOMContentLoaded', () => {
    // Рендерим корзину при загрузке страницы
    if (document.getElementById('cart-items')) {
        renderCart();
    }

    // Рендерим избранное при загрузке страницы
    if (document.getElementById('favorites-list')) {
        renderFavorites();
    }

    // Кнопки "В корзину" на странице (если есть)
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const { id } = btn.dataset;
            if (window.toggleCartItem) {
                window.toggleCartItem(id, 1);
            } else {
                addToCart(id, 1);
            }
        });
    });

    // Сердечки избранного (если есть на странице)
    document.querySelectorAll('.wishlist-btn i').forEach(heart => {
        const card = heart.closest('.product-card');
        const addBtn = card?.querySelector('.add-to-cart');
        if (!addBtn) return;

        const id = addBtn.dataset.id;
        const name = addBtn.dataset.name;
        const price = addBtn.dataset.price;
        const image = addBtn.dataset.image;

        // Проверка статуса избранного
        if (isLoggedIn()) {
            api.isFavorite(id).then(isFav => {
                if (isFav) {
                    heart.classList.remove('far');
                    heart.classList.add('fas', 'active');
                }
            }).catch(() => {});
        }

        heart.addEventListener('click', () => {
            toggleFavorite(id, name, price, image, heart);
        });
    });
});
