let cart = [];

export function loadCart() {
    const saved = localStorage.getItem('wlumo_cart');
    cart = saved ? JSON.parse(saved) : [];
    return cart;
}

export function saveCart() {
    localStorage.setItem('wlumo_cart', JSON.stringify(cart));
}

export function getCart() {
    return cart;
}

export function setCart(newCart) {
    cart = newCart;
    saveCart();
}

export function clearCart() {
    cart = [];
    saveCart();
}
