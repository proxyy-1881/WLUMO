import { products } from '../data/products.js';
import { addToCart, refreshCart } from './cart.js';
import { addRippleEffect } from '../utils/animations.js';
import { getCartItems, getTotalPrice, changeQuantity, removeFromCart, checkout } from './cart.js';

let currentCartModal = null;

function addModalStyles() {
    if (document.querySelector('#modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .product-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            backdrop-filter: blur(10px);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        .product-modal.open {
            opacity: 1;
            visibility: visible;
        }
        .product-modal-content {
            background: linear-gradient(135deg, #1a0033, #0a0a0a);
            border-radius: 30px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            padding: 30px;
            position: relative;
            border: 1px solid rgba(234,0,255,0.3);
            transform: scale(0.7);
            transition: transform 0.3s ease;
        }
        .product-modal.open .product-modal-content {
            transform: scale(1);
        }
        .modal-close {
            position: absolute;
            top: 15px;
            right: 20px;
            background: none;
            border: none;
            color: white;
            font-size: 32px;
            cursor: pointer;
            padding: 10px;
            z-index: 1;
        }
        .modal-image {
            width: 100%;
            height: 200px;
            background: linear-gradient(135deg, #1a0033, #2a0044);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 20px;
            margin-bottom: 20px;
        }
        .modal-placeholder {
            font-size: 64px;
            font-weight: bold;
            background: linear-gradient(135deg, #ea00ff, #4a0080);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        .modal-title {
            font-size: 28px;
            color: white;
            margin-bottom: 10px;
        }
        .modal-category {
            color: #ea00ff;
            font-size: 14px;
            margin-bottom: 15px;
        }
        .modal-description {
            color: #ccc;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .modal-price {
            font-size: 32px;
            font-weight: bold;
            background: linear-gradient(135deg, #ea00ff, #4a0080);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            margin-bottom: 20px;
        }
        .modal-add-btn {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #ea00ff, #4a0080);
            border: none;
            color: white;
            font-size: 18px;
            border-radius: 12px;
            cursor: pointer;
        }
        .modal-add-btn:active {
            transform: scale(0.98);
        }
        @media (max-width: 768px) {
            .product-modal-content {
                padding: 20px;
                width: 95%;
            }
            .modal-title {
                font-size: 22px;
            }
            .modal-price {
                font-size: 26px;
            }
            .modal-image {
                height: 160px;
            }
            .modal-placeholder {
                font-size: 48px;
            }
        }
    `;
    document.head.appendChild(style);
}

export function openProductModal(productId) {
    addModalStyles();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let modal = document.querySelector('.product-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'product-modal';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="product-modal-content">
            <button class="modal-close">&times;</button>
            <div class="modal-image">
                <div class="modal-placeholder">WLUMO</div>
            </div>
            <h2 class="modal-title">${product.name}</h2>
            <p class="modal-category">${product.category}</p>
            <p class="modal-description">${product.fullDescription || product.description}</p>
            <div class="modal-price">${product.price} ₽</div>
            <button class="modal-add-btn" data-id="${product.id}">Добавить в корзину</button>
        </div>
    `;

    modal.classList.add('open');

    const closeBtn = modal.querySelector('.modal-close');
    const handleClose = () => modal.classList.remove('open');
    closeBtn.addEventListener('click', handleClose);
    closeBtn.addEventListener('touchstart', handleClose);

    const addBtn = modal.querySelector('.modal-add-btn');
    const handleAdd = (e) => {
        e.preventDefault();
        const id = parseInt(addBtn.dataset.id);
        addRippleEffect(addBtn, e);
        addToCart(id);
        modal.classList.remove('open');
    };
    addBtn.addEventListener('click', handleAdd);
    addBtn.addEventListener('touchstart', handleAdd);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
        }
    });
}

function renderCartModalContent(modal) {
    const cartItems = getCartItems();
    const total = getTotalPrice();
    
    const cartItemsHtml = cartItems.length === 0
        ? '<div class="empty-cart">Корзина пуста</div>'
        : cartItems.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price} ₽</div>
                </div>
                <div class="cart-item-controls">
                    <button class="cart-decr" data-id="${item.id}">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="cart-incr" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-total">${item.price * item.quantity} ₽</div>
            </div>
        `).join('');

    modal.innerHTML = `
        <div class="cart-header">
            <h3>Корзина</h3>
            <button class="close-cart">&times;</button>
        </div>
        <div class="cart-items">
            ${cartItemsHtml}
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <span>Итого:</span>
                <span>${total} ₽</span>
            </div>
            <button class="checkout-btn">Оформить заказ</button>
        </div>
    `;

    const closeBtn = modal.querySelector('.close-cart');
    const handleClose = () => closeCartModal();
    closeBtn.addEventListener('click', handleClose);
    closeBtn.addEventListener('touchstart', handleClose);

    const checkoutBtn = modal.querySelector('.checkout-btn');
    const handleCheckout = () => {
        if (checkout()) {
            closeCartModal();
            refreshCart();
        }
    };
    checkoutBtn.addEventListener('click', handleCheckout);
    checkoutBtn.addEventListener('touchstart', handleCheckout);

    modal.querySelectorAll('.cart-decr').forEach(btn => {
        const handleDecr = () => {
            const id = parseInt(btn.dataset.id);
            changeQuantity(id, -1);
            refreshCart();
            renderCartModalContent(modal);
        };
        btn.addEventListener('click', handleDecr);
        btn.addEventListener('touchstart', handleDecr);
    });

    modal.querySelectorAll('.cart-incr').forEach(btn => {
        const handleIncr = () => {
            const id = parseInt(btn.dataset.id);
            changeQuantity(id, 1);
            refreshCart();
            renderCartModalContent(modal);
        };
        btn.addEventListener('click', handleIncr);
        btn.addEventListener('touchstart', handleIncr);
    });
}

function addCartModalStyles() {
    if (document.querySelector('#cart-modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'cart-modal-styles';
    style.textContent = `
        .cart-modal {
            position: fixed;
            top: 0;
            right: -500px;
            width: 450px;
            max-width: 90%;
            height: 100vh;
            background: #1a1a1a;
            box-shadow: -5px 0 30px rgba(0,0,0,0.5);
            z-index: 1001;
            transition: right 0.3s ease;
            display: flex;
            flex-direction: column;
            color: white;
        }
        .cart-modal.open {
            right: 0;
        }
        .cart-header {
            padding: 20px;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .cart-header h3 {
            margin: 0;
            font-size: 24px;
        }
        .close-cart {
            background: none;
            border: none;
            color: white;
            font-size: 30px;
            cursor: pointer;
            padding: 0;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .close-cart:active {
            transform: scale(0.95);
        }
        .cart-items {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }
        .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #333;
            flex-wrap: wrap;
            gap: 10px;
        }
        .cart-item-info {
            flex: 1;
            min-width: 120px;
        }
        .cart-item-name {
            font-size: 16px;
            margin-bottom: 5px;
        }
        .cart-item-price {
            color: #ea00ff;
            font-size: 14px;
        }
        .cart-item-controls {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .cart-item-controls button {
            background: linear-gradient(135deg, #ea00ff, #4a0080);
            border: none;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 20px;
        }
        .cart-item-controls button:active {
            transform: scale(0.95);
        }
        .cart-item-quantity {
            min-width: 30px;
            text-align: center;
            font-size: 16px;
        }
        .cart-item-total {
            min-width: 80px;
            text-align: right;
            color: #ea00ff;
            font-weight: bold;
        }
        .cart-footer {
            padding: 20px;
            border-top: 1px solid #333;
        }
        .cart-total {
            display: flex;
            justify-content: space-between;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .checkout-btn {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #ea00ff, #4a0080);
            border: none;
            color: white;
            font-size: 18px;
            border-radius: 12px;
            cursor: pointer;
        }
        .checkout-btn:active {
            transform: scale(0.98);
        }
        .empty-cart {
            text-align: center;
            padding: 40px;
            color: #888;
        }
        @media (max-width: 768px) {
            .cart-modal {
                width: 100%;
                right: -100%;
            }
            .cart-header {
                padding: 15px 20px;
            }
            .cart-header h3 {
                font-size: 20px;
            }
            .cart-item-name {
                font-size: 14px;
            }
            .cart-total {
                font-size: 18px;
            }
            .checkout-btn {
                font-size: 16px;
                padding: 12px;
            }
            .cart-item-controls button {
                width: 44px;
                height: 44px;
            }
            .close-cart {
                width: 44px;
                height: 44px;
                font-size: 32px;
            }
        }
    `;
    document.head.appendChild(style);
}

export function openCartModal() {
    addCartModalStyles();
    
    if (currentCartModal) {
        currentCartModal.remove();
    }
    
    currentCartModal = document.createElement('div');
    currentCartModal.className = 'cart-modal';
    document.body.appendChild(currentCartModal);
    
    renderCartModalContent(currentCartModal);
    setTimeout(() => {
        currentCartModal.classList.add('open');
    }, 10);
}

export function closeCartModal() {
    if (currentCartModal) {
        currentCartModal.classList.remove('open');
        setTimeout(() => {
            if (currentCartModal) {
                currentCartModal.remove();
                currentCartModal = null;
            }
        }, 300);
    }
}
