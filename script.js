const products = [
    {
        id: 1,
        name: "работа WLUMO",
        price: 2490,
        category: "искуство",
        description: "характеристика картины",
        fullDescription: "картина"
    },
    {
        id: 2,
        name: "работа WLUMO",
        price: 4990,
        category: "искуство",
        description: "характеристики картины",
        fullDescription: "картина"
    },
    {
        id: 3,
        name: "работа WLUMO",
        price: 1490,
        category: "искуство",
        description: "характеристики картины",
        fullDescription: "картина"
    },
    {
        id: 4,
        name: "работа WLUMO",
        price: 990,
        category: "искуство",
        description: "характеристики картины",
        fullDescription: "картина"
    },
    {
        id: 5,
        name: "работа WLUMO",
        price: 2990,
        category: "искуство",
        description: "характеристики картины",
        fullDescription: "картина"
    },
    {
        id: 6,
        name: "работа WLUMO",
        price: 490,
        category: "искуство",
        description: "характеристики картины",
        fullDescription: "картина"
    }
];

let cart = JSON.parse(localStorage.getItem('wlumo_cart')) || [];

function saveCart() {
    localStorage.setItem('wlumo_cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        if (el) el.textContent = count;
    });
}

function showNotification(message) {
    let notification = document.querySelector('.notification');

    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);

        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: linear-gradient(135deg, #ea00ff, #4a0080);
                color: white;
                padding: 15px 25px;
                border-radius: 12px;
                font-size: 16px;
                z-index: 1000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            }
            .notification.show {
                transform: translateX(0);
            }
            @media (max-width: 768px) {
                .notification {
                    bottom: 20px;
                    right: 20px;
                    padding: 12px 20px;
                    font-size: 14px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
        animateCartButton(productId, 'added');
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
        animateCartButton(productId, 'added');
    }

    saveCart();
    updateCartCount();
    showNotification(`${product.name} добавлен в корзину!`);
}

function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        const productName = cart[itemIndex].name;
        cart.splice(itemIndex, 1);
        saveCart();
        updateCartCount();
        renderCartModal();
        showNotification(`${productName} удален из корзины`);
    }
}

function changeQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartCount();
            renderCartModal();
        }
    }
}

function getTotalPrice() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function animateCartButton(productId, action) {
    const button = document.querySelector(`.add-to-cart-btn[data-id="${productId}"]`);
    if (button) {
        button.classList.add('btn-animation');
        if (action === 'added') {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        }
        setTimeout(() => {
            button.classList.remove('btn-animation');
        }, 300);
    }
}

function animateCardOnLoad(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 50);
}

