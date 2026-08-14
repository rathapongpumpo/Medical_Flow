/**
 * Toast Notification Utility (MD3 Snackbar-style)
 * Replaces all alert() calls throughout the application.
 */

let toastContainer = null;

function ensureContainer() {
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'mf-toast-container';
        document.body.appendChild(toastContainer);
    }
    return toastContainer;
}

const ICONS = {
    info:    '<i class="bi bi-info-circle-fill mf-toast-icon"></i>',
    success: '<i class="bi bi-check-circle-fill mf-toast-icon"></i>',
    error:   '<i class="bi bi-x-circle-fill mf-toast-icon"></i>',
    warning: '<i class="bi bi-exclamation-triangle-fill mf-toast-icon"></i>',
};

/**
 * Show a toast notification.
 * @param {string} message - Text to display
 * @param {'info'|'success'|'error'|'warning'} type - Toast type
 * @param {number} durationMs - Auto-dismiss in ms (default 3500)
 */
export function showToast(message, type = 'info', durationMs = 3500) {
    const container = ensureContainer();

    const toast = document.createElement('div');
    toast.className = `mf-toast mf-toast--${type}`;
    toast.innerHTML = `${ICONS[type] || ICONS.info}<span>${message}</span>`;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.add('is-visible');
    });

    // Auto dismiss
    setTimeout(() => {
        toast.classList.remove('is-visible');
        setTimeout(() => toast.remove(), 250);
    }, durationMs);
}
