import { loadCart } from './utils/storage.js';
import { addRippleStyles } from './utils/animations.js';
import { renderProducts } from './modules/products.js';
import { createCartIcon } from './ui/cartIcon.js';
import { initBurgerMenu } from './ui/burger.js';
import { updateCartCount, refreshCart, setUpdateCartCallback } from './modules/cart.js';
import { closeCartModal } from './modules/modal.js';

function initCartCloseOnOutsideTap() {
    document.addEventListener('touchstart', (e) => {
        const modal = document.querySelector('.cart-modal');
        const cartIcon = document.querySelector('.cart-icon');

        if (modal && modal.classList.contains('open')) {
            if (!modal.contains(e.target) && !cartIcon?.contains(e.target)) {
                closeCartModal();
            }
        }
    });
}

function handleResize() {
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            const gallery = document.querySelector('.products-gallery');
            if (gallery) {
                gallery.style.display = 'grid';
                gallery.style.opacity = '0.99';
                setTimeout(() => {
                    gallery.style.opacity = '1';
                }, 10);
            }
        }, 150);
    });
}

function initShop() {
    loadCart();
    addRippleStyles();
    renderProducts();
    createCartIcon();
    initBurgerMenu();
    updateCartCount();
    initCartCloseOnOutsideTap();
    handleResize();
    
    setUpdateCartCallback(() => {
        updateCartCount();
    });
}

document.addEventListener('DOMContentLoaded', initShop);
