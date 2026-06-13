export function initBurgerMenu() {
    const burgerIcon = document.getElementById('burgerIcon');
    const mobileNav = document.getElementById('mobileNav');

    if (!burgerIcon || !mobileNav) {
        console.error('Burger menu elements not found');
        return;
    }

    let overlay = document.querySelector('.overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);
    }

    function toggleMenu(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        burgerIcon.classList.toggle('active');
        mobileNav.classList.toggle('active');
        overlay.classList.toggle('active');

        if (mobileNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    burgerIcon.addEventListener('touchstart', toggleMenu);
    burgerIcon.addEventListener('click', toggleMenu);
    overlay.addEventListener('touchstart', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    const links = mobileNav.querySelectorAll('ul a');
    links.forEach(link => {
        link.addEventListener('touchstart', toggleMenu);
        link.addEventListener('click', toggleMenu);
    });
}

export function closeBurgerMenu() {
    const burgerIcon = document.getElementById('burgerIcon');
    const mobileNav = document.getElementById('mobileNav');
    const overlay = document.querySelector('.overlay');
    
    if (burgerIcon && burgerIcon.classList.contains('active')) {
        burgerIcon.classList.remove('active');
    }
    if (mobileNav && mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
    }
    if (overlay && overlay.classList.contains('active')) {
        overlay.classList.remove('active');
    }
    document.body.style.overflow = '';
}
