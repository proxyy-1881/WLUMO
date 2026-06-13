export function animateCartButton(buttonElement) {
    if (!buttonElement) return;
    
    buttonElement.classList.add('btn-animation');
    buttonElement.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        buttonElement.style.transform = 'scale(1)';
    }, 150);
    
    setTimeout(() => {
        buttonElement.classList.remove('btn-animation');
    }, 300);
}

export function animateCardOnLoad(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 50);
}

export function addRippleEffect(element, touchEvent) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    let x, y;
    if (touchEvent && touchEvent.touches) {
        x = touchEvent.touches[0].clientX - rect.left - size / 2;
        y = touchEvent.touches[0].clientY - rect.top - size / 2;
    } else if (touchEvent && touchEvent.changedTouches) {
        x = touchEvent.changedTouches[0].clientX - rect.left - size / 2;
        y = touchEvent.changedTouches[0].clientY - rect.top - size / 2;
    } else {
        x = rect.width / 2 - size / 2;
        y = rect.height / 2 - size / 2;
    }

    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 10;
    `;
    
    const originalPosition = element.style.position;
    const originalOverflow = element.style.overflow;
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
        element.style.position = originalPosition;
        element.style.overflow = originalOverflow;
    }, 600);
}

export function addRippleStyles() {
    if (document.querySelector('#ripple-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