function addRippleEffect(element, event) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    let x, y;

    if (event.touches) {
        x = event.touches[0].clientX - rect.left - size / 2;
        y = event.touches[0].clientY - rect.top - size / 2;
    } else {
        x = event.clientX - rect.left - size / 2;
        y = event.clientY - rect.top - size / 2;
    }

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let modal = document.querySelector('.product-modal');

    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'product-modal';
        document.body.appendChild(modal);

        const style = document.createElement('style');
        style.textContent = `
            .product-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
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
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
    });

    const addBtn = modal.querySelector('.modal-add-btn');
    addBtn.addEventListener('click', (e) => {
        const id = parseInt(addBtn.dataset.id);
        addToCart(id);
        modal.classList.remove('open');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
        }
    });
}

function renderCartModal() {
    let modal = document.querySelector('.cart-modal');

    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'cart-modal';
        document.body.appendChild(modal);

        const style = document.createElement('style');
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
                padding: 0 10px;
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
                animation: slideIn 0.3s ease;
            }
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(50px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            .cart-item-info {
                flex: 1;
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
                width: 30px;
                height: 30px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 18px;
                transition: transform 0.2s;
            }
            .cart-item-controls button:hover {
                transform: scale(1.1);
            }
            .cart-item-quantity {
                min-width: 30px;
                text-align: center;
            }
            .cart-item-total {
                min-width: 80px;
                text-align: right;
                color: #ea00ff;
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
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .checkout-btn:hover {
                transform: scale(1.02);
                box-shadow: 0 5px 20px rgba(234,0,255,0.4);
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
            }
        `;
        document.head.appendChild(style);
    }

    const cartItemsHtml = cart.length === 0
        ? '<div class="empty-cart">Корзина пуста</div>'
        : cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price} ₽</div>
                </div>
                <div class="cart-item-controls">
                    <button onclick="changeQuantity(${item.id}, -1)">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
                <div class="cart-item-total">${item.price * item.quantity} ₽</div>
            </div>
        `).join('');

    modal.innerHTML = `
        <div class="cart-header">
            <h3>Корзина</h3>
            <button class="close-cart" onclick="closeCart()">×</button>
        </div>
        <div class="cart-items">
            ${cartItemsHtml}
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <span>Итого:</span>
                <span>${getTotalPrice()} ₽</span>
            </div>
            <button class="checkout-btn" onclick="checkout()">Оформить заказ</button>
        </div>
    `;
}

function openCart() {
    renderCartModal();
    const modal = document.querySelector('.cart-modal');
    modal.classList.add('open');
}

function closeCart() {
    const modal = document.querySelector('.cart-modal');
    if (modal) {
        modal.classList.remove('open');
    }
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Корзина пуста!');
        return;
    }

    const total = getTotalPrice();
    showNotification(`Заказ оформлен на сумму ${total} ₽. Спасибо за покупку!`);
    cart = [];
    saveCart();
    updateCartCount();
    closeCart();
    renderCartModal();
}

function renderProducts() {
    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'products-gallery';

    const productsHtml = products.map((product, index) => `
        <div class="product-card" data-index="${index}" data-id="${product.id}">
            <div class="product-image">
                <div class="image-placeholder">WLUMO</div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${product.price} ₽</span>
                    <button class="add-to-cart-btn" data-id="${product.id}">
                        <span>В корзину</span>
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
        document.body.appendChild(galleryContainer);
    }

    const style = document.createElement('style');
    style.textContent = `
        .products-gallery {
            display: grid;
            gap: 25px;
            padding: 40px 20px;
            max-width: 1600px;
            margin: 0 auto;
            position: relative;
            z-index: 1;
        }
        
        @media (min-width: 1400px) {
            .products-gallery {
                grid-template-columns: repeat(3, 1fr);
                gap: 35px;
                padding: 40px 40px;
            }
        }
        
        @media (min-width: 1200px) and (max-width: 1399px) {
            .products-gallery {
                grid-template-columns: repeat(2, 1fr);
                gap: 35px;
                padding: 40px 40px;
            }
        }
        
        @media (min-width: 900px) and (max-width: 1199px) {
            .products-gallery {
                grid-template-columns: repeat(2, 1fr);
                gap: 30px;
                padding: 40px 30px;
            }
        }
        
        @media (min-width: 600px) and (max-width: 899px) {
            .products-gallery {
                grid-template-columns: repeat(2, 1fr);
                gap: 25px;
                padding: 30px 20px;
            }
        }
        
        @media (max-width: 599px) {
            .products-gallery {
                grid-template-columns: 1fr;
                gap: 20px;
                padding: 20px 15px;
            }
        }
        
        .product-card {
            background: rgba(26, 26, 26, 0.6);
            border-radius: 20px;
            overflow: hidden;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(234, 0, 255, 0.2);
            position: relative;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            width: 100%;
        }
        
        .product-card::before {
            content: '';
            position: absolute;
            inset: -2px;
            background: linear-gradient(135deg, #ea00ff, #4a0080, #ea00ff);
            border-radius: 22px;
            z-index: -1;
            opacity: 0;
            transition: opacity 0.4s ease;
        }
        
        .product-card:hover::before {
            opacity: 1;
            animation: rotateGlow 2s linear infinite;
        }
        
        @keyframes rotateGlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .product-card:active {
            transform: scale(0.98);
        }
        
        .product-image {
            height: 280px;
            background: linear-gradient(135deg, #1a0033, #2a0044);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        
        .product-image::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle at 30% 40%, rgba(234, 0, 255, 0.3), transparent 70%);
            animation: rotate 10s linear infinite;
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .image-placeholder {
            font-size: 56px;
            font-weight: bold;
            background: linear-gradient(135deg, #ea00ff, #4a0080);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            position: relative;
            z-index: 1;
            text-shadow: 0 0 30px rgba(234, 0, 255, 0.5);
            animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        
        .product-info {
            padding: 20px;
        }
        
        .product-name {
            font-size: 20px;
            font-weight: 600;
            color: white;
            margin-bottom: 8px;
            transition: color 0.3s;
        }
        
        .product-card:hover .product-name {
            background: linear-gradient(135deg, #ea00ff, #fff);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        
        .product-category {
            font-size: 13px;
            color: #ea00ff;
            margin-bottom: 10px;
            display: inline-block;
            padding: 4px 12px;
            background: rgba(234, 0, 255, 0.1);
            border-radius: 20px;
        }
        
        .product-description {
            font-size: 14px;
            color: #ccc;
            line-height: 1.5;
            margin-bottom: 20px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .product-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .product-price {
            font-size: 24px;
            font-weight: bold;
            background: linear-gradient(135deg, #ea00ff, #4a0080);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            transition: transform 0.3s;
        }
        
        .product-card:hover .product-price {
            transform: scale(1.05);
        }
        
        .add-to-cart-btn {
            background: linear-gradient(135deg, #ea00ff, #4a0080);
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            color: white;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
        }
        
        .add-to-cart-btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(255,255,255,0.8), transparent);
            transform: translate(-50%, -50%);
            transition: width 0.5s, height 0.5s;
            border-radius: 50%;
        }
        
        .add-to-cart-btn:hover::before {
            width: 300px;
            height: 300px;
        }
        
        .add-to-cart-btn:active {
            transform: scale(0.95);
        }
        
        .btn-animation {
            animation: buttonPulse 0.3s ease;
        }
        
        @keyframes buttonPulse {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(0.9);
                box-shadow: 0 0 20px rgba(234,0,255,0.8);
            }
            100% {
                transform: scale(1);
            }
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @media (max-width: 768px) {
            .product-image {
                height: 220px;
            }
            .image-placeholder {
                font-size: 40px;
            }
            .product-info {
                padding: 15px;
            }
            .product-name {
                font-size: 18px;
            }
            .product-price {
                font-size: 20px;
            }
            .add-to-cart-btn {
                padding: 8px 16px;
                font-size: 13px;
            }
            .product-description {
                font-size: 13px;
            }
        }
        
        @media (max-width: 480px) {
            .product-image {
                height: 200px;
            }
            .image-placeholder {
                font-size: 36px;
            }
            .product-info {
                padding: 12px;
            }
            .product-name {
                font-size: 16px;
            }
            .product-price {
                font-size: 18px;
            }
            .add-to-cart-btn {
                padding: 6px 14px;
                font-size: 12px;
            }
        }
        
        @media (hover: hover) and (pointer: fine) {
            .product-card {
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            
            .product-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 15px 35px rgba(234, 0, 255, 0.3);
            }
        }
        
        @media (hover: none) and (pointer: coarse) {
            .product-card:active {
                transform: scale(0.98);
            }
        }
    `;
    document.head.appendChild(style);

    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        animateCardOnLoad(card);

        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('add-to-cart-btn')) {
                const id = parseInt(card.dataset.id);
                openProductModal(id);
            }
        });
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            addRippleEffect(btn, e);
            addToCart(id);
        });

        btn.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            addRippleEffect(btn, e);
            addToCart(id);
        });
    });
}

