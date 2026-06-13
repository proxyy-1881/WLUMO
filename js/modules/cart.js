import { getCart, setCart } from '../utils/storage.js';
import { showNotification } from '../utils/notifications.js';
import { animateCartButton, addRippleEffect } from '../utils/animations.js';
import { products } from '../data/products.js';

let cart = getCart();
let updateCartUICallback = null;

export function setUpdateCartCallback(callback) {
    updateCartUICallback = callback;
}

export function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        if (el) el.textContent = count;
    });
    if (updateCartUICallback) {
        updateCartUICallback();
    }
}

export function addToCart(productId, buttonElement = null) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    if (buttonElement) {
        animateCartButton(buttonElement);
    }

    setCart(cart);
    updateCartCount();
    showNotification(`${product.name} добавлен в корзину!`);
}

export function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        const productName = cart[itemIndex].name;
        cart.splice(itemIndex, 1);
        setCart(cart);
        updateCartCount();
        showNotification(`${productName} удален из корзины`);
        return true;
    }
    return false;
}

export function changeQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart(cart);
            updateCartCount();
        }
        return true;
    }
    return false;
}

export function getTotalPrice() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

export function getCartItems() {
    return [...cart];
}

export function checkout() {
    if (cart.length === 0) {
        showNotification('Корзина пуста!');
        return false;
    }

    const total = getTotalPrice();
    showNotification(`Заказ оформлен на сумму ${total} ₽. Спасибо за покупку!`);
    cart = [];
    setCart(cart);
    updateCartCount();
    return true;
}

export function refreshCart() {
    cart = getCart();
    updateCartCount();
}

export function bindCartButtons() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        const handleAdd = (e) => {
            e.stopPropagation();
            e.preventDefault();
            const id = parseInt(newBtn.dataset.id);
            addRippleEffect(newBtn, e);
            addToCart(id, newBtn);
        };
        
        newBtn.addEventListener('touchstart', handleAdd);
        newBtn.addEventListener('click', handleAdd);
    });
}
