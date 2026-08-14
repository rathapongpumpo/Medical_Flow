/**
 * UI Patterns
 * Higher-level interactive components (Toast, Modal, Drawer)
 */

export class ToastNotification {
    /**
     * @param {Object} props
     * @param {string} props.message
     * @param {string} props.type - 'info', 'success', 'warning', 'error'
     * @param {number} props.durationMs
     */
    show(props) {
        if (typeof document === 'undefined') return;
        
        let container = document.getElementById('mf-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'mf-toast-container';
            container.style.position = 'fixed';
            container.style.top = 'var(--space-4)';
            container.style.right = 'var(--space-4)';
            container.style.zIndex = '9999';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = 'var(--space-2)';
            document.body.appendChild(container);
        }
        
        const toast = document.createElement('div');
        toast.className = `mf-toast mf-toast-${props.type || 'info'}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.style.backgroundColor = 'var(--bg-surface)';
        toast.style.border = 'var(--border-width-base) solid var(--border-color)';
        if (props.type === 'error') toast.style.borderLeft = '4px solid var(--color-danger-base)';
        if (props.type === 'success') toast.style.borderLeft = '4px solid var(--color-success-base)';
        toast.style.padding = 'var(--space-3) var(--space-4)';
        toast.style.borderRadius = 'var(--border-radius-md)';
        toast.style.boxShadow = 'var(--shadow-md)';
        toast.style.minWidth = '250px';
        
        toast.textContent = props.message;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity var(--transition-fast)';
            setTimeout(() => toast.remove(), 250);
        }, props.durationMs || 3000);
    }
}

export class ModalDialog {
    constructor() {
        this._previouslyFocusedNode = null;
        this._handleKeyDown = this._handleKeyDown.bind(this);
    }
    
    /**
     * @param {Object} props
     * @param {string} props.title
     * @param {HTMLElement|string} props.content
     * @param {Array} props.actions
     * @param {Function} props.onClose
     */
    render(props) {
        this.props = props;
        this._previouslyFocusedNode = document.activeElement;
        
        const overlay = document.createElement('div');
        overlay.className = 'mf-modal-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '3000';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        
        const dialog = document.createElement('div');
        dialog.className = 'mf-modal-dialog';
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('aria-labelledby', 'mf-modal-title');
        dialog.style.backgroundColor = 'var(--bg-surface)';
        dialog.style.borderRadius = 'var(--border-radius-lg)';
        dialog.style.boxShadow = 'var(--shadow-lg)';
        dialog.style.width = '100%';
        dialog.style.maxWidth = '500px';
        dialog.style.display = 'flex';
        dialog.style.flexDirection = 'column';
        dialog.tabIndex = -1;
        
        // Header
        const header = document.createElement('div');
        header.style.padding = 'var(--space-4)';
        header.style.borderBottom = 'var(--border-width-base) solid var(--border-color)';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        
        const title = document.createElement('h3');
        title.id = 'mf-modal-title';
        title.textContent = props.title;
        title.style.margin = '0';
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.fontSize = 'var(--font-size-2xl)';
        closeBtn.style.cursor = 'pointer';
        closeBtn.addEventListener('click', () => this.close());
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        // Body
        const body = document.createElement('div');
        body.style.padding = 'var(--space-4)';
        body.style.maxHeight = '70vh';
        body.style.overflowY = 'auto';
        
        if (typeof props.content === 'string') {
            body.innerHTML = props.content;
        } else {
            body.appendChild(props.content);
        }
        
        // Footer
        const footer = document.createElement('div');
        footer.style.padding = 'var(--space-4)';
        footer.style.borderTop = 'var(--border-width-base) solid var(--border-color)';
        footer.style.display = 'flex';
        footer.style.justifyContent = 'flex-end';
        footer.style.gap = 'var(--space-3)';
        
        if (props.actions) {
            props.actions.forEach(action => {
                const btn = document.createElement('button');
                btn.className = `mf-btn ${action.isPrimary ? 'mf-btn-primary' : 'mf-btn-outline'}`;
                btn.textContent = action.label;
                btn.addEventListener('click', () => {
                    if (action.onExecute) action.onExecute();
                });
                footer.appendChild(btn);
            });
        }
        
        dialog.appendChild(header);
        dialog.appendChild(body);
        dialog.appendChild(footer);
        
        overlay.appendChild(dialog);
        this.overlay = overlay;
        this.dialog = dialog;
        
        document.body.appendChild(overlay);
        document.addEventListener('keydown', this._handleKeyDown);
        
        // Focus trap initial focus
        requestAnimationFrame(() => dialog.focus());
        return overlay;
    }
    
    close() {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
        document.removeEventListener('keydown', this._handleKeyDown);
        
        if (this.props && this.props.onClose) {
            this.props.onClose();
        }
        
        // Return focus
        if (this._previouslyFocusedNode) {
            this._previouslyFocusedNode.focus();
        }
    }
    
    _handleKeyDown(e) {
        if (e.key === 'Escape') {
            this.close();
            return;
        }
        
        // Focus trap
        if (e.key === 'Tab') {
            const focusableElements = this.dialog.querySelectorAll(
                'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length === 0) {
                e.preventDefault();
                return;
            }
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement || document.activeElement === this.dialog) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    }
}

export class Drawer {
    constructor() {
        this._previouslyFocusedNode = null;
        this._handleKeyDown = this._handleKeyDown.bind(this);
    }
    
    /**
     * @param {Object} props
     * @param {string} props.title
     * @param {HTMLElement|string} props.content
     * @param {Function} props.onClose
     */
    render(props) {
        this.props = props;
        this._previouslyFocusedNode = document.activeElement;
        
        const overlay = document.createElement('div');
        overlay.className = 'mf-drawer-overlay';
        overlay.addEventListener('click', () => this.close());
        
        const drawer = document.createElement('div');
        drawer.className = 'mf-drawer';
        drawer.setAttribute('role', 'complementary'); // Wait, modal drawer should be role dialog
        drawer.setAttribute('role', 'dialog');
        drawer.setAttribute('aria-modal', 'true');
        drawer.setAttribute('aria-label', props.title);
        drawer.tabIndex = -1;
        
        const header = document.createElement('div');
        header.style.padding = 'var(--space-4)';
        header.style.borderBottom = 'var(--border-width-base) solid var(--border-color)';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        
        const title = document.createElement('h3');
        title.textContent = props.title;
        title.style.margin = '0';
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Close drawer');
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.fontSize = 'var(--font-size-2xl)';
        closeBtn.style.cursor = 'pointer';
        closeBtn.addEventListener('click', () => this.close());
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        const body = document.createElement('div');
        body.style.padding = 'var(--space-4)';
        body.style.overflowY = 'auto';
        body.style.flex = '1';
        
        if (typeof props.content === 'string') {
            body.innerHTML = props.content;
        } else {
            body.appendChild(props.content);
        }
        
        drawer.appendChild(header);
        drawer.appendChild(body);
        
        this.overlay = overlay;
        this.drawer = drawer;
        
        document.body.appendChild(overlay);
        document.body.appendChild(drawer);
        document.addEventListener('keydown', this._handleKeyDown);
        
        // Trigger reflow for transition
        void drawer.offsetWidth;
        
        drawer.classList.add('is-open');
        overlay.classList.add('is-open');
        
        requestAnimationFrame(() => drawer.focus());
        
        return { drawer, overlay };
    }
    
    close() {
        if (this.drawer) {
            this.drawer.classList.remove('is-open');
            this.overlay.classList.remove('is-open');
            setTimeout(() => {
                this.drawer.remove();
                this.overlay.remove();
                this.drawer = null;
                this.overlay = null;
            }, 250); // Matches var(--transition-base)
        }
        
        document.removeEventListener('keydown', this._handleKeyDown);
        
        if (this.props && this.props.onClose) {
            this.props.onClose();
        }
        
        if (this._previouslyFocusedNode) {
            this._previouslyFocusedNode.focus();
        }
    }
    
    _handleKeyDown(e) {
        if (e.key === 'Escape') {
            this.close();
            return;
        }
        
        // Focus trap
        if (e.key === 'Tab') {
            const focusableElements = this.drawer.querySelectorAll(
                'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length === 0) {
                e.preventDefault();
                return;
            }
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement || document.activeElement === this.drawer) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    }
}

export class ConfirmationDialog {
    /**
     * @param {Object} props
     * @param {string} props.title
     * @param {string} props.message
     * @param {string} props.confirmLabel
     * @param {string} props.cancelLabel
     * @param {boolean} props.isDestructive
     * @param {Function} props.onConfirm
     * @param {Function} props.onCancel
     */
    show(props) {
        const modal = new ModalDialog();
        modal.render({
            title: props.title || 'Confirm',
            content: props.message || 'Are you sure?',
            onClose: () => {
                if (props.onCancel) props.onCancel();
            },
            actions: [
                {
                    label: props.cancelLabel || 'Cancel',
                    onExecute: () => {
                        modal.close();
                    }
                },
                {
                    label: props.confirmLabel || 'Confirm',
                    isPrimary: true,
                    // Destructive styling could be applied via custom class if needed
                    onExecute: () => {
                        if (props.onConfirm) props.onConfirm();
                        modal.close();
                    }
                }
            ]
        });
    }
}
