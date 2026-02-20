// js/category.js — Страница категории с интеграцией бэкенда

function getUrlParameter(name) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

document.addEventListener('DOMContentLoaded', async () => {
    const categoryId = getUrlParameter('id');
    const categorySlug = getUrlParameter('slug');
    const titleEl = document.getElementById('category-title');
    const descEl = document.getElementById('category-description');
    const currentCat = document.getElementById('current-category');
    const container = document.getElementById('products-container');

    if (!container) return;

    let category = null;
    let products = [];

    try {
        // Загрузка категории
        if (categoryId) {
            category = await api.getCategoryById(categoryId);
        } else if (categorySlug) {
            category = await api.getCategoryBySlug(categorySlug);
        }

        if (category) {
            titleEl.textContent = category.name;
            descEl.textContent = category.description || `Букеты в категории «${category.name}»`;
            if (currentCat) currentCat.textContent = category.name;
        } else {
            titleEl.textContent = "Категория не найдена";
            descEl.textContent = "Вернитесь в каталог и выберите интересующую категорию";
        }

        // Загрузка товаров этой категории
        const data = await api.getProducts({ categoryId: categoryId || category?.id });
        products = data.content || data;

        renderProducts(products);

    } catch (error) {
        console.error('Ошибка загрузки категории:', error);
        container.innerHTML = `<p class="error">Ошибка загрузки: ${error.message}</p>`;
    }

    // ────────────── РЕНДЕР ТОВАРОВ ──────────────
    function renderProducts(productsList) {
        container.innerHTML = '';

        if (productsList.length === 0) {
            container.innerHTML = '<p class="text-center">В этой категории пока нет товаров</p>';
            return;
        }

        productsList.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.cursor = 'pointer';

            const mainImageRaw = p.images?.find(img => img.isMain)?.imagePath || p.images?.[0]?.imagePath || '../images/placeholder.jpg';
            const mainImage = window.resolveAssetUrl ? window.resolveAssetUrl(mainImageRaw) : mainImageRaw;

            card.innerHTML = `
                <div class="product-img" style="background-image: url('${mainImage}')">
                    ${p.oldPrice ? `<span class="product-badge">Скидка</span>` : ''}
                    <button class="wishlist-btn"><i class="far fa-heart"></i></button>
                </div>
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p>${p.description || ''}</p>
                    <div class="product-rating">
                        ${'<i class="fas fa-star"></i>'.repeat(Math.floor(p.ratingAverage || 0))}
                        ${(p.ratingAverage || 0) % 1 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                        ${'<i class="far fa-star"></i>'.repeat(5 - Math.ceil(p.ratingAverage || 0))}
                        <span>(${p.reviewsCount || 0})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">${p.price.toLocaleString()} ₽</span>
                        ${p.oldPrice ? `<span class="old-price">${p.oldPrice.toLocaleString()} ₽</span>` : ''}
                    </div>
                    <button class="btn btn-small add-to-cart"
                            data-id="${p.id}"
                            data-name="${p.name}"
                            data-price="${p.price}"
                            data-image="${mainImage}">
                        В корзину
                    </button>
                </div>
            `;
            container.appendChild(card);

            card.addEventListener('click', (e) => {
                if (e.target.closest('.add-to-cart') || e.target.closest('.wishlist-btn')) return;
                window.location.href = `product.html?id=${p.id}`;
            });
        });

        attachEventListeners();

        if (window.applyCartState && window.__lastCartState) {
            window.applyCartState(window.__lastCartState);
        } else if (window.refreshCartState) {
            window.refreshCartState();
        }
    }

    // ────────────── ОБРАБОТЧИКИ СОБЫТИЙ ──────────────
    function attachEventListeners() {
        container.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const { id } = btn.dataset;
                if (window.toggleCartItem) {
                    await window.toggleCartItem(id, 1);
                } else {
                    await addToCart(id, 1);
                }
            });
        });

        container.querySelectorAll('.wishlist-btn i').forEach(async heart => {
            const card = heart.closest('.product-card');
            const addBtn = card?.querySelector('.add-to-cart');
            if (!addBtn) return;

            const productId = addBtn.dataset.id;

            if (isLoggedIn()) {
                try {
                    const isFav = await api.isFavorite(productId);
                    if (isFav) {
                        heart.classList.add('fas', 'active');
                        heart.classList.remove('far');
                    }
                } catch (e) {
                    // Не авторизован
                }
            }

            heart.addEventListener('click', async () => {
                if (!isLoggedIn()) {
                    showToast('Войдите, чтобы добавить в избранное', 'error');
                    window.location.href = '../other/login.html';
                    return;
                }

                try {
                    const isFav = await api.isFavorite(productId);
                    if (isFav) {
                        await api.removeFromFavorite(productId);
                        heart.classList.remove('fas', 'active');
                        heart.classList.add('far');
                        showToast('Удалено из избранного', 'info');
                    } else {
                        await api.addToFavorite(productId);
                        heart.classList.remove('far');
                        heart.classList.add('fas', 'active');
                        showToast('Добавлено в избранное', 'success');
                    }
                } catch (error) {
                    showToast(error.message, 'error');
                }
            });
        });
    }

    // ────────────── ДОБАВИТЬ В КОРЗИНУ ──────────────
    async function addToCart(productId, quantity = 1) {
        if (!isLoggedIn()) {
            showToast('Войдите, чтобы добавить в корзину', 'error');
            window.location.href = '../other/login.html';
            return;
        }

        try {
            if (window.toggleCartItem) {
                await window.toggleCartItem(productId, quantity);
            } else {
                const cart = await api.addToCart(productId, quantity);
                showToast('Товар добавлен в корзину', 'success');
                if (window.applyCartState) {
                    window.applyCartState(cart);
                } else {
                    updateCartCount();
                }
            }
        } catch (error) {
            showToast(error.message || 'Не удалось добавить в корзину', 'error');
        }
    }

    // ────────────── ОБНОВЛЕНИЕ СЧЁТЧИКА КОРЗИНЫ ──────────────
    async function updateCartCount() {
        if (window.refreshCartState) {
            await window.refreshCartState();
        }
    }

});
