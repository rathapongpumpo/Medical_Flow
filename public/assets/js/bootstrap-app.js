// public/assets/js/bootstrap-app.js
import { SystemBootstrapService } from './application/bootstrap/system-bootstrap-service.js';
import { IdGenerator } from './shared/id-generator.js';
import { clock } from './shared/clock.js';
import { logger } from './shared/logger.js';
import { GlobalErrorBoundary } from './presentation/error-boundary.js';
import { PageControllerResolver } from './presentation/page-resolver.js';
import { registry } from './presentation/registry.js';

import { DashboardController } from './pages/dashboard.js';
import { CheckInController } from './pages/check-in.js';
import { OperationalBoardController } from './pages/operational-board.js';
import { RoomBoardController } from './pages/room-board.js';
import { ReportsController } from './pages/reports.js';
import { WorkflowListController } from './pages/workflow-list.js';
import { PublicDisplayController } from './pages/public-display.js';
import { showToast } from './shared/toast.js';
import { i18n } from './application/services/i18n-service.js';

// Register controllers
registry.register('dashboard', DashboardController);
registry.register('check-in', CheckInController);
registry.register('operational-board', OperationalBoardController);
registry.register('room-board', RoomBoardController);
registry.register('reports', ReportsController);
registry.register('workflow-list', WorkflowListController);
registry.register('public-display', PublicDisplayController);

import { storage } from './infrastructure/storage-selector.js';
import { FallbackWarningComponent } from './presentation/components/fallback-warning.js';
import { AppHeader, AppNavigation } from './presentation/components/app-shell.js';
import { authSession } from './application/services/auth-session-service.js';

// Bootstrap process
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Setup Global Error Boundary
    const errorBoundary = new GlobalErrorBoundary('app-root');
    errorBoundary.setup();

    logger.info('Medical Flow Prototype JS Bootstrap started.');

    // Restore theme preference
    const savedTheme = localStorage.getItem('mf-theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // 1.5 Setup Warning Component
    try {
        const info = await storage.getAdapterInfo();
        const warningComponent = new FallbackWarningComponent();
        warningComponent.render({
            isFallback: info.isFallback,
            warningCode: info.warningCode,
            mode: info.mode
        });
    } catch (e) {
        logger.error('Failed to initialize storage info for warning component', { error: e.message });
    }

    // 1.7 Ensure Demo Data
    try {
        const bootstrap = new SystemBootstrapService({
            storageSelector: storage,
            logger: logger,
            clock: clock,
            idGenerator: IdGenerator
        });
        await bootstrap.initializeIfRequired();
    } catch (e) {
        logger.error('Bootstrap failed', e);
    }

    // 1.8 Auth Check
    if (!authSession.getCurrentUser()) {
        await renderLoginModal();
        return; // Halt bootstrapping until logged in, then we can reload or continue
    }

    // 2. Render App Shell
    const headerContainer = document.getElementById('mf-header-container');
    const sidebarContainer = document.getElementById('mf-sidebar-container');

    if (headerContainer && sidebarContainer) {
        const headerComponent = new AppHeader();
        const navComponent = new AppNavigation();

        const currentPath = window.location.pathname;

        headerContainer.appendChild(headerComponent.render({
            title: 'Medical Flow Prototype',
            user: authSession.getCurrentUser(),
            onToggleSidebar: () => {
                if (window.innerWidth <= 767) {
                    sidebarContainer.classList.toggle('is-open');
                } else {
                    sidebarContainer.classList.toggle('is-collapsed');
                }
            },
            onToggleTheme: () => {
                const current = document.documentElement.getAttribute('data-theme');
                const next = current === 'alternate' ? 'default' : 'alternate';
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem('mf-theme', next);
            },
            onSignOut: () => {
                authSession.logout();
                window.location.reload();
            }
        }));

        sidebarContainer.appendChild(navComponent.render({
            links: [
                { id: '/', label: i18n.t('nav.dashboard'), icon: '<i class="bi bi-grid-1x2"></i>', isActive: currentPath === '/', isAvailable: true },
                { id: '/check-in', label: i18n.t('nav.check_in'), icon: '<i class="bi bi-person-plus"></i>', isActive: currentPath === '/check-in', isAvailable: true },
                { id: '/operations/board', label: i18n.t('nav.operations'), icon: '<i class="bi bi-hospital"></i>', isActive: currentPath === '/operations/board', isAvailable: true },
                { id: '/rooms', label: i18n.t('nav.rooms'), icon: '<i class="bi bi-door-open"></i>', isActive: currentPath === '/rooms', isAvailable: true },
                { id: '/reports', label: i18n.t('nav.reports'), icon: '<i class="bi bi-bar-chart"></i>', isActive: currentPath === '/reports', isAvailable: true },
                { id: '/settings/workflows', label: i18n.t('nav.workflow'), icon: '<i class="bi bi-gear"></i>', isActive: currentPath === '/settings/workflows', isAvailable: true },
                { id: '/public-display', label: i18n.t('nav.tv_display'), icon: '<i class="bi bi-tv"></i>', isActive: currentPath === '/public-display', isAvailable: true },
                { id: '/manual', label: 'คู่มือการใช้งานระบบ', icon: '<i class="bi bi-book"></i>', isActive: currentPath === '/manual', isAvailable: true }
            ],
            onNavigate: (path) => {
                window.location.href = path;
            }
        }));
    }

    // 3. Resolve and mount page controller based on DOM structure
    const resolver = new PageControllerResolver('app-root');
    await resolver.resolveAndMount();
});

