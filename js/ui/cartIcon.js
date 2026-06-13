import { openCartModal } from '../modules/modal.js';
import { updateCartCount } from '../modules/cart.js';

let cartIconElement = null;

export function createCartIcon() {
    if (cartIconElement) {
        cartIconElement.remove();
    }
    
    cartIconElement = document.createElement('div');
    cartIconElement.className = 'cart-icon';
    cartIconElement.innerHTML = `🛒 <span class="cart-count">0</span>`;
    
    const handleOpenCart = (e) => {
        e.preventDefault();
        cartIconElement.style.transform = 'scale(0.95)';
        setTimeout(() => {
            cartIconElement.style.transform = 'scale(1)';
        }, 150);
        openCartModal();
    };
    
    cartIconElement.addEventListener('touchstart', handleOpenCart);
    cartIconElement.addEventListener('click', handleOpenCart);
    
    document.body.appendChild(cartIconElement);
    updateCartCount();
}

export function updateCartIconCount() {
    if (cartIconElement) {
        const count = document.querySelector('.cart-count');
        if (count) {
            // Count already updated via updateCartCount
        }
    }
}
