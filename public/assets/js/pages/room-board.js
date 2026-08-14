import { BoardService } from '../application/services/board-service.js';
import { VisitQueueService } from '../application/services/visit-queue-service.js';
import { authSession } from '../application/services/auth-session-service.js';
import { globalEventBus } from '../domain/events/event-bus.js';
import { ModalDialog } from '../presentation/components/ui-patterns.js';
import { showToast } from '../shared/toast.js';
import { i18n } from '../application/services/i18n-service.js';

export class RoomBoardController {
    constructor(element) {
        this.element = element;
        this.boardService = new BoardService();
        this.visitQueueService = new VisitQueueService();
        this.unsubscribeVisit = null;
        this.rooms = [];
        this.providers = [];
        this.activeVisits = [];
    }

    async mount() {
        const branch = authSession.getCurrentBranch();
        if (!branch) return;

        this.element.innerHTML = `
            <div class="mf-page-header">
                <div>
                    <h1 class="mf-page-title">${i18n.t('room.title')}</h1>
                    <p class="mf-page-subtitle">${i18n.t('room.subtitle')} - ${branch.name}</p>
                </div>
                <div class="mf-header-actions">
                    <button id="rb-refresh-btn" class="mf-btn mf-btn-outline">
                        <span><i class="bi bi-arrow-clockwise"></i></span> ${i18n.t('room.refresh')}
                    </button>
                </div>
            </div>

            <div id="rb-container" class="mf-room-grid">
                <!-- Rooms will be rendered here -->
            </div>
        `;

        document.getElementById('rb-refresh-btn').addEventListener('click', () => this.loadBoard());

        this.unsubscribeVisit = globalEventBus.subscribe('visit', () => {
            this.loadBoard();
        });

        await this.loadBoard();
    }

    async loadBoard() {
        const branchId = authSession.getCurrentBranch().id;
        const container = document.getElementById('rb-container');
        container.innerHTML = `<div class="mf-board-empty">Loading rooms...</div>`;

        try {
            this.rooms = await this.boardService.getRooms(branchId);
            this.providers = await this.boardService.getProviders();
            this.activeVisits = await this.boardService.getActiveVisits(branchId);

            container.innerHTML = '';

            if (this.rooms.length === 0) {
                container.innerHTML = '<div class="mf-card mf-card-body">No rooms configured.</div>';
                return;
            }

            this.rooms.forEach(room => {
                // Find if any visit is occupying this room
                const occupyingVisit = this.activeVisits.find(v => v.currentRoomId === room.id);
                
                const card = document.createElement('div');
                card.className = 'mf-room-card';
                
                const isOccupied = !!occupyingVisit;
                const statusHtml = isOccupied 
                    ? `<span class="mf-room-status mf-room-status--occupied">${i18n.t('room.occupied')}</span>`
                    : `<span class="mf-room-status mf-room-status--available">${i18n.t('room.available')}</span>`;
                
                let bodyContent = '';
                if (isOccupied) {
                    const ticket = occupyingVisit.ticket ? occupyingVisit.ticket.number : 'Unknown';
                    const patientName = occupyingVisit.patient ? `${occupyingVisit.patient.firstName} ${occupyingVisit.patient.lastName}` : '';
                    const providerName = occupyingVisit.provider ? occupyingVisit.provider.name : `<span class="mf-unassigned-badge">${i18n.t('room.unassigned_provider')}</span>`;
                    
                    bodyContent = `
                        <div class="mf-room-ticket-lg">${ticket}</div>
                        <div class="mf-room-patient-name">${patientName}</div>
                        <div class="mf-room-provider">
                            <i class="bi bi-person-badge"></i> ${providerName}
                        </div>
                    `;
                } else {
                    bodyContent = `<div class="mf-room-empty">${i18n.t('room.no_active_visit')}</div>`;
                }

                const headerClass = isOccupied ? 'mf-room-header--occupied' : 'mf-room-header--available';

                card.innerHTML = `
                    <div class="mf-room-header ${headerClass}">
                        <strong class="mf-room-name">${room.name}</strong>
                        ${statusHtml}
                    </div>
                    <div class="mf-room-body">
                        ${bodyContent}
                    </div>
                    <div class="mf-room-footer">
                        ${isOccupied 
                            ? `<button class="mf-btn mf-btn-outline mf-btn-sm action-provider mf-queue-action">${i18n.t('room.set_provider')}</button>` 
                            : `<button class="mf-btn mf-btn-primary mf-btn-sm action-assign mf-queue-action">${i18n.t('room.assign_visit')}</button>`
                        }
                    </div>
                `;

                if (isOccupied) {
                    card.querySelector('.action-provider').addEventListener('click', () => this.openProviderModal(occupyingVisit));
                } else {
                    card.querySelector('.action-assign').addEventListener('click', () => this.openAssignModal(room));
                }

                container.appendChild(card);
            });

        } catch (e) {
            container.innerHTML = `<div class="mf-error-banner" style="display: block;">Failed to load rooms: ${e.message}</div>`;
        }
    }

