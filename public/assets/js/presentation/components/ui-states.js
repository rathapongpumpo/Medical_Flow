/**
 * UI States
 * Reusable components for communicating state to the user.
 */

export class BaseStateComponent {
    _renderState(props, icon, defaultTitle, defaultClass) {
        const container = document.createElement('div');
        container.className = `mf-state-container ${defaultClass || ''}`;
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.padding = 'var(--space-8)';
        container.style.textAlign = 'center';
        
        const iconEl = document.createElement('div');
        iconEl.style.fontSize = 'var(--font-size-4xl)';
        iconEl.style.marginBottom = 'var(--space-4)';
        iconEl.setAttribute('aria-hidden', 'true');
        iconEl.textContent = props.icon || icon;
        
        const titleEl = document.createElement('h2');
        titleEl.textContent = props.title || defaultTitle;
        titleEl.style.marginBottom = 'var(--space-2)';
        
        const msgEl = document.createElement('p');
        msgEl.textContent = props.message || '';
        msgEl.style.color = 'var(--text-secondary)';
        
        container.appendChild(iconEl);
        container.appendChild(titleEl);
        if (props.message) container.appendChild(msgEl);
        
        if (props.actions && props.actions.length > 0) {
            const actionsContainer = document.createElement('div');
            actionsContainer.style.marginTop = 'var(--space-4)';
            actionsContainer.style.display = 'flex';
            actionsContainer.style.gap = 'var(--space-3)';
            
            props.actions.forEach(action => {
                const btn = document.createElement('button');
                btn.className = `mf-btn ${action.isPrimary ? 'mf-btn-primary' : 'mf-btn-outline'}`;
                btn.textContent = action.label;
                btn.addEventListener('click', () => {
                    if (action.onExecute) action.onExecute();
                });
                actionsContainer.appendChild(btn);
            });
            container.appendChild(actionsContainer);
        }
        
        return container;
    }
}

export class LoadingState extends BaseStateComponent {
    /**
     * @param {Object} props
     * @param {string} props.message
     */
    render(props) {
        // Accessibility: aria-busy communicates loading state
        const container = this._renderState(props, '⏳', 'Loading...');
        container.setAttribute('aria-busy', 'true');
        container.setAttribute('aria-live', 'polite');
        return container;
    }
}

export class EmptyState extends BaseStateComponent {
    /**
     * @param {Object} props
     * @param {string} props.title
     * @param {string} props.message
     * @param {Array} props.actions
     */
    render(props) {
        return this._renderState(props, '📭', 'No Data Found');
    }
}

export class ErrorState extends BaseStateComponent {
    render(props) {
        const container = this._renderState(props, '⚠️', 'An Error Occurred', 'mf-state-error');
        container.setAttribute('role', 'alert');
        container.style.color = 'var(--color-danger-base)';
        return container;
    }
}

export class OfflineState extends BaseStateComponent {
    render(props) {
        const container = this._renderState(props, '🔌', 'No Internet Connection');
        container.setAttribute('role', 'alert');
        return container;
    }
}

export class PermissionState extends BaseStateComponent {
    render(props) {
        return this._renderState(props, '🔒', 'Access Denied');
    }
}

export class ConflictState extends BaseStateComponent {
    render(props) {
        const container = this._renderState(props, '⚡', 'Version Conflict');
        container.setAttribute('role', 'alert');
        return container;
    }
}
