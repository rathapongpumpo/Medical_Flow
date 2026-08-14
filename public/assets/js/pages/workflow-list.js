import { storage } from '../infrastructure/storage-selector.js';
import { WorkflowRepository } from '../infrastructure/repositories/workflow-repository.js';
import { StateRepository } from '../infrastructure/repositories/state-repository.js';
import { showToast } from '../shared/toast.js';
import { i18n } from '../application/services/i18n-service.js';

export class WorkflowListController {
    constructor(element) {
        this.element = element;
        this.workflowRepo = null;
        this.stateRepo = null;
    }

    async _initRepos() {
        const adapter = await storage.getAdapter();
        this.workflowRepo = new WorkflowRepository(adapter);
        this.stateRepo = new StateRepository(adapter);
    }

    async mount() {
        await this._initRepos();

        this.element.innerHTML = `
            <div class="mf-page-header">
                <div>
                    <h1 class="mf-page-title">${i18n.t('workflow.title')}</h1>
                    <p class="mf-page-subtitle">${i18n.t('workflow.subtitle')}</p>
                </div>
                <div>
                    <button class="mf-btn mf-btn-primary" id="btn-new-workflow">
                        <span><i class="bi bi-plus-lg"></i></span> ${i18n.t('workflow.new')}
                    </button>
                </div>
            </div>

            <div id="wf-container" class="mf-wf-list">
                <div class="mf-table-empty">Loading workflows...</div>
            </div>

            <!-- New Workflow Modal -->
            <div class="mf-dialog-overlay" id="wf-modal" style="display: none;">
                <div class="mf-dialog">
                    <div class="mf-dialog-header">
                        <h2 class="mf-dialog-title">${i18n.t('workflow.new_title')}</h2>
                        <button class="mf-icon-btn" id="wf-modal-close"><i class="bi bi-x-lg"></i></button>
                    </div>
                    <div class="mf-dialog-body">
                        <div class="mf-form-group">
                            <label class="mf-label">${i18n.t('workflow.name')}</label>
                            <input type="text" class="mf-input" id="wf-name" placeholder="${i18n.t('workflow.name')}">
                        </div>
                        <div class="mf-form-group">
                            <label class="mf-label">${i18n.t('workflow.desc')}</label>
                            <input type="text" class="mf-input" id="wf-desc" placeholder="${i18n.t('workflow.desc')}">
                        </div>
                        <p class="mf-text-dimmed" style="font-size: 13px; margin-top: 10px;">${i18n.t('workflow.states_desc')}</p>
                    </div>
                    <div class="mf-dialog-footer">
                        <button class="mf-btn mf-btn-outline" id="btn-cancel-wf">${i18n.t('common.cancel')}</button>
                        <button class="mf-btn mf-btn-primary" id="btn-save-wf">${i18n.t('common.save')}</button>
                    </div>
                </div>
            </div>
            <!-- Edit States Modal -->
            <div class="mf-dialog-overlay" id="edit-states-modal" style="display: none;">
                <div class="mf-dialog">
                    <div class="mf-dialog-header">
                        <h2 class="mf-dialog-title">${i18n.t('workflow.edit_states_title')}</h2>
                        <button class="mf-icon-btn" id="edit-states-modal-close"><i class="bi bi-x-lg"></i></button>
                    </div>
                    <div class="mf-dialog-body">
                        <div id="edit-states-list" style="margin-bottom: var(--space-4);"></div>
                        
                        <div class="mf-card p-3" style="background: var(--md-sys-color-surface-container-highest);">
                            <h4 class="mf-wf-states-title" style="margin-top: 0;">${i18n.t('workflow.add_state')}</h4>
                            <div class="mf-grid" style="grid-template-columns: 1fr; gap: var(--space-3);">
                                <input type="text" class="mf-input" id="new-state-name" placeholder="${i18n.t('workflow.state_name')}">
                                <div style="display: flex; gap: var(--space-4);">
                                    <label style="display: flex; align-items: center; gap: var(--space-2);">
                                        <input type="checkbox" id="new-state-room"> ${i18n.t('workflow.needs_room')}
                                    </label>
                                    <label style="display: flex; align-items: center; gap: var(--space-2);">
                                        <input type="checkbox" id="new-state-provider"> ${i18n.t('workflow.needs_provider')}
                                    </label>
                                </div>
                                <button class="mf-btn mf-btn-primary mf-btn-sm" id="btn-add-state">${i18n.t('workflow.add_state')}</button>
                            </div>
                        </div>
                    </div>
                    <div class="mf-dialog-footer">
                        <button class="mf-btn mf-btn-primary" id="btn-done-edit-states">${i18n.t('checkin.done')}</button>
                    </div>
                </div>
            </div>
        `;

        const modal = document.getElementById('wf-modal');
        
        document.getElementById('btn-new-workflow').addEventListener('click', () => {
            modal.style.display = 'flex';
        });
        
        const closeModal = () => {
            modal.style.display = 'none';
            document.getElementById('wf-name').value = '';
            document.getElementById('wf-desc').value = '';
        };

        document.getElementById('wf-modal-close').addEventListener('click', closeModal);
        document.getElementById('btn-cancel-wf').addEventListener('click', closeModal);
        
        document.getElementById('btn-save-wf').addEventListener('click', async () => {
            const name = document.getElementById('wf-name').value;
            const desc = document.getElementById('wf-desc').value;
            if (!name) {
                showToast('Name is required', 'error');
                return;
            }
            
            try {
                await this.workflowRepo.create({
                    id: 'wf-' + Date.now(),
                    name: name,
                    description: desc
                });
                showToast(i18n.t('workflow.save_success'), 'success');
                closeModal();
                this.loadWorkflows();
            } catch (e) {
                showToast(e.message, 'error');
            }
        });

        document.getElementById('edit-states-modal-close').addEventListener('click', () => {
            document.getElementById('edit-states-modal').style.display = 'none';
        });
        document.getElementById('btn-done-edit-states').addEventListener('click', () => {
            document.getElementById('edit-states-modal').style.display = 'none';
        });

        // "Add State" button logic will be handled inside openEditStatesModal since it needs wf context
        this._addStateListener = null;

        await this.loadWorkflows();
    }

