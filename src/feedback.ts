// Toast notifications
export function toast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
  const container = document.getElementById('toast-container') as HTMLDivElement;
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
export function confirm(message: string): Promise<boolean> {
  return new Promise(resolve => {
    const overlay = document.getElementById('confirm-overlay') as HTMLDivElement;
    const msg = document.getElementById('confirm-message') as HTMLParagraphElement;
    const yesBtn = document.getElementById('confirm-yes') as HTMLButtonElement;
    const noBtn = document.getElementById('confirm-no') as HTMLButtonElement;

    msg.textContent = message;
    overlay.classList.add('show');

    const cleanup = (result: boolean) => {
      overlay.classList.remove('show');
      yesBtn.replaceWith(yesBtn.cloneNode(true));
      noBtn.replaceWith(noBtn.cloneNode(true));
      resolve(result);
    };

    document.getElementById('confirm-yes')!.addEventListener('click', () => cleanup(true), { once: true });
    document.getElementById('confirm-no')!.addEventListener('click', () => cleanup(false), { once: true });
  });
}
