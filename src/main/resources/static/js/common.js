// js/common.js — Header, Footer и состояние пользователя

function resolveAssetUrl(path) {
    if (!path || typeof path !== 'string') return path;

    const trimmed = path.trim();
    if (!trimmed) return trimmed;

    if (/^(https?:)?\/\//i.test(trimmed) || /^data:/i.test(trimmed) || /^blob:/i.test(trimmed)) {
        return trimmed;
    }

    const backendOrigin = 'http://localhost:8080';
    if (trimmed.startsWith('/api/')) {
        return `${backendOrigin}${trimmed}`;
    }
    if (trimmed.startsWith('api/')) {
        return `${backendOrigin}/${trimmed}`;
    }

    return trimmed;
}

window.resolveAssetUrl = resolveAssetUrl;

window.toastConfig = {
    default: {
        maxMessageLength: 160,
        showDelayMs: 50,
        durationMs: 2800,
        removeDelayMs: 2800
    },
    admin: {
        maxMessageLength: 160,
        showDelayMs: 50,
        durationMs: 2800,
        removeDelayMs: 2800,
        top: '16px',
        right: '16px',
        maxWidth: '320px',
        padding: '10px 14px',
        borderRadius: '8px',
        fontSize: '14px',
        lineHeight: '1.35'
    }
};

function getToastSettings(isAdminPage) {
    const base = isAdminPage ? window.toastConfig.admin : window.toastConfig.default;
    const overrides = window.toastOverrides && typeof window.toastOverrides === 'object'
        ? window.toastOverrides
        : {};
    return { ...base, ...overrides };
}

const INCLUDE_VERSION = '3';

window.showToast = function showToast(message, type = 'success') {
    const isAdminPage = window.location.pathname.includes('/other/admin');
    const settings = getToastSettings(isAdminPage);
    const safeMessage = String(message ?? '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, settings.maxMessageLength);

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.textContent = safeMessage || 'Готово';

    if (isAdminPage) {
        toast.classList.add('fw-admin-toast');
        toast.style.position = 'fixed';
        toast.style.top = settings.top;
        toast.style.right = settings.right;
        toast.style.bottom = 'auto';
        toast.style.left = 'auto';
        toast.style.zIndex = '10000';
        toast.style.display = 'inline-block';
        toast.style.height = 'auto';
        toast.style.minHeight = '0';
        toast.style.maxHeight = 'none';
        toast.style.maxWidth = settings.maxWidth;
        toast.style.width = 'auto';
        toast.style.padding = settings.padding;
        toast.style.borderRadius = settings.borderRadius;
        toast.style.boxSizing = 'border-box';
        toast.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.2)';
        toast.style.color = '#fff';
        toast.style.fontWeight = '500';
        toast.style.fontSize = settings.fontSize;
        toast.style.lineHeight = settings.lineHeight;
        toast.style.whiteSpace = 'normal';
        toast.style.overflowWrap = 'anywhere';
        toast.style.wordBreak = 'break-word';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(120%)';
        toast.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    }

    document.body.appendChild(toast);

    setTimeout(() => {
        if (isAdminPage) {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        } else {
            toast.classList.add('show');
        }
    }, settings.showDelayMs);

    setTimeout(() => {
        if (isAdminPage) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(120%)';
        } else {
            toast.classList.remove('show');
        }
        setTimeout(() => toast.remove(), settings.removeDelayMs);
    }, settings.durationMs);
};

document.addEventListener('DOMContentLoaded', () => {
    // Показываем страницу после загрузки DOM
    document.body.classList.add('content-loaded');

    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    // Пути к includes зависят от текущей страницы
    const isOtherPage = window.location.pathname.includes('/other/');
    const basePath = isOtherPage ? '../' : '../';

    Promise.all([
        fetch(`${basePath}includes/header.html?v=${INCLUDE_VERSION}`).then(r => r.text()),
        fetch(`${basePath}includes/footer.html?v=${INCLUDE_VERSION}`).then(r => r.text())
    ])
    .then(([headerHtml, footerHtml]) => {
        headerPlaceholder.innerHTML = headerHtml;
        footerPlaceholder.innerHTML = footerHtml;

        const yearEl = document.getElementById('copyright-year');
        if (yearEl) {
            yearEl.textContent = String(new Date().getFullYear());
        }

        // === АВТОРИЗАЦИЯ ===
        updateAuthUI();

        // Обновляем счётчик корзины при загрузке
        updateCartCount();

        // Бургер-меню
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobile-menu');
        if (hamburger && mobileMenu) {
            hamburger.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
            });
        }

        // Кнопка наверх
        const scrollTopBtn = document.querySelector('.scroll-top');
        if (scrollTopBtn) {
            window.addEventListener('scroll', () => {
                scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
            });
            scrollTopBtn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
        }

        // Боковое меню пользователя
        const authBtn = document.getElementById('auth-btn');
        const userSidebar = document.getElementById('user-sidebar');
        const closeSidebarBtn = document.getElementById('close-user-sidebar');
        const logoutBtn = document.getElementById('user-logout');

        if (authBtn && userSidebar) {
            authBtn.addEventListener('click', () => {
                const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                if (isLoggedIn) {
                    userSidebar.classList.add('active');
                } else {
                    window.location.href = '../other/login.html';
                }
            });
        }

        if (closeSidebarBtn && userSidebar) {
            closeSidebarBtn.addEventListener('click', () => {
                userSidebar.classList.remove('active');
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Выйти из аккаунта?')) {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('jwtToken');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userRole');
                    window.location.href = '../pages/index.html';
                }
            });
        }
    })
    .catch(err => console.error('Ошибка загрузки header/footer:', err));
});

// Обновление UI авторизации
function updateAuthUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userName = localStorage.getItem('userName') || 'Гость';
    const userRole = localStorage.getItem('userRole') || 'USER';
    const authText = document.getElementById('auth-text');
    const userDisplayName = document.getElementById('user-display-name');
    const userAvatar = document.getElementById('user-avatar');

    if (authText) {
        authText.textContent = isLoggedIn ? userName : 'Войти';
    }

    if (userDisplayName) {
        userDisplayName.textContent = userName;
    }

    const adminMenuItem = document.getElementById('admin-panel-menu-item');
    const desktopAdminLink = document.getElementById('desktop-admin-link');
    const mobileAdminMenuItem = document.getElementById('mobile-admin-menu-item');
    const showAdminLinks = isLoggedIn && userRole === 'ADMIN';
    if (adminMenuItem) adminMenuItem.style.display = showAdminLinks ? '' : 'none';
    if (desktopAdminLink) desktopAdminLink.style.display = showAdminLinks ? '' : 'none';
    if (mobileAdminMenuItem) mobileAdminMenuItem.style.display = showAdminLinks ? '' : 'none';

    // Аватарка в зависимости от роли
    if (userAvatar) {
        if (userRole === 'ADMIN') {
            userAvatar.src = 'https://randomuser.me/api/portraits/men/1.jpg';
        } else {
            userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=e83e8c&color=fff`;
        }
    }
}

// Обновление счётчика корзины
async function updateCartCount() {
    const cartCountSidebar = document.getElementById('cart-count-sidebar');
    if (!cartCountSidebar) return;

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        cartCountSidebar.textContent = '0';
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/cart', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        });

        if (response.ok) {
            const cart = await response.json();
            cartCountSidebar.textContent = cart.totalItems || 0;
        } else {
            cartCountSidebar.textContent = '0';
        }
    } catch (error) {
        console.error('Ошибка получения корзины:', error);
        cartCountSidebar.textContent = '0';
    }
}