async function renderLoginModal() {
    const root = document.getElementById('app-root');
    root.innerHTML = ''; // Clear layout

    const container = document.createElement('div');
    container.className = 'mf-login-container';
    container.innerHTML = `
        <div class="mf-login-card mf-card">
            <div class="mf-login-header">
                <h3 class="mf-login-title">Select Demo Context</h3>
                <p class="mf-login-subtitle">Choose your branch and role</p>
                <div class="mf-alert mf-alert-info mf-mt-3" style="font-size: 13px; text-align: left; background-color: hsla(212, 75%, 35%, 0.1); color: hsl(212, 75%, 35%); padding: 12px; border-radius: 8px;">
                    <strong>Demo Version:</strong> ระบบนี้คือระบบ Demo ของ Medical Flow & Queue Management System สำหรับใช้ทดสอบการทำงาน การจัดการคิวผู้ป่วย และ Workflow เบื้องต้น
                </div>
            </div>
            <div class="mf-login-body">
                <div class="mf-form-group">
                    <label class="mf-label">Branch</label>
                    <select id="login-branch" class="mf-input">
                        <option value="SEED-BRN-001">Main Hospital (SEED-BRN-001)</option>
                        <option value="SEED-BRN-002">Downtown Clinic (SEED-BRN-002)</option>
                    </select>
                </div>
                <div class="mf-form-group">
                    <label class="mf-label">User Role</label>
                    <select id="login-user" class="mf-input">
                        <option value="SEED-USR-001">Dr. Smith (Doctor)</option>
                        <option value="SEED-USR-002">Nurse Joy (Nurse)</option>
                    </select>
                </div>
                <button id="login-btn" class="mf-btn mf-btn-primary w-100 mt-3">Start Prototype</button>
            </div>
        </div>
    `;
    root.appendChild(container);

    document.getElementById('login-btn').addEventListener('click', async () => {
        const branchId = document.getElementById('login-branch').value;
        const userId = document.getElementById('login-user').value;
        try {
            await authSession.login(userId, branchId);
            window.location.reload(); // Reload to bootstrap properly
        } catch (e) {
            showToast('Login failed: ' + e.message);
        }
    });
}


// Ensure no business logic variables on window
// (This space is intentionally left blank for business variables - we enforce zero pollution)
