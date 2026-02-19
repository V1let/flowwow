// js/product.js — Страница товара

let currentProduct = null;
let currentQuantity = 1;
let selectedRating = 5;

// Глобальная функция для изменения количества (страница товара)
window.productChangeQuantity = function(delta) {
    currentQuantity = Math.max(1, currentQuantity + delta);
    document.getElementById('quantity').textContent = currentQuantity;
};

// Глобальная функция для отправки отзыва
window.submitReview = async function() {
    if (!isLoggedIn()) {
        showToast('Войдите, чтобы оставить отзыв', 'error');
        window.location.href = '../other/login.html';
        return;
    }

    const comment = document.getElementById('review-comment').value.trim();
    if (!comment) {
        showToast('Введите текст отзыва', 'error');
        return;
    }

    try {
        await api.createReview(currentProduct.id, selectedRating, comment);
        showToast('Отзыв отправлен на модерацию', 'success');
        document.getElementById('review-comment').value = '';
        loadReviews();
    } catch (error) {
        showToast(error.message, 'error');
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    // Получаем ID/slug из URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const productSlug = params.get('slug');
    const pathParts = window.location.pathname.split('/');
    const slugFromPath = pathParts[pathParts.length - 1].replace('.html', '');

    try {
        // Загрузка товара
        if (productId) {
            currentProduct = await api.getProductById(productId);
        } else if (productSlug) {
            currentProduct = await api.getProductBySlug(productSlug);
        } else if (slugFromPath && slugFromPath !== 'product') {
            currentProduct = await api.getProductBySlug(slugFromPath);
        } else {
            showToast('Товар не найден', 'error');
            return;
        }

        renderProduct(currentProduct);
        loadReviews();
        checkFavoriteStatus();
    } catch (error) {
        console.error('Ошибка загрузки товара:', error);
        document.getElementById('product-name').textContent = 'Ошибка загрузки';
        document.getElementById('product-description').textContent = error.message;
    }

    // ────────────── РЕНДЕР ТОВАРА ──────────────
    function renderProduct(product) {
        document.getElementById('page-title').textContent = `${product.name} | Flowwow`;
        document.getElementById('breadcrumb-product').textContent = product.name;
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-description').textContent = product.description || '';
        document.getElementById('product-composition').textContent = product.composition || 'Не указан';
        document.getElementById('product-category').textContent = product.category?.name || 'Без категории';
        
        // Цена
        document.getElementById('product-price').textContent = `${product.price.toLocaleString()} ₽`;
        if (product.oldPrice) {
            document.getElementById('product-old-price').textContent = `${product.oldPrice.toLocaleString()} ₽`;
        }

        // Рейтинг
        const ratingEl = document.getElementById('product-rating');
        const avgRating = product.ratingAverage || 0;
        const reviewsCount = product.reviewsCount || 0;
        ratingEl.innerHTML = `
            ${'<i class="fas fa-star"></i>'.repeat(Math.floor(avgRating))}
            ${avgRating % 1 ? '<i class="fas fa-star-half-alt"></i>' : ''}
            ${'<i class="far fa-star"></i>'.repeat(5 - Math.ceil(avgRating))}
            <span>(${reviewsCount} отзывов)</span>
        `;

        // Изображения
        const images = product.images || [];
        const mainImageRaw = images.find(img => img.isMain)?.imagePath || images[0]?.imagePath;
        const mainImage = window.resolveAssetUrl ? window.resolveAssetUrl(mainImageRaw) : mainImageRaw;
        
        if (mainImage) {
            document.getElementById('main-image').style.backgroundImage = `url('${mainImage}')`;
        }

        // Миниатюры
        const thumbnailGrid = document.getElementById('thumbnail-grid');
        if (images.length > 1) {
            thumbnailGrid.innerHTML = images.map((img, index) => `
                <div class="thumbnail ${index === 0 ? 'active' : ''}" 
                     style="background-image: url('${window.resolveAssetUrl ? window.resolveAssetUrl(img.imagePath) : img.imagePath}')"
                     onclick="changeMainImage('${img.imagePath}', this)"></div>
            `).join('');
        }

        // Кнопка "В корзину"
        document.getElementById('add-to-cart-btn').addEventListener('click', async () => {
            await addToCart(currentProduct.id, currentQuantity);
        });

        // Кнопка избранного
        document.getElementById('favorite-btn').addEventListener('click', async () => {
            await toggleFavorite();
        });
    }

    // ────────────── СМЕНА ГЛАВНОГО ИЗОБРАЖЕНИЯ ──────────────
    window.changeMainImage = function(imagePath, thumbnail) {
        const resolved = window.resolveAssetUrl ? window.resolveAssetUrl(imagePath) : imagePath;
        document.getElementById('main-image').style.backgroundImage = `url('${resolved}')`;
        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
        thumbnail.classList.add('active');
    };

    // ────────────── ДОБАВИТЬ В КОРЗИНУ ──────────────
    async function addToCart(productId, quantity = 1) {
        if (!isLoggedIn()) {
            showToast('Войдите, чтобы добавить в корзину', 'error');
            window.location.href = '../other/login.html';
            return;
        }

        try {
            await api.addToCart(productId, quantity);
            showToast('Товар добавлен в корзину', 'success');
            updateCartCount();
        } catch (error) {
            showToast(error.message || 'Не удалось добавить в корзину', 'error');
        }
    }

    // ────────────── ОБНОВЛЕНИЕ СЧЁТЧИКА КОРЗИНЫ ──────────────
    async function updateCartCount() {
        if (!isLoggedIn()) {
            const cartCountSidebar = document.getElementById('cart-count-sidebar');
            if (cartCountSidebar) cartCountSidebar.textContent = '0';
            return;
        }

        try {
            const cart = await api.getCart();
            const cartCountSidebar = document.getElementById('cart-count-sidebar');
            if (cartCountSidebar) {
                cartCountSidebar.textContent = cart.totalItems || 0;
            }
        } catch (error) {
            console.error('Ошибка получения корзины:', error);
        }
    }

    // ────────────── ИЗБРАННОЕ ──────────────
    async function checkFavoriteStatus() {
        if (!isLoggedIn()) return;

        try {
            const isFav = await api.isFavorite(currentProduct.id);
            const btn = document.getElementById('favorite-btn');
            const icon = btn.querySelector('i');
            
            if (isFav) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            }
        } catch (error) {
            // Не авторизован
        }
    }

    async function toggleFavorite() {
        if (!isLoggedIn()) {
            showToast('Войдите, чтобы добавить в избранное', 'error');
            window.location.href = '../other/login.html';
            return;
        }

        try {
            const isFav = await api.isFavorite(currentProduct.id);
            const btn = document.getElementById('favorite-btn');
            const icon = btn.querySelector('i');

            if (isFav) {
                await api.removeFromFavorite(currentProduct.id);
                icon.classList.remove('fas');
                icon.classList.add('far');
                showToast('Удалено из избранного', 'info');
            } else {
                await api.addToFavorite(currentProduct.id);
                icon.classList.remove('far');
                icon.classList.add('fas');
                showToast('Добавлено в избранное', 'success');
            }
        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    // ────────────── ЗАГРУЗКА ОТЗЫВОВ ──────────────
    async function loadReviews() {
        try {
            const reviews = await api.getProductReviews(currentProduct.id);
            renderReviews(reviews);
        } catch (error) {
            console.error('Ошибка загрузки отзывов:', error);
        }
    }

    function renderReviews(reviews) {
        const container = document.getElementById('reviews-list');
        
        if (!reviews || reviews.length === 0) {
            container.innerHTML = '<p>Отзывов пока нет. Будьте первым!</p>';
            return;
        }

        container.innerHTML = reviews.map(review => `
            <div class="review-card">
                <div class="review-header">
                    <strong>${review.authorName || 'Аноним'}</strong>
                    <div class="review-rating">
                        ${'<i class="fas fa-star"></i>'.repeat(review.rating)}
                        ${'<i class="far fa-star"></i>'.repeat(5 - review.rating)}
                    </div>
                </div>
                <p>${review.text}</p>
                <small>${new Date(review.createdAt).toLocaleDateString('ru-RU')}</small>
            </div>
        `).join('');
    }

    // ────────────── РЕЙТИНГ В ФОРМЕ ОТЗЫВА ──────────────
    document.querySelectorAll('#star-rating i').forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.value);
            document.querySelectorAll('#star-rating i').forEach((s, index) => {
                s.classList.toggle('active', index < selectedRating);
            });
        });
    });

});
