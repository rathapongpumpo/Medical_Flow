import { ReportDataService } from '../application/services/report-data-service.js';
import { authSession } from '../application/services/auth-session-service.js';
import { globalEventBus } from '../domain/events/event-bus.js';
import { showToast } from '../shared/toast.js';
import { i18n } from '../application/services/i18n-service.js';

export class DashboardController {
    constructor(element) {
        this.element = element;
        this.reportService = new ReportDataService();
        this.unsubscribe = null;
    }

    async mount() {
        const branch = authSession.getCurrentBranch();
        if (!branch) return;

        this.element.innerHTML = `
            <div class="mf-page-header">
                <div>
                    <h1 class="mf-page-title">${i18n.t('dashboard.title')}</h1>
                    <p class="mf-page-subtitle">${i18n.t('dashboard.subtitle')} - ${branch.name}</p>
                </div>
            </div>

            <div id="db-kpi-container" class="mf-kpi-grid">
                <!-- KPIs will be injected here -->
            </div>

            <div class="mf-dashboard-grid">
                <div class="mf-chart-card">
                    <h3 class="mf-card-section-title">${i18n.t('dashboard.chart.queue_volume')}</h3>
                    <div class="mf-chart-bars">
                        <!-- Premium CSS Bar Chart -->
                        <div class="mf-chart-bar" title="08:00"></div>
                        <div class="mf-chart-bar" title="09:00"></div>
                        <div class="mf-chart-bar" title="10:00"></div>
                        <div class="mf-chart-bar" title="11:00"></div>
                        <div class="mf-chart-bar" title="12:00"></div>
                        <div id="bar-now" class="mf-chart-bar" title="Current Hour"></div>
                    </div>
                    <div class="mf-chart-labels">
                        <span>08:00</span><span>09:00</span><span>10:00</span><span>11:00</span><span>12:00</span><span class="mf-chart-label-active">Now</span>
                    </div>
                </div>

                <div class="mf-card">
                    <div class="mf-card-body">
                        <h3 class="mf-card-section-title">${i18n.t('dashboard.activity.recent')}</h3>
                        <div id="db-activity-stream" class="mf-activity-list">
                            <!-- Activities -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.unsubscribe = globalEventBus.subscribe('visit', () => this.loadData());
        
        await this.loadData();
    }

    async loadData() {
        const branchId = authSession.getCurrentBranch().id;
        
        try {
            const summary = await this.reportService.getDashboardSummary(branchId);
            const activities = await this.reportService.getRecentActivity(branchId, 6);

            // Update KPIs
            const kpiContainer = document.getElementById('db-kpi-container');
            kpiContainer.innerHTML = `
                ${this.renderKpiCard(i18n.t('dashboard.kpi.total_visits'), summary.totalToday)}
                ${this.renderKpiCard(i18n.t('dashboard.kpi.active_now'), summary.activeNow)}
                ${this.renderKpiCard(i18n.t('dashboard.kpi.avg_wait'), summary.avgWaitTimeMins)}
                ${this.renderKpiCard(i18n.t('dashboard.kpi.on_hold'), summary.onHold)}
            `;

            // Update Activity Stream
            const streamContainer = document.getElementById('db-activity-stream');
            if (activities.length === 0) {
                streamContainer.innerHTML = '<div class="mf-empty-state">No recent activity</div>';
            } else {
                streamContainer.innerHTML = activities.map(a => `
                    <div class="mf-activity-item">
                        <div class="mf-activity-ticket">${a.ticketNumber}</div>
                        <div>
                            <div class="mf-activity-desc">${a.description}</div>
                            <div class="mf-activity-time">${new Date(a.timestamp).toLocaleTimeString()}</div>
                        </div>
                    </div>
                `).join('');
            }

            // Animate bar
            const barNow = document.getElementById('bar-now');
            if (barNow) {
                // Mock calculation for bar height based on active visits
                const height = Math.min(100, Math.max(10, summary.activeNow * 5)) + '%';
                barNow.style.height = height;
            }

        } catch (e) {
            console.error('Failed to load dashboard', e);
        }
    }

    renderKpiCard(title, value) {
        return `
            <div class="mf-kpi-card">
                <div class="mf-kpi-stripe"></div>
                <div class="mf-kpi-label">${title}</div>
                <div class="mf-kpi-value">${value}</div>
            </div>
        `;
    }
}
