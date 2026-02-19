// js/catalog.js — Каталог товаров с интеграцией бэкенда
// Использует api.js для работы с сервером

document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.querySelector('.product-grid');
    const filterTabsContainer = document.querySelector('.filter-tabs');
    const sortSelect = document.getElementById('sort-select');
    const searchInput = document.getElementById('search-input');

    if (!productsContainer) return;

    let products = [];
    let categories = [];
    const CATEGORY_ALIASES = {
        romantic: ['romantic', 'романтические', 'романтическая', 'romance'],
        wedding: ['wedding', 'свадебные', 'свадебная', 'wedding-bouquets'],
        spring: ['spring', 'весенние', 'весенняя'],
        birthday: ['birthday', 'день-рождения', 'день рождения', 'праздничные']
    };

    // ────────────── ЗАГРУЗКА ТОВАРОВ ──────────────
    async function loadProducts() {
        try {
            productsContainer.innerHTML = '<p class="text-center">Загрузка...</p>';
            
            const data = await api.getProducts();
            products = data.content || data;
            filterAndSort();
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
            productsContainer.innerHTML = `<p class="error">Ошибка загрузки: ${error.message}</p>`;
        }
    }

    // ────────────── ЗАГРУЗКА КАТЕГОРИЙ ДЛЯ ФИЛЬТРА ──────────────
    async function loadCategoriesForFilter() {
        try {
            categories = await api.getCategories();
            renderCategoryTabs();
        } catch (error) {
            console.error('Ошибка загрузки категорий:', error);
        }
    }

    function renderCategoryTabs() {
        if (!filterTabsContainer) return;

        const ordered = [...categories].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        const tabsHtml = [
            `<a href="#" class="filter-tab active" data-category="all">Все букеты</a>`,
            ...ordered.map(cat => `<a href="#" class="filter-tab" data-category="${cat.id}">${cat.name}</a>`)
        ].join('');

        filterTabsContainer.innerHTML = tabsHtml;

        filterTabsContainer.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', e => {
                e.preventDefault();
                filterTabsContainer.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                filterAndSort();
            });
        });
    }

    // ────────────── РЕНДЕР ТОВАРОВ ──────────────
    function renderProducts(bouquetsList) {
        productsContainer.innerHTML = '';

        if (bouquetsList.length === 0) {
            productsContainer.innerHTML = '<p class="text-center">Товары не найдены</p>';
            return;
        }

        bouquetsList.forEach(b => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.cursor = 'pointer';

            const mainImageRaw = b.images?.find(img => img.isMain)?.imagePath || b.images?.[0]?.imagePath || '../images/placeholder.jpg';
            const mainImage = window.resolveAssetUrl ? window.resolveAssetUrl(mainImageRaw) : mainImageRaw;

            card.innerHTML = `
                <div class="product-img" style="background-image: url('${mainImage}')">
                    ${b.oldPrice ? `<span class="product-badge">Скидка</span>` : ''}
                    <button class="wishlist-btn"><i class="far fa-heart"></i></button>
                </div>
                <div class="product-info">
                    <h3>${b.name}</h3>
                    <p>${b.description || ''}</p>
                    <div class="product-rating">
                        ${'<i class="fas fa-star"></i>'.repeat(Math.floor(b.ratingAverage || 0))}
                        ${(b.ratingAverage || 0) % 1 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                        ${'<i class="far fa-star"></i>'.repeat(5 - Math.ceil(b.ratingAverage || 0))}
                        <span>(${b.reviewsCount || 0})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">${b.price.toLocaleString()} ₽</span>
                        ${b.oldPrice ? `<span class="old-price">${b.oldPrice.toLocaleString()} ₽</span>` : ''}
                    </div>
                    <button class="btn btn-small add-to-cart"
                            data-id="${b.id}"
                            data-name="${b.name}"
                            data-price="${b.price}"
                            data-image="${mainImage}">
                        В корзину
                    </button>
                </div>
            `;
            productsContainer.appendChild(card);

            card.addEventListener('click', (e) => {
                if (e.target.closest('.add-to-cart') || e.target.closest('.wishlist-btn')) return;
                window.location.href = `product.html?id=${b.id}`;
            });
        });

        attachEventListeners();
    }

    // ────────────── ФИЛЬТР И СОРТИРОВКА ──────────────
    function filterAndSort() {
        let list = [...products];

        // Фильтр по категории
        const activeTab = document.querySelector('.filter-tab.active');
        const cat = activeTab ? activeTab.dataset.category : 'all';
        
        if (cat !== 'all') {
            list = list.filter(b => {
                if (!b.category) return false;
                const categoryId = typeof b.category === 'object' ? b.category.id : b.category;
                const categoryName = typeof b.category === 'object' ? b.category.name : b.category;
                const categorySlug = typeof b.category === 'object' ? b.category.slug : '';
                const aliases = CATEGORY_ALIASES[cat] || [cat];
                const normalizedName = String(categoryName || '').toLowerCase();
                const normalizedSlug = String(categorySlug || '').toLowerCase();
                
                // Сравниваем по ID, имени, slug и известным алиасам из каталога
                return String(categoryId) === String(cat) ||
                    aliases.some(a => normalizedName.includes(a) || normalizedSlug.includes(a));
            });
        }

        // Поиск
        if (searchInput && searchInput.value.trim()) {
            const q = searchInput.value.trim().toLowerCase();
            list = list.filter(b =>
                b.name.toLowerCase().includes(q) ||
                (b.description && b.description.toLowerCase().includes(q)) ||
                (b.composition && b.composition.toLowerCase().includes(q))
            );
        }

        // Сортировка
        if (sortSelect) {
            const sort = sortSelect.value;
            if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
            if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
            if (sort === 'popular') list.sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0));
            if (sort === 'rating') list.sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0));
            if (sort === 'new') list = list.filter(b => b.isNew);
        }

        renderProducts(list);
    }

    // ────────────── ОБРАБОТЧИКИ СОБЫТИЙ ──────────────
    function attachEventListeners() {
        // Кнопки "В корзину"
        productsContainer.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const { id } = btn.dataset;
                await addToCart(id, 1);
            });
        });

        // Кнопки избранного
        productsContainer.querySelectorAll('.wishlist-btn i').forEach(async heart => {
            const card = heart.closest('.product-card');
            const addBtn = card?.querySelector('.add-to-cart');
            if (!addBtn) return;

            const productId = addBtn.dataset.id;
            
            // Проверка статуса избранного при загрузке
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

    // ────────────── ИНИЦИАЛИЗАЦИЯ ──────────────
    // Загрузка товаров и категорий
    loadProducts();
    loadCategoriesForFilter();
    updateCartCount();

    if (sortSelect) sortSelect.addEventListener('change', filterAndSort);
    if (searchInput) searchInput.addEventListener('input', filterAndSort);
});
