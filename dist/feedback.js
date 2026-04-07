// Toast notifications
export function toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.textContent = message;
    container.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => {
        t.classList.remove('show');
        setTimeout(() => t.remove(), 300);
    }, 3000);
}
// Custom confirm dialog
export function confirm(message) {
    return new Promise(resolve => {
        const overlay = document.getElementById('confirm-overlay');
        const msg = document.getElementById('confirm-message');
        const yesBtn = document.getElementById('confirm-yes');
        const noBtn = document.getElementById('confirm-no');
        msg.textContent = message;
        overlay.classList.add('show');
        const cleanup = (result) => {
            overlay.classList.remove('show');
            yesBtn.replaceWith(yesBtn.cloneNode(true));
            noBtn.replaceWith(noBtn.cloneNode(true));
            resolve(result);
        };
        document.getElementById('confirm-yes').addEventListener('click', () => cleanup(true), { once: true });
        document.getElementById('confirm-no').addEventListener('click', () => cleanup(false), { once: true });
    });
}
//# sourceMappingURL=feedback.js.map