/**
 * App Shell Components
 * Handles the main structural elements of the layout.
 */

import { showToast } from '../../shared/toast.js';
import { i18n } from '../../application/services/i18n-service.js';

export class AppHeader {
    /**
     * @param {Object} props 
     * @param {string} props.title
     * @param {Object} props.user
     * @param {Function} props.onToggleSidebar
     * @param {Function} props.onToggleTheme
     */
    render(props) {
        const header = document.createElement('header');
        header.className = 'mf-navbar';
        header.setAttribute('role', 'banner');
        
        const leftArea = document.createElement('div');
        leftArea.className = 'mf-header-left';
        
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mf-btn mf-btn-outline mf-btn-sm mf-sidebar-toggle';
        mobileToggle.setAttribute('aria-label', 'Toggle navigation');
        mobileToggle.innerHTML = '<i class="bi bi-list"></i>';
        if (props.onToggleSidebar) {
            mobileToggle.addEventListener('click', props.onToggleSidebar);
        }
        
        const brand = document.createElement('div');
        brand.className = 'mf-header-brand';
        brand.innerHTML = '<img src="/assets/favicon.svg" alt="Medical Flow" style="width: 28px; height: 28px; margin-right: 12px; vertical-align: middle;">' + (props.title || 'Medical Flow');
        
        leftArea.appendChild(mobileToggle);
        leftArea.appendChild(brand);
        
        const rightArea = document.createElement('div');
        rightArea.className = 'mf-header-actions';
        
        // Language Switcher
        const langToggle = document.createElement('button');
        langToggle.className = 'mf-btn mf-btn-outline mf-btn-sm mf-lang-toggle';
        const currentLangText = i18n.currentLang === 'en' ? 'TH' : 'EN';
        langToggle.innerHTML = `<i class="bi bi-translate"></i> <span>${currentLangText}</span>`;
        langToggle.title = 'Switch Language';
        langToggle.addEventListener('click', () => {
            i18n.toggleLanguage();
        });
        rightArea.appendChild(langToggle);

        if (props.onToggleTheme) {
            const themeToggle = document.createElement('button');
            themeToggle.className = 'mf-btn mf-btn-outline mf-btn-sm mf-theme-toggle';
            const isCurrentlyDark = document.documentElement.getAttribute('data-theme') === 'alternate';
            themeToggle.innerHTML = isCurrentlyDark ? '<i class="bi bi-brightness-high"></i>' : '<i class="bi bi-moon-stars"></i>';
            themeToggle.title = 'Toggle Theme';
            themeToggle.addEventListener('click', (e) => {
                props.onToggleTheme(e);
                const isDark = document.documentElement.getAttribute('data-theme') === 'alternate';
                themeToggle.innerHTML = isDark ? '<i class="bi bi-brightness-high"></i>' : '<i class="bi bi-moon-stars"></i>';
            });
            rightArea.appendChild(themeToggle);
        }
        
        if (props.user) {
            const userContainer = document.createElement('div');
            userContainer.style.position = 'relative';

            const userMenu = document.createElement('button');
            userMenu.className = 'mf-btn mf-btn-outline mf-btn-sm mf-user-menu';
            userMenu.innerHTML = `<i class="bi bi-person-circle"></i> <span>${props.user.name || 'User'}</span> <i class="bi bi-chevron-down" style="font-size: 10px; margin-left: 4px;"></i>`;
            
            const dropdown = document.createElement('div');
            dropdown.className = 'mf-card';
            dropdown.style.position = 'absolute';
            dropdown.style.right = '0';
            dropdown.style.top = '100%';
            dropdown.style.marginTop = '8px';
            dropdown.style.minWidth = '150px';
            dropdown.style.display = 'none';
            dropdown.style.zIndex = '1000';
            dropdown.style.padding = '8px 0';

            const profileBtn = document.createElement('button');
            profileBtn.className = 'mf-btn mf-btn-text w-100';
            profileBtn.style.justifyContent = 'flex-start';
            profileBtn.innerHTML = `<i class="bi bi-person"></i> ${i18n.t('user.profile')}`;
            profileBtn.onclick = () => {
                showToast('Profile page is not available in Prototype', 'info');
                dropdown.style.display = 'none';
            };

            const signoutBtn = document.createElement('button');
            signoutBtn.className = 'mf-btn mf-btn-text w-100';
            signoutBtn.style.justifyContent = 'flex-start';
            signoutBtn.style.color = 'var(--color-danger-base)';
            signoutBtn.innerHTML = `<i class="bi bi-box-arrow-right"></i> ${i18n.t('user.signout')}`;
            signoutBtn.onclick = () => {
                if (props.onSignOut) props.onSignOut();
            };

            dropdown.appendChild(profileBtn);
            dropdown.appendChild(signoutBtn);

            userMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            });

            document.addEventListener('click', () => {
                dropdown.style.display = 'none';
            });

            userContainer.appendChild(userMenu);
            userContainer.appendChild(dropdown);
            rightArea.appendChild(userContainer);
        }

        header.appendChild(leftArea);
        header.appendChild(rightArea);
        
        return header;
    }
}

export class AppNavigation {
    /**
     * @param {Object} props
     * @param {Array<{id: string, label: string, icon: string, isActive: boolean, isAvailable: boolean}>} props.links
     * @param {Function} props.onNavigate
     */
    render(props) {
        const nav = document.createElement('nav');
        nav.setAttribute('role', 'navigation');
        nav.setAttribute('aria-label', 'Main Navigation');
        
        const list = document.createElement('ul');
        list.className = 'mf-nav-list';
        
        if (props.links && props.links.length > 0) {
            props.links.forEach(link => {
                if (!link.isAvailable) return; // Hide dead links
                
                const li = document.createElement('li');
                li.className = 'mf-nav-item';
                
                const a = document.createElement('a');
                a.href = '#' + link.id;
                a.className = 'mf-nav-link';

                if (link.isActive) {
                    a.classList.add('is-active');
                    a.setAttribute('aria-current', 'page');
                }
                
                const icon = document.createElement('span');
                icon.className = 'mf-nav-icon';
                // Render HTML for the icon to support SVGs/Bootstrap Icons
                icon.innerHTML = link.icon || '<i class="bi bi-circle"></i>';
                icon.setAttribute('aria-hidden', 'true');
                
                const text = document.createElement('span');
                text.textContent = link.label;
                
                a.appendChild(icon);
                a.appendChild(text);
                
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (props.onNavigate) {
                        props.onNavigate(link.id);
                    }
                });
                
                li.appendChild(a);
                list.appendChild(li);
            });
        }
        
        nav.appendChild(list);
        return nav;
    }
}

export class GlobalStatus {
    /**
     * @param {Object} props
     * @param {string} props.message
     * @param {string} props.type - 'info', 'warning', 'error', 'success'
     */
    render(props) {
        if (!props.message) return null;
        
        const container = document.createElement('div');
        container.className = 'mf-global-status';
        container.setAttribute('role', 'status');
        container.setAttribute('aria-live', 'polite');
        
        let icon = '<i class="bi bi-info-circle"></i>';
        if (props.type === 'warning') icon = '<i class="bi bi-exclamation-triangle"></i>';
        if (props.type === 'error') icon = '<i class="bi bi-x-circle"></i>';
        if (props.type === 'success') icon = '<i class="bi bi-check-circle"></i>';
        
        container.innerHTML = `<span aria-hidden="true" class="mf-status-icon">${icon}</span> <span>${props.message}</span>`;
        return container;
    }
}