function addCursorGlow() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        document.body.appendChild(glow);

        const style = document.createElement('style');
        style.textContent = `
            .cursor-glow {
                position: fixed;
                width: 600px;
                height: 600px;
                background: radial-gradient(circle, rgba(234,0,255,0.08) 0%, rgba(234,0,255,0.04) 30%, rgba(74,0,128,0.02) 60%, transparent 85%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: 0;
                filter: blur(15px);
                transition: opacity 0.2s ease;
                will-change: left, top;
            }
        `;
        document.head.appendChild(style);

        document.addEventListener('mousemove', (e) => {
            glow.style.left = (e.clientX - 300) + 'px';
            glow.style.top = (e.clientY - 300) + 'px';
            glow.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            glow.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            glow.style.opacity = '1';
        });
    }
}

function createCartIcon() {
    const cartIcon = document.createElement('div');
    cartIcon.className = 'cart-icon';
    cartIcon.innerHTML = `<span class="cart-count">0</span>`;
    cartIcon.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ea00ff, #4a0080);
        padding: 12px 18px;
        border-radius: 50px;
        color: white;
        font-size: 20px;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        cartIcon.addEventListener('mouseenter', () => {
            cartIcon.style.transform = 'scale(1.1)';
            cartIcon.style.boxShadow = '0 8px 25px rgba(234,0,255,0.5)';
        });

        cartIcon.addEventListener('mouseleave', () => {
            cartIcon.style.transform = 'scale(1)';
            cartIcon.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        });
    }

    cartIcon.addEventListener('click', () => {
        cartIcon.style.transform = 'scale(0.95)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 150);
        openCart();
    });

    cartIcon.addEventListener('touchstart', () => {
        cartIcon.style.transform = 'scale(0.95)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 150);
        openCart();
    });

    document.body.appendChild(cartIcon);
}

document.addEventListener('click', (e) => {
    const modal = document.querySelector('.cart-modal');
    const cartIcon = document.querySelector('.cart-icon');

    if (modal && modal.classList.contains('open')) {
        if (!modal.contains(e.target) && !cartIcon?.contains(e.target)) {
            closeCart();
        }
    }
});

function initBurgerMenu() {
    const burgerIcon = document.getElementById('burgerIcon');
    const mobileNav = document.getElementById('mobileNav');

    if (!burgerIcon || !mobileNav) {
        console.log('Элементы бургер меню не найдены');
        return;
    }

    let overlay = document.querySelector('.overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);
    }

    function toggleMenu() {
        burgerIcon.classList.toggle('active');
        mobileNav.classList.toggle('active');
        overlay.classList.toggle('active');

        if (mobileNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    burgerIcon.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    const links = mobileNav.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
}

// Функция для отслеживания изменения размера экрана (переключение режимов в браузере)
function handleResize() {
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            // Принудительная перерисовка галереи при смене режима
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
    renderProducts();
    createCartIcon();
    updateCartCount();
    addCursorGlow();
    initBurgerMenu();
    handleResize(); // Добавляем отслеживание изменения размера
}

document.addEventListener('DOMContentLoaded', function () {
    initShop();
});