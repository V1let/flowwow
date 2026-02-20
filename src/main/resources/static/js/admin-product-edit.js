// js/admin-product-edit.js — Редактирование товара

let productId = null;
let isEditMode = false;
let pendingCategoryId = null;

const CATALOG_CATEGORY_ORDER = ['romantic', 'wedding', 'spring', 'birthday'];
const CATALOG_CATEGORY_LABELS = {
    romantic: 'Романтические',
    wedding: 'Свадебные',
    spring: 'Весенние',
    birthday: 'День рождения'
};
const CATEGORY_ALIAS_SLUG = {
    romantic: ['romantic', 'романтические', 'romance'],
    wedding: ['wedding', 'свадебные'],
    spring: ['spring', 'весенние'],
    birthday: ['birthday', 'день-рождения', 'день рождения']
};

document.addEventListener('DOMContentLoaded', async () => {
    // Проверка прав администратора
    if (!isAdmin()) {
        window.location.href = '../other/login.html';
        return;
    }

    // Получаем ID товара из URL
    const urlParams = new URLSearchParams(window.location.search);
    productId = urlParams.get('id');
    isEditMode = !!productId;

    // Загрузка категорий
    await loadCategories();

    if (isEditMode) {
        document.getElementById('page-title').textContent = 'Редактирование товара';
        document.getElementById('delete-btn').style.display = 'block';
        await loadProduct(productId);
    } else {
        document.getElementById('page-title').textContent = 'Новый товар';
    }

    // Обработчик формы
    document.getElementById('product-form').addEventListener('submit', saveProduct);

    // Обработчик поля slug
    document.getElementById('name').addEventListener('input', () => {
        const name = document.getElementById('name').value;
        const slug = name.toLowerCase()
            .replace(/[^a-zа-яё0-9\s]/gi, '')
            .replace(/\s+/g, '-');
        document.getElementById('slug').value = slug;
    });

    // Обработчик изображений
    document.getElementById('images').addEventListener('input', renderImagePreview);

    // Загрузка файлов
    document.getElementById('upload-images-btn').addEventListener('click', uploadImages);
});

// ────────────── ЗАГРУЗКА КАТЕГОРИЙ ──────────────
async function loadCategories() {
    try {
        let categories = [];

        try {
            categories = await api.getAdminCategories();
        } catch {
            // ignore and try next source
        }

        if (!Array.isArray(categories) || categories.length === 0) {
            try {
                categories = await api.getCategories();
            } catch {
                // ignore and try next source
            }
        }

        // Последний fallback: берём категории из каталога товаров
        if (!Array.isArray(categories) || categories.length === 0) {
            try {
                const productsPage = await api.getProducts();
                const products = productsPage?.content || productsPage || [];
                const map = new Map();

                products.forEach(p => {
                    if (p?.category?.id && !map.has(p.category.id)) {
                        map.set(p.category.id, p.category);
                    }
                });
                categories = Array.from(map.values());
            } catch {
                categories = [];
            }
        }

        const categoriesBySlug = new Map(
            categories
                .filter(cat => cat && cat.slug)
                .map(cat => [String(cat.slug).toLowerCase(), cat])
        );

        let normalizedCategories = CATALOG_CATEGORY_ORDER
            .map(slug => {
                const aliases = CATEGORY_ALIAS_SLUG[slug] || [slug];
                return aliases.map(a => categoriesBySlug.get(a)).find(Boolean);
            })
            .filter(Boolean)
            .map(cat => ({
                id: cat.id,
                name: CATALOG_CATEGORY_LABELS[
                    CATALOG_CATEGORY_ORDER.find(key =>
                        (CATEGORY_ALIAS_SLUG[key] || []).includes(String(cat.slug).toLowerCase())
                    )
                ] || cat.name
            }));

        const usedIds = new Set(normalizedCategories.map(cat => cat.id));
        const extraCategories = categories
            .filter(cat => cat && cat.id && !usedIds.has(cat.id))
            .map(cat => ({ id: cat.id, name: cat.name }));

        if (normalizedCategories.length === 0) {
            normalizedCategories = extraCategories;
        } else {
            normalizedCategories = [...normalizedCategories, ...extraCategories];
        }

        const select = document.getElementById('categoryId');
        select.innerHTML = '<option value="">Выберите категорию</option>' +
            normalizedCategories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');

        if (pendingCategoryId) {
            select.value = String(pendingCategoryId);
        }
    } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
    }
}

// ────────────── ЗАГРУЗКА ТОВАРА ──────────────
async function loadProduct(id) {
    try {
        const product = await api.getProductById(id);
        
        document.getElementById('name').value = product.name;
        document.getElementById('slug').value = product.slug || '';
        document.getElementById('price').value = product.price;
        document.getElementById('oldPrice').value = product.oldPrice || '';
        pendingCategoryId = product.category?.id || '';
        document.getElementById('categoryId').value = pendingCategoryId ? String(pendingCategoryId) : '';
        document.getElementById('composition').value = product.composition || '';
        document.getElementById('description').value = product.description || '';
        document.getElementById('isHit').checked = product.isHit || false;
        document.getElementById('isNew').checked = product.isNew || false;

        // Изображения
        const images = product.images || [];
        const imageUrls = images.map(img => img.imagePath).join('\n');
        document.getElementById('images').value = imageUrls;
        renderImagePreview();

    } catch (error) {
        showToast('Не удалось загрузить товар', 'error');
        console.error(error);
    }
}

// ────────────── РЕНДЕР ПРЕВЬЮ ИЗОБРАЖЕНИЙ ──────────────
function renderImagePreview() {
    const container = document.getElementById('image-preview');
    const text = document.getElementById('images').value.trim();
    
    if (!text) {
        container.innerHTML = '';
        return;
    }

    const urls = text.split('\n').filter(url => url.trim());
    container.innerHTML = urls.map((url, index) => `
        <div class="image-preview-item ${index === 0 ? 'main' : ''}" 
             style="background-image: url('${window.resolveAssetUrl ? window.resolveAssetUrl(url.trim()) : url.trim()}')"
             title="${index === 0 ? 'Главное изображение' : ''}"></div>
    `).join('');
}

// ────────────── СОХРАНЕНИЕ ТОВАРА ──────────────
async function saveProduct(e) {
    e.preventDefault();

    const imagesText = document.getElementById('images').value.trim();
    const images = imagesText ? imagesText.split('\n').map(url => ({
        imagePath: url.trim(),
        isMain: false
    })) : [];

    // Первое изображение делаем главным
    if (images.length > 0) {
        images[0].isMain = true;
    }

    const productData = {
        name: document.getElementById('name').value.trim(),
        slug: document.getElementById('slug').value.trim(),
        price: parseFloat(document.getElementById('price').value),
        oldPrice: parseFloat(document.getElementById('oldPrice').value) || null,
        categoryId: parseInt(document.getElementById('categoryId').value),
        composition: document.getElementById('composition').value.trim(),
        description: document.getElementById('description').value.trim(),
        isHit: document.getElementById('isHit').checked,
        isNew: document.getElementById('isNew').checked,
        images: images
    };

    try {
        if (isEditMode) {
            await api.updateProduct(productId, productData);
            showToast('Товар обновлён', 'success');
        } else {
            const created = await api.createProduct(productData);
            showToast('Товар создан', 'success');

            // Переходим в режим редактирования без перезагрузки
            productId = created?.id || productId;
            if (productId) {
                isEditMode = true;
                document.getElementById('page-title').textContent = 'Редактирование товара';
                const deleteBtn = document.getElementById('delete-btn');
                if (deleteBtn) deleteBtn.style.display = 'block';
                const url = new URL(window.location.href);
                url.searchParams.set('id', productId);
                window.history.replaceState({}, '', url.toString());
            }
        }

        // Остаёмся на странице редактирования после сохранения
        
    } catch (error) {
        showToast(error.message || 'Не удалось сохранить товар', 'error');
    }
}

// ────────────── ЗАГРУЗКА ФАЙЛОВ ──────────────
async function uploadImages() {
    if (!isEditMode) {
        showToast('Сначала сохраните товар', 'error');
        return;
    }

    const input = document.getElementById('image-files');
    const files = Array.from(input.files || []);
    if (files.length === 0) {
        showToast('Выберите файлы', 'error');
        return;
    }

    const imagesField = document.getElementById('images');
    let isFirst = !imagesField.value.trim();

    for (const file of files) {
        try {
            const img = await api.uploadProductImage(productId, file, isFirst);
            imagesField.value = (imagesField.value.trim() ? imagesField.value.trim() + '\n' : '') + img.imagePath;
            isFirst = false;
        } catch (error) {
            showToast(error.message || 'Не удалось загрузить файл', 'error');
            return;
        }
    }

    input.value = '';
    renderImagePreview();
    showToast('Изображения загружены', 'success');
}

// ────────────── УДАЛЕНИЕ ТОВАРА ──────────────
window.deleteProduct = async function() {
    if (!confirm('Удалить этот товар?')) return;

    try {
        await api.deleteProduct(productId);
        showToast('Товар удалён', 'success');
        setTimeout(() => {
            window.location.href = 'admin.html#products';
        }, 1000);
    } catch (error) {
        showToast(error.message, 'error');
    }
};