    openAssignModal(room) {
        // Filter visits that do not have a room yet
        const unassignedVisits = this.activeVisits.filter(v => !v.currentRoomId);
        
        let selectHtml = '<select id="assign-visit-select" class="mf-input">';
        selectHtml += `<option value="">${i18n.t('common.select')}</option>`;
        unassignedVisits.forEach(v => {
            const label = `${v.ticket ? v.ticket.number : '?'} - ${v.patient ? v.patient.firstName : 'Unknown'} (${v.state ? v.state.name : ''})`;
            selectHtml += `<option value="${v.id}">${label}</option>`;
        });
        selectHtml += '</select>';

        if (unassignedVisits.length === 0) {
            selectHtml = '<div class="mf-card mf-card-body mf-mb-3 mf-text-center">No unassigned visits available in the queue.</div>';
        }

        const modal = new ModalDialog();
        modal.render({
            title: `${i18n.t('room.assign_visit_title')} ${room.name}`,
            content: `
                <p class="mf-modal-message">${i18n.t('room.assign_visit_msg')}</p>
                <div class="mf-visit-action-row">${selectHtml}</div>
            `,
            actions: [
                { label: i18n.t('common.cancel'), onExecute: () => modal.close() },
                { 
                    label: i18n.t('common.save'), 
                    isPrimary: true, 
                    onExecute: async () => {
                        const select = document.getElementById('assign-visit-select');
                        if (!select || !select.value) return;
                        try {
                            await this.visitQueueService.assignRoom(select.value, room.id);
                            modal.close();
                            showToast('Visit assigned successfully', 'success');
                            // EventBus will auto-refresh
                        } catch (e) { showToast('Assign failed: ' + e.message, 'error'); }
                    }
                }
            ]
        });
    }

    openProviderModal(visit) {
        let selectHtml = '<select id="assign-provider-select" class="mf-input">';
        selectHtml += `<option value="">${i18n.t('common.select')}</option>`;
        this.providers.forEach(p => {
            const selected = visit.currentProviderId === p.id ? 'selected' : '';
            selectHtml += `<option value="${p.id}" ${selected}>${p.name}</option>`;
        });
        selectHtml += '</select>';

        const modal = new ModalDialog();
        modal.render({
            title: `${i18n.t('room.assign_provider_title')} ${visit.ticket ? visit.ticket.number : ''}`,
            content: `
                <p class="mf-modal-message">${i18n.t('room.assign_provider_msg')}</p>
                <div class="mf-visit-action-row">${selectHtml}</div>
            `,
            actions: [
                { label: i18n.t('common.cancel'), onExecute: () => modal.close() },
                { 
                    label: i18n.t('common.save'), 
                    isPrimary: true, 
                    onExecute: async () => {
                        const select = document.getElementById('assign-provider-select');
                        if (!select || !select.value) return;
                        try {
                            await this.visitQueueService.assignProvider(visit.id, select.value);
                            modal.close();
                            showToast('Provider assigned successfully', 'success');
                        } catch (e) { showToast('Assign failed: ' + e.message, 'error'); }
                    }
                }
            ]
        });
    }
}
