/**
 * Data Patterns
 * Reusable components for data presentation (Tables, Forms, Status)
 */

export class DataTable {
    /**
     * @param {Object} props
     * @param {Array<{key: string, label: string, render?: Function}>} props.columns
     * @param {Array<Object>} props.data
     * @param {string} props.emptyMessage
     */
    render(props) {
        const tableContainer = document.createElement('div');
        tableContainer.style.overflowX = 'auto';
        
        if (!props.data || props.data.length === 0) {
            const empty = document.createElement('div');
            empty.style.padding = 'var(--space-6)';
            empty.style.textAlign = 'center';
            empty.style.color = 'var(--text-secondary)';
            empty.textContent = props.emptyMessage || 'No records found.';
            tableContainer.appendChild(empty);
            return tableContainer;
        }

        const table = document.createElement('table');
        table.className = 'mf-data-table'; // Needs CSS
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        props.columns.forEach(col => {
            const th = document.createElement('th');
            th.textContent = col.label;
            th.style.textAlign = 'left';
            th.style.padding = 'var(--space-3) var(--space-4)';
            th.style.borderBottom = 'var(--border-width-thick) solid var(--border-color)';
            th.style.color = 'var(--text-secondary)';
            th.style.fontWeight = '600';
            trHead.appendChild(th);
        });
        thead.appendChild(trHead);
        table.appendChild(thead);
        
        const tbody = document.createElement('tbody');
        props.data.forEach(row => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = 'var(--border-width-base) solid var(--border-color)';
            tr.addEventListener('mouseenter', () => tr.style.backgroundColor = 'var(--bg-surface-hover)');
            tr.addEventListener('mouseleave', () => tr.style.backgroundColor = 'transparent');
            
            props.columns.forEach(col => {
                const td = document.createElement('td');
                td.style.padding = 'var(--space-3) var(--space-4)';
                if (col.render) {
                    const content = col.render(row[col.key], row);
                    if (content instanceof HTMLElement) {
                        td.appendChild(content);
                    } else {
                        td.innerHTML = content;
                    }
                } else {
                    td.textContent = row[col.key] || '';
                }
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        
        tableContainer.appendChild(table);
        return tableContainer;
    }
}

export class FormFields {
    /**
     * @param {Object} props
     * @param {string} props.id
     * @param {string} props.label
     * @param {string} props.type
     * @param {string} props.value
     * @param {string} props.error
     * @param {boolean} props.required
     */
    static renderInput(props) {
        const group = document.createElement('div');
        group.className = 'mf-form-group';
        group.style.marginBottom = 'var(--space-4)';
        
        const label = document.createElement('label');
        label.htmlFor = props.id;
        label.className = 'mf-form-label';
        label.textContent = props.label;
        if (props.required) {
            label.textContent += ' *';
        }
        label.style.display = 'block';
        label.style.marginBottom = 'var(--space-2)';
        label.style.fontWeight = '500';
        
        const input = document.createElement('input');
        input.type = props.type || 'text';
        input.id = props.id;
        input.className = 'mf-form-control';
        input.value = props.value || '';
        if (props.required) input.required = true;
        
        input.style.width = '100%';
        input.style.padding = 'var(--space-2) var(--space-3)';
        input.style.border = 'var(--border-width-base) solid var(--border-color)';
        input.style.borderRadius = 'var(--border-radius-sm)';
        
        if (props.error) {
            input.setAttribute('aria-invalid', 'true');
            input.setAttribute('aria-describedby', `${props.id}-error`);
            input.style.borderColor = 'var(--color-danger-base)';
            
            const errorMsg = document.createElement('div');
            errorMsg.id = `${props.id}-error`;
            errorMsg.className = 'mf-form-error';
            errorMsg.style.color = 'var(--color-danger-base)';
            errorMsg.style.fontSize = 'var(--font-size-sm)';
            errorMsg.style.marginTop = 'var(--space-1)';
            errorMsg.textContent = props.error;
            
            group.appendChild(label);
            group.appendChild(input);
            group.appendChild(errorMsg);
        } else {
            group.appendChild(label);
            group.appendChild(input);
        }
        
        return group;
    }
}

export class StatusPrimitives {
    /**
     * @param {Object} props
     * @param {string} props.status
     * @param {string} props.label
     */
    static renderBadge(props) {
        const badge = document.createElement('span');
        badge.className = `mf-status-badge mf-status-${props.status}`;
        badge.style.display = 'inline-flex';
        badge.style.alignItems = 'center';
        badge.style.padding = '2px 8px';
        badge.style.borderRadius = '12px';
        badge.style.fontSize = 'var(--font-size-xs)';
        badge.style.fontWeight = '600';
        badge.style.gap = '4px';
        
        let icon = '•';
        let bgColor = 'var(--color-brand-100)';
        let color = 'var(--color-brand-800)';
        
        switch (props.status) {
            case 'success':
                icon = '✓';
                bgColor = 'var(--color-success-light)';
                color = 'var(--color-success-base)';
                break;
            case 'warning':
                icon = '⚠';
                bgColor = 'var(--color-warning-light)';
                color = 'var(--color-warning-base)';
                break;
            case 'error':
                icon = '✕';
                bgColor = 'var(--color-danger-light)';
                color = 'var(--color-danger-base)';
                break;
            case 'info':
                icon = 'ℹ';
                bgColor = 'var(--color-info-light)';
                color = 'var(--color-info-base)';
                break;
        }
        
        badge.style.backgroundColor = bgColor;
        badge.style.color = color;
        
        badge.innerHTML = `<span aria-hidden="true">${icon}</span> <span>${props.label}</span>`;
        return badge;
    }
}
