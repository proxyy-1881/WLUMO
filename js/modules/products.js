import { products } from '../data/products.js';
import { animateCardOnLoad, addRippleEffect } from '../utils/animations.js';
import { openProductModal } from './modal.js';
import { bindCartButtons } from './cart.js';

let productsRendered = false;

export function renderProducts() {
    const existingGallery = document.querySelector('.products-gallery');
    if (existingGallery) {
        existingGallery.remove();
    }
    
    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'products-gallery';

    const productsHtml = products.map((product, index) => `
        <div class="product-card" data-index="${index}" data-id="${product.id}">
            <div class="product-image">
                <div class="image-placeholder">WLUMO</div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${escapeHtml(product.name)}</h3>
                <div class="product-footer">
                    <span class="product-price">${product.price} ₽</span>
                    <button class="add-to-cart-btn" data-id="${product.id}">
                        В корзину
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    galleryContainer.innerHTML = productsHtml;

    const promoSection = document.querySelector('.promo-section');
    if (promoSection) {
        promoSection.insertAdjacentElement('afterend', galleryContainer);
    } else {
        document.querySelector('.products-section').appendChild(galleryContainer);
    }

    bindProductCardEvents();
    bindCartButtons();
    productsRendered = true;
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function bindProductCardEvents() {
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach((card, index) => {
        animateCardOnLoad(card);
        
        const handleCardTap = (e) => {
            if (!e.target.closest('.add-to-cart-btn')) {
                e.preventDefault();
                const id = parseInt(card.dataset.id);
                openProductModal(id);
            }
        };
        
        card.addEventListener('touchstart', handleCardTap);
        card.addEventListener('click', handleCardTap);
    });
}

export function isProductsRendered() {
    return productsRendered;
}
