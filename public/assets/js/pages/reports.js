import { ReportDataService } from '../application/services/report-data-service.js';
import { authSession } from '../application/services/auth-session-service.js';
import { showToast } from '../shared/toast.js';
import { i18n } from '../application/services/i18n-service.js';

export class ReportsController {
    constructor(element) {
        this.element = element;
        this.reportService = new ReportDataService();
        this.currentData = []; // Store for CSV export
    }

    async mount() {
        const branch = authSession.getCurrentBranch();
        if (!branch) return;

        this.element.innerHTML = `
            <div class="mf-page-header">
                <div>
                    <h1 class="mf-page-title">${i18n.t('report.title')}</h1>
                    <p class="mf-page-subtitle">${i18n.t('report.subtitle')}</p>
                </div>
                <div>
                    <button class="mf-btn mf-btn-primary" id="btn-export-csv">
                        <span><i class="bi bi-download"></i></span> ${i18n.t('report.export_csv')}
                    </button>
                </div>
            </div>

            <div class="mf-card">
                <div class="mf-card-body">
                    <div class="mf-report-filters">
                        <input type="date" class="mf-input" id="report-date" value="${new Date().toISOString().split('T')[0]}">
                        <select class="mf-input" id="report-filter">
                            <option value="all">${i18n.t('report.filter.all')}</option>
                            <option value="completed">${i18n.t('report.filter.completed')}</option>
                            <option value="breached">${i18n.t('report.filter.breached')}</option>
                        </select>
                        <button class="mf-btn mf-btn-primary" id="btn-load-report">${i18n.t('report.generate')}</button>
                    </div>

                    <div class="mf-table-wrap">
                        <table class="mf-table">
                            <thead>
                                <tr>
                                    <th>${i18n.t('report.col.ticket')}</th>
                                    <th>${i18n.t('report.col.checkin')}</th>
                                    <th>${i18n.t('report.col.end')}</th>
                                    <th>${i18n.t('report.col.wait')}</th>
                                    <th>${i18n.t('report.col.status')}</th>
                                    <th>${i18n.t('report.col.priority')}</th>
                                </tr>
                            </thead>
                            <tbody id="report-table-body">
                                <tr><td colspan="6" class="mf-table-empty">${i18n.t('report.loading')}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('btn-export-csv').addEventListener('click', () => this.exportCsv());
        document.getElementById('btn-load-report').addEventListener('click', () => this.loadReport());

        await this.loadReport();
    }

    async loadReport() {
        const branchId = authSession.getCurrentBranch().id;
        const tbody = document.getElementById('report-table-body');
        const filter = document.getElementById('report-filter').value;
        
        try {
            const visits = await this.reportService.getVisitHistory(branchId);
            
            let filtered = visits;
            if (filter === 'completed') {
                filtered = visits.filter(v => v.status === 'completed');
            } else if (filter === 'breached') {
                // Mock SLA filter
                filtered = visits.filter(v => v.waitTimeMins > 60);
            }

            this.currentData = filtered;

            if (filtered.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" class="mf-table-empty">${i18n.t('report.no_records')}</td></tr>`;
                return;
            }

            tbody.innerHTML = filtered.map(v => `
                <tr>
                    <td class="mf-table-ticket">${v.ticketNumber}</td>
                    <td class="mf-table-time">${new Date(v.checkInTime).toLocaleTimeString()}</td>
                    <td class="mf-table-time mf-table-dimmed">${v.endTime ? new Date(v.endTime).toLocaleTimeString() : '-'}</td>
                    <td class="${v.waitTimeMins > 30 ? 'mf-table-danger' : 'mf-table-time'}">${v.waitTimeMins}</td>
                    <td>
                        <span class="mf-chip" data-status="${v.status}">
                            ${v.status}
                        </span>
                    </td>
                    <td>${v.priorityLevel}</td>
                </tr>
            `).join('');

        } catch (e) {
            tbody.innerHTML = `<tr><td colspan="6" class="mf-table-danger">Failed to load report: ${e.message}</td></tr>`;
        }
    }

    exportCsv() {
        if (!this.currentData || this.currentData.length === 0) {
            showToast('No data to export', 'warning');
            return;
        }

        const headers = ['Ticket', 'Check-in Time', 'End Time', 'Wait Time (mins)', 'Status', 'Priority'];
        
        const rows = this.currentData.map(v => [
            v.ticketNumber,
            new Date(v.checkInTime).toLocaleString(),
            v.endTime ? new Date(v.endTime).toLocaleString() : '',
            v.waitTimeMins,
            v.status,
            v.priorityLevel
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        const dateStr = document.getElementById('report-date').value;
        link.setAttribute('download', `MedicalFlow_Report_${dateStr}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('Export successful', 'success');
    }
}
