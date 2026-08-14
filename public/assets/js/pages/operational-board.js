import { BoardService } from '../application/services/board-service.js';
import { VisitQueueService } from '../application/services/visit-queue-service.js';
import { authSession } from '../application/services/auth-session-service.js';
import { globalEventBus } from '../domain/events/event-bus.js';
import { Drawer } from '../presentation/components/ui-patterns.js';
import { showToast } from '../shared/toast.js';
import { i18n } from '../application/services/i18n-service.js';

export class OperationalBoardController {
    constructor(element) {
        this.element = element;
        this.boardService = new BoardService();
        this.visitQueueService = new VisitQueueService();
        this.unsubscribeVisit = null;
        this.allStates = [];
    }

    async mount() {
        const branch = authSession.getCurrentBranch();
        if (!branch) return;

        this.element.innerHTML = `
            <div class="mf-page-header">
                <div>
                    <h1 class="mf-page-title">${i18n.t('ops.title')}</h1>
                    <p class="mf-page-subtitle">${i18n.t('ops.subtitle')} - ${branch.name}</p>
                </div>
                <div class="mf-header-actions">
                    <button id="board-refresh-btn" class="mf-btn mf-btn-outline">
                        <span><i class="bi bi-arrow-clockwise"></i></span> ${i18n.t('ops.refresh')}
                    </button>
                </div>
            </div>

            <div class="mf-board-container">
                <!-- Kanban Columns will be injected here -->
            </div>
        `;

        document.getElementById('board-refresh-btn').addEventListener('click', () => this.loadBoard());

        this.unsubscribeVisit = globalEventBus.subscribe('visit', () => {
            console.log('Operational Board received visit event, refreshing...');
            this.loadBoard();
        });

        this.allStates = await this.boardService.getAllStates();
        await this.loadBoard();
    }

    async loadBoard() {
        const branchId = authSession.getCurrentBranch().id;
        const container = this.element.querySelector('.mf-board-container');
        
        if (!this.allStates.length) {
            this.allStates = await this.boardService.getAllStates();
        }

        try {
            const activeVisits = await this.boardService.getActiveVisits(branchId);
            
            const columns = {
                'Registered': [],
                'Vitals Triage': [],
                'Consultation Room 1': [],
                'Consultation Room 2': []
            };

            activeVisits.forEach(v => {
                const stateName = v.state ? v.state.name : 'Unknown';
                if (!columns[stateName]) {
                    columns[stateName] = [];
                }
                columns[stateName].push(v);
            });

            container.innerHTML = ''; 

            Object.keys(columns).forEach(colName => {
                const colVisits = columns[colName];
                if (colVisits.length === 0 && colName !== 'Registered' && colName !== 'Vitals Triage') {
                    return;
                }

                const colEl = document.createElement('div');
                colEl.className = 'mf-board-column';

                colEl.innerHTML = `
                    <div class="mf-board-column-header">
                        <span class="mf-board-column-title">${colName}</span>
                        <span class="mf-board-column-count">${colVisits.length}</span>
                    </div>
                    <div class="mf-board-column-body">
                        ${colVisits.length === 0 ? `<div class="mf-board-empty">${i18n.t('ops.no_visits')}</div>` : ''}
                    </div>
                `;

                const bodyEl = colEl.querySelector('.mf-board-column-body');
                colVisits.forEach(visit => {
                    const card = this.createQueueCard(visit);
                    bodyEl.appendChild(card);
                });

                container.appendChild(colEl);
            });

        } catch (e) {
            container.innerHTML = `<div class="mf-error-banner" style="display: block;">Failed to load board: ${e.message}</div>`;
        }
    }

    createQueueCard(visit) {
        const card = document.createElement('div');
        card.className = 'mf-queue-card';
        
        const qNumber = visit.ticket ? visit.ticket.number : '???';
        const patientName = visit.patient ? `${visit.patient.firstName.charAt(0)}*** ${visit.patient.lastName}` : 'Unknown Patient';
        const priority = visit.priorityLevel || 3;
        const priorityLabel = priority === 1 ? 'Emergency' : (priority === 2 ? 'Urgent' : 'Normal');
        const waitMin = Math.floor((new Date() - new Date(visit.checkInTime)) / 60000);
        
        card.setAttribute('data-priority', priority);
        
        card.innerHTML = `
            <div class="mf-queue-card-header">
                <h3 class="mf-queue-number">${qNumber}</h3>
                <span class="mf-chip mf-chip-${priority === 1 ? 'alert' : (priority === 2 ? 'queued' : 'booked')}">${priorityLabel}</span>
            </div>
            <div class="mf-queue-body">
                <div class="mf-queue-patient">${patientName}</div>
                <div class="mf-queue-meta">
                    <span>${i18n.t('ops.wait')}: ${waitMin} ${i18n.t('ops.min')}</span>
                    ${visit.isHold ? `<span class="mf-hold-badge">${i18n.t('ops.on_hold')}</span>` : ''}
                </div>
            </div>
            <div class="mf-queue-footer">
                <button class="mf-btn mf-btn-primary mf-btn-sm action-call mf-queue-action" ${visit.isHold ? 'disabled' : ''}><i class="bi bi-megaphone"></i> ${i18n.t('ops.call_queue')}</button>
            </div>
        `;
        
        card.addEventListener('click', (e) => {
            if (e.target.closest('button')) return; // Ignore if clicked on button
            this.openVisitDrawer(visit);
        });

        card.querySelector('.action-call').addEventListener('click', async (e) => {
            e.stopPropagation();
            try {
                await this.visitQueueService.callQueue(visit.id);
                showToast('Queue called', 'success');
            } catch (err) {
                showToast('Call failed: ' + err.message, 'error');
            }
        });

        return card;
    }

    async openVisitDrawer(visit) {
        // Find next logical state for transition
        const currentStateName = visit.state ? visit.state.name : '';
        let nextStateOptions = this.allStates.filter(s => s.id !== (visit.state && visit.state.id));
        
        // Build state options dropdown
        let stateOptionsHtml = nextStateOptions.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

        const content = `
            <div>
                <div class="mf-visit-header">
                    <div class="mf-visit-ticket-lg">${visit.ticket ? visit.ticket.number : '???'}</div>
                    <div>
                        <div class="mf-visit-patient-name">${visit.patient ? visit.patient.firstName + ' ' + visit.patient.lastName : 'Unknown'}</div>
                        <div class="mf-visit-patient-hn">HN: ${visit.patient ? visit.patient.hn : '-'}</div>
                    </div>
                </div>

                <div class="mf-card mf-visit-section">
                    <h4 class="mf-card-section-title">${i18n.t('ops.state_transition')}</h4>
                    <div class="mf-visit-action-row">
                        <select id="drawer-next-state" class="mf-input">
                            ${stateOptionsHtml}
                        </select>
                        <button id="drawer-btn-transition" class="mf-btn mf-btn-primary">${i18n.t('ops.move')}</button>
                    </div>
                    <div class="mf-visit-actions">
                        <button id="drawer-btn-call" class="mf-btn mf-btn-outline" ${visit.isHold ? 'disabled' : ''}><i class="bi bi-megaphone"></i> ${i18n.t('ops.call')}</button>
                        <button id="drawer-btn-hold" class="mf-btn mf-btn-outline">
                            ${visit.isHold ? `<i class="bi bi-play-circle"></i> ${i18n.t('ops.unhold')}` : `<i class="bi bi-pause-circle"></i> ${i18n.t('ops.hold')}`}
                        </button>
                    </div>
                    <div class="mf-visit-divider"></div>
                    <div>
                        <button id="drawer-btn-end" class="mf-btn mf-btn-danger-outline mf-queue-action"><i class="bi bi-x-circle"></i> ${i18n.t('ops.end_visit')}</button>
                    </div>
                </div>

                <div class="mf-card mf-visit-section">
                    <h4 class="mf-card-section-title">${i18n.t('ops.visit_details')}</h4>
                    <table class="mf-detail-table">
                        <tr><td>${i18n.t('ops.current_state')}</td><td><strong>${currentStateName}</strong></td></tr>
                        <tr><td>${i18n.t('ops.priority')}</td><td>${visit.priorityLevel}</td></tr>
                        <tr><td>Check-in</td><td>${new Date(visit.checkInTime).toLocaleTimeString()}</td></tr>
                    </table>
                </div>
            </div>
        `;

        const drawer = new Drawer();
        drawer.render({
            title: i18n.t('ops.visit_details'),
            content: content,
            onClose: () => {}
        });

        setTimeout(() => {
            const drawerEl = document.querySelector('.mf-drawer');
            if(!drawerEl) return;
            
            drawerEl.querySelector('#drawer-btn-transition').addEventListener('click', async () => {
                const nextStateId = drawerEl.querySelector('#drawer-next-state').value;
                try {
                    await this.visitQueueService.transitionState(visit.id, nextStateId);
                    drawer.close();
                    showToast('State transitioned', 'success');
                } catch(e) { showToast('Transition failed: ' + e.message, 'error'); }
            });

            drawerEl.querySelector('#drawer-btn-call').addEventListener('click', async () => {
                try {
                    await this.visitQueueService.callQueue(visit.id);
                    showToast('Queue called', 'success');
                } catch(e) { showToast('Call failed: ' + e.message, 'error'); }
            });

            drawerEl.querySelector('#drawer-btn-hold').addEventListener('click', async () => {
                try {
                    if (visit.isHold) await this.visitQueueService.unhold(visit.id);
                    else await this.visitQueueService.hold(visit.id, 'User Hold');
                    drawer.close();
                    showToast(visit.isHold ? 'Visit unheld' : 'Visit put on hold', 'success');
                } catch(e) { showToast('Hold action failed: ' + e.message, 'error'); }
            });

            drawerEl.querySelector('#drawer-btn-end').addEventListener('click', async () => {
                try {
                    await this.visitQueueService.endVisit(visit.id);
                    drawer.close();
                    showToast('Visit ended', 'success');
                } catch(e) { showToast('End visit failed: ' + e.message, 'error'); }
            });
        }, 100);
    }
}