    openEditStatesModal(wf, wfStates) {
        const modal = document.getElementById('edit-states-modal');
        const listContainer = document.getElementById('edit-states-list');
        const btnAdd = document.getElementById('btn-add-state');
        const inputName = document.getElementById('new-state-name');
        const cbRoom = document.getElementById('new-state-room');
        const cbProvider = document.getElementById('new-state-provider');

        // Render current states
        const renderStates = (states) => {
            if (states.length === 0) {
                listContainer.innerHTML = '<div class="mf-text-dimmed">No states configured.</div>';
                return;
            }
            listContainer.innerHTML = states.map(s => `
                <div class="mf-state-item" style="margin-bottom: 8px;">
                    <div class="mf-state-order">${s.orderIndex}</div>
                    <div class="mf-state-name">${s.name}</div>
                    <div class="mf-state-flags">
                        ${s.requireRoom ? `<i class="bi bi-building"></i>` : ''} 
                        ${s.requireProvider ? `<i class="bi bi-person-badge"></i>` : ''}
                    </div>
                </div>
            `).join('');
        };

        renderStates(wfStates);

        // Remove old listener if exists
        if (this._addStateListener) {
            btnAdd.removeEventListener('click', this._addStateListener);
        }

        this._addStateListener = async () => {
            const name = inputName.value.trim();
            if (!name) {
                showToast('State name is required', 'warning');
                return;
            }

            try {
                const nextOrder = wfStates.length > 0 ? Math.max(...wfStates.map(s => s.orderIndex)) + 1 : 1;
                const newState = {
                    id: 'st-' + Date.now(),
                    workflowDefinitionId: wf.id,
                    name: name,
                    orderIndex: nextOrder,
                    requireRoom: cbRoom.checked,
                    requireProvider: cbProvider.checked,
                    isEndState: false
                };

                await this.stateRepo.create(newState);
                wfStates.push(newState);
                renderStates(wfStates);
                
                // Clear inputs
                inputName.value = '';
                cbRoom.checked = false;
                cbProvider.checked = false;

                // Refresh the background workflow list
                this.loadWorkflows();
                showToast('State added', 'success');
            } catch (e) {
                showToast(e.message, 'error');
            }
        };

        btnAdd.addEventListener('click', this._addStateListener);
        modal.style.display = 'flex';
    }

    async loadWorkflows() {
        try {
            const workflows = await this.workflowRepo.findAll();
            const states = await this.stateRepo.findAll();
            
            const container = document.getElementById('wf-container');
            container.innerHTML = '';

            if (workflows.length === 0) {
                container.innerHTML = '<div class="mf-card p-4 text-center">No workflows configured.</div>';
                return;
            }

            workflows.forEach(wf => {
                const card = document.createElement('div');
                card.className = 'mf-wf-card mf-card';
                
                const wfStates = states.filter(s => s.workflowDefinitionId === wf.id).sort((a,b) => a.orderIndex - b.orderIndex);
                
                let statesHtml = wfStates.map(s => `
                    <div class="mf-state-item">
                        <div class="mf-state-order">
                            ${s.orderIndex}
                        </div>
                        <div class="mf-state-name">${s.name}</div>
                        <div class="mf-state-flags">
                            ${s.requireRoom ? `<i class="bi bi-building"></i> ${i18n.t('workflow.needs_room')}` : ''} 
                            ${s.requireProvider ? `<i class="bi bi-person-badge"></i> ${i18n.t('workflow.needs_provider')}` : ''}
                        </div>
                    </div>
                `).join('');

                card.innerHTML = `
                    <div class="mf-wf-header">
                        <div>
                            <h3 class="mf-wf-title">${wf.name}</h3>
                            <div class="mf-wf-desc">${wf.description || 'No description'}</div>
                        </div>
                        <div>
                            <span class="mf-badge mf-badge-active">${i18n.t('workflow.active')}</span>
                        </div>
                    </div>
                    <div>
                        <h4 class="mf-wf-states-title">${i18n.t('workflow.configured_states')}</h4>
                        ${statesHtml || '<div class="mf-table-empty">No states defined</div>'}
                    </div>
                    <div class="mf-wf-footer">
                        <button class="mf-btn mf-btn-outline mf-btn-sm btn-edit-states">${i18n.t('workflow.edit_states')}</button>
                    </div>
                `;

                const editBtn = card.querySelector('.btn-edit-states');
                if (editBtn) {
                    editBtn.addEventListener('click', () => {
                        this.openEditStatesModal(wf, wfStates);
                    });
                }

                container.appendChild(card);
            });

        } catch (e) {
            document.getElementById('wf-container').innerHTML = `<div class="mf-table-danger">Error loading workflows: ${e.message}</div>`;
        }
    }
}
