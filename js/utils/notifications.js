let notificationElement = null;

function createNotificationStyles() {
    if (document.querySelector('#notification-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'notification-styles';
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
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            font-weight: 500;
        }
        .notification.show {
            transform: translateX(0);
        }
        @media (max-width: 768px) {
            .notification {
                bottom: 20px;
                right: 20px;
                left: 20px;
                transform: translateY(100px);
                text-align: center;
            }
            .notification.show {
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

export function showNotification(message) {
    createNotificationStyles();
    
    if (!notificationElement) {
        notificationElement = document.createElement('div');
        notificationElement.className = 'notification';
        document.body.appendChild(notificationElement);
    }

    notificationElement.textContent = message;
    notificationElement.classList.add('show');

    setTimeout(() => {
        notificationElement.classList.remove('show');
    }, 2000);
}
