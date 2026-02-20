// js/script.js — Главная страница (index.html)
// Использует api.js для работы с бэкендом

const TESTIMONIAL_ROTATION_MS = 6000;
const TESTIMONIAL_FETCH_LIMIT = 20;
let testimonialIntervalId = null;

// ────────────── ЗАГРУЗКА ПОПУЛЯРНЫХ ТОВАРОВ ──────────────
async function loadPopularProducts() {
    try {
        const hits = await api.getHits();
        renderPopularProducts(hits.slice(0, 3));
    } catch (error) {
        console.error('Ошибка загрузки популярных товаров:', error);
    }
}

function renderPopularProducts(products) {
    const container = document.querySelector('.popular .product-grid');
    if (!container) return;

    container.innerHTML = products.map(product => {
        const mainImageRaw = product.images?.find(img => img.isMain)?.imagePath || product.images?.[0]?.imagePath || '../images/placeholder.jpg';
        const mainImage = window.resolveAssetUrl ? window.resolveAssetUrl(mainImageRaw) : mainImageRaw;

        return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-img" style="background-image: url('${mainImage}')">
                ${product.oldPrice ? '<span class="product-badge">Скидка</span>' : ''}
                <button class="wishlist-btn"><i class="far fa-heart"></i></button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description || ''}</p>
                <div class="product-rating">
                    ${'<i class="fas fa-star"></i>'.repeat(Math.floor(product.ratingAverage || 5))}
                    <span>(${product.reviewsCount || 0})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${product.price.toLocaleString()} ₽</span>
                    ${product.oldPrice ? `<span class="old-price">${product.oldPrice.toLocaleString()} ₽</span>` : ''}
                </div>
                <button class="btn btn-small add-to-cart"
                        data-id="${product.id}"
                        data-name="${product.name}"
                        data-price="${product.price}"
                        data-image="${mainImage}">
                    В корзину
                </button>
            </div>
        </div>
    `;
    }).join('');

    attachProductCardListeners(container);

    if (window.applyCartState && window.__lastCartState) {
        window.applyCartState(window.__lastCartState);
    } else if (window.refreshCartState) {
        window.refreshCartState();
    }
}

// ────────────── ОБРАБОТЧИКИ ДЛЯ КАРТОЧЕК ТОВАРОВ ──────────────
function attachProductCardListeners(container) {
    // Переход на страницу товара
    container.querySelectorAll('.product-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart') || e.target.closest('.wishlist-btn')) return;
            const id = card.dataset.id;
            if (id) window.location.href = `product.html?id=${id}`;
        });
    });

    // Кнопки "В корзину"
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

    // Кнопки избранного
    container.querySelectorAll('.wishlist-btn i').forEach(async heart => {
        const card = heart.closest('.product-card');
        const addBtn = card?.querySelector('.add-to-cart');
        if (!addBtn) return;

        const productId = addBtn.dataset.id;
        
        // Проверка статуса избранного
        if (isLoggedIn()) {
            try {
                const isFav = await api.isFavorite(productId);
                if (isFav) {
                    heart.classList.add('fas', 'active');
                    heart.classList.remove('far');
                }
            } catch (e) {
                // Не авторизован или ошибка
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

// ────────────── ЗАГРУЗКА КАТЕГОРИЙ ──────────────
async function loadCategories() {
    try {
        const categories = await api.getCategories();
        renderCategories(categories.slice(0, 4));
    } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
    }
}

function renderCategories(categories) {
    const container = document.querySelector('.categories .category-grid');
    if (!container || categories.length === 0) return;

    container.innerHTML = categories.map(cat => `
        <a href="category.html?id=${cat.id}" class="category-card">
            <div class="category-img" style="background-image: url('${window.resolveAssetUrl ? window.resolveAssetUrl(cat.imagePath || '../images/placeholder.jpg') : (cat.imagePath || '../images/placeholder.jpg')}')"></div>
            <h3>${cat.name}</h3>
        </a>
    `).join('');
}

// ────────────── ЗАГРУЗКА ОТЗЫВОВ ──────────────
async function loadReviews() {
    try {
        const reviews = await api.getRecentReviews(TESTIMONIAL_FETCH_LIMIT);
        renderTestimonials(reviews);
        initTestimonialSlider();
    } catch (error) {
        console.error('Ошибка загрузки отзывов:', error);
    }
}

function getAvatarInitials(name) {
    const safeName = (name || '').trim();
    if (!safeName) return 'К';

    const parts = safeName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return safeName.slice(0, 2).toUpperCase();
}

function renderTestimonials(testimonials) {
    const container = document.querySelector('.testimonials .testimonial-slider');
    if (!container) return;

    if (!Array.isArray(testimonials) || testimonials.length === 0) {
        container.innerHTML = '<p class="loading">Пока нет отзывов</p>';
        return;
    }

    container.innerHTML = testimonials.map((t, index) => `
        <div class="testimonial-slide ${index === 0 ? 'active' : ''}">
            <div class="testimonial-content">
                <div class="rating">
                    ${'<i class="fas fa-star"></i>'.repeat(t.rating || 5)}
                    ${'<i class="far fa-star"></i>'.repeat(Math.max(0, 5 - (t.rating || 5)))}
                </div>
                <p class="testimonial-text">"${t.text || 'Без комментария'}"</p>
                <div class="client-info">
                    <div class="client-photo">${getAvatarInitials(t.authorName || 'Клиент')}</div>
                    <div class="client-details">
                        <h4>${t.authorName || 'Клиент'}</h4>
                        <p>${t.product?.name || 'Заказ'}</p>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// ────────────── СЛАЙДЕР ОТЗЫВОВ ──────────────
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    if (slides.length <= 1) return;

    if (testimonialIntervalId) {
        clearInterval(testimonialIntervalId);
    }

    let currentSlide = 0;
    testimonialIntervalId = setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, TESTIMONIAL_ROTATION_MS);
}

// ────────────── ИНИЦИАЛИЗАЦИЯ ──────────────
document.addEventListener('DOMContentLoaded', () => {
    loadPopularProducts();
    loadCategories();
    loadReviews();
    updateCartCount();

    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
