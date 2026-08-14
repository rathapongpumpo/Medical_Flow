import { authSession } from '../application/services/auth-session-service.js';
import { PatientService } from '../application/services/patient-service.js';
import { VisitQueueService } from '../application/services/visit-queue-service.js';
import { showToast } from '../shared/toast.js';
import { i18n } from '../application/services/i18n-service.js';

export class CheckInController {
    constructor(element) {
        this.element = element;
        this.patientService = new PatientService();
        this.visitQueueService = new VisitQueueService();
        this.searchTimeout = null;
    }

    async mount() {
        const branch = authSession.getCurrentBranch();
        if (!branch) return;

        this.element.innerHTML = `
            <div class="mf-page-header">
                <div>
                    <h1 class="mf-page-title">${i18n.t('checkin.title')}</h1>
                    <p class="mf-page-subtitle">${i18n.t('checkin.subtitle')}</p>
                </div>
            </div>
            
            <div class="mf-card mf-mb-4">
                <div class="mf-card-body">
                    <div class="mf-search-row">
                        <div class="mf-search-field">
                            <span class="mf-search-icon"><i class="bi bi-search"></i></span>
                            <input type="text" id="patient-search-input" class="mf-input" placeholder="${i18n.t('checkin.search_placeholder')}">
                        </div>
                        <button id="new-patient-btn" class="mf-btn mf-btn-primary">
                            <i class="bi bi-plus-lg"></i> ${i18n.t('checkin.new_patient')}
                        </button>
                    </div>
                </div>
            </div>

            <div id="patient-results-container">
                <h3>${i18n.t('checkin.search_results')}</h3>
                <div id="patient-results" class="mf-patient-results">
                    <!-- Search results -->
                </div>
            </div>

            <!-- New Patient Modal -->
            <div id="new-patient-modal" class="mf-drawer-overlay">
                <div class="mf-modal">
                    <div class="mf-drawer-header">
                        <h3 class="mf-drawer-title">${i18n.t('checkin.register_title')}</h3>
                        <button id="np-close-icon" class="mf-drawer-close">&times;</button>
                    </div>
                    <div class="mf-drawer-body">
                        <div class="mf-grid">
                            <div class="mf-form-group">
                                <label class="mf-label">${i18n.t('checkin.fname')} <span>*</span></label>
                                <input type="text" id="np-fname" class="mf-input">
                            </div>
                            <div class="mf-form-group">
                                <label class="mf-label">${i18n.t('checkin.lname')} <span>*</span></label>
                                <input type="text" id="np-lname" class="mf-input">
                            </div>
                        </div>
                        <div class="mf-form-group">
                            <label class="mf-label">${i18n.t('checkin.idcard')}</label>
                            <input type="text" id="np-idcard" class="mf-input" placeholder="x-xxxx-xxxxx-xx-x">
                        </div>
                        <div class="mf-grid">
                            <div class="mf-form-group">
                                <label class="mf-label">${i18n.t('checkin.dob')}</label>
                                <input type="date" id="np-dob" class="mf-input">
                            </div>
                            <div class="mf-form-group">
                                <label class="mf-label">${i18n.t('checkin.gender')}</label>
                                <select id="np-gender" class="mf-input">
                                    <option value="M">${i18n.t('checkin.gender.m')}</option>
                                    <option value="F">${i18n.t('checkin.gender.f')}</option>
                                    <option value="U">${i18n.t('checkin.gender.u')}</option>
                                </select>
                            </div>
                        </div>
                        <div id="np-error" class="mf-error-banner"></div>
                    </div>
                    <div class="mf-drawer-footer">
                        <button id="np-cancel-btn" class="mf-btn mf-btn-secondary">${i18n.t('checkin.cancel')}</button>
                        <button id="np-save-btn" class="mf-btn mf-btn-primary">${i18n.t('checkin.save')}</button>
                    </div>
                </div>
            </div>

            <!-- Check-in Success Modal -->
            <div id="ticket-modal" class="mf-drawer-overlay">
                <div class="mf-modal">
                    <div class="mf-drawer-header">
                        <h3 class="mf-drawer-title">${i18n.t('checkin.success_title')}</h3>
                    </div>
                    <div class="mf-drawer-body">
                        <p class="mf-ticket-label">${i18n.t('checkin.queue_number')}</p>
                        <h1 id="ticket-number" class="mf-ticket-number">A000</h1>
                        
                        <div class="mf-ticket-summary">
                            <div class="mf-ticket-row">
                                <span class="mf-ticket-row-label">${i18n.t('checkin.patient')}</span>
                                <strong id="ticket-patient-name"></strong>
                            </div>
                            <div class="mf-ticket-row">
                                <span class="mf-ticket-row-label">${i18n.t('checkin.hn')}</span>
                                <span id="ticket-patient-hn"></span>
                            </div>
                        </div>
                        
                        <button id="ticket-close-btn" class="mf-btn mf-btn-primary">${i18n.t('checkin.done')}</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('patient-results-container').style.display = 'none';
        document.getElementById('new-patient-modal').style.display = 'none';
        document.getElementById('np-error').style.display = 'none';
        document.getElementById('ticket-modal').style.display = 'none';

        this.bindEvents();
        // Initial empty state
        this.renderEmptyState(i18n.t('checkin.search_placeholder'));
    }

    bindEvents() {
        const searchInput = document.getElementById('patient-search-input');
        
        // Debounce search
        searchInput.addEventListener('input', (e) => {
            if (this.searchTimeout) clearTimeout(this.searchTimeout);
            
            const val = e.target.value.trim();
            if (val.length === 0) {
                this.renderEmptyState(i18n.t('checkin.search_placeholder'));
                return;
            }
            
            if (val.length < 2) return; // Wait for at least 2 chars
            
            this.searchTimeout = setTimeout(() => {
                this.handleSearch(val);
            }, 300);
        });

        const newPatientModal = document.getElementById('new-patient-modal');
        document.getElementById('new-patient-btn').addEventListener('click', () => {
            newPatientModal.style.display = 'flex';
            document.getElementById('np-fname').focus();
        });
        
        const closeNpModal = () => {
            newPatientModal.style.display = 'none';
            document.getElementById('np-error').style.display = 'none';
        };
        
        document.getElementById('np-cancel-btn').addEventListener('click', closeNpModal);
        document.getElementById('np-close-icon').addEventListener('click', closeNpModal);
        
        document.getElementById('np-save-btn').addEventListener('click', () => this.handleCreatePatient());
        
        document.getElementById('ticket-close-btn').addEventListener('click', () => {
            document.getElementById('ticket-modal').style.display = 'none';
            document.getElementById('patient-search-input').value = '';
            this.renderEmptyState(i18n.t('checkin.search_placeholder'));
            document.getElementById('patient-search-input').focus();
        });
    }

    renderEmptyState(message) {
        document.getElementById('patient-results-container').style.display = 'block';
        document.getElementById('patient-results').innerHTML = `
            <div class="mf-empty-state">
                <div class="mf-empty-icon"><i class="bi bi-hospital"></i></div>
                <p>${message}</p>
            </div>
        `;
    }

    renderLoadingState() {
        document.getElementById('patient-results-container').style.display = 'block';
        document.getElementById('patient-results').innerHTML = `
            <div class="mf-empty-state">
                <p>${i18n.t('checkin.searching')}</p>
            </div>
        `;
    }

    async handleSearch(query) {
        this.renderLoadingState();
        try {
            const results = await this.patientService.search(query);
            if (results.length === 0) {
                this.renderEmptyState(`No patients found matching "<b>${query}</b>".`);
                return;
            }

            const resultsContainer = document.getElementById('patient-results');
            resultsContainer.innerHTML = '';
            
            results.forEach(p => {
                const card = document.createElement('div');
                card.className = 'mf-patient-result';
                
                // Masking ID logic for Demo
                const maskedId = p.idCard ? p.idCard.substring(0, 3) + 'XXXXXXX' + p.idCard.slice(-3) : '-';
                
                card.innerHTML = `
                    <div class="mf-patient-info-row">
                        <div class="mf-patient-avatar">
                            ${p.firstName.charAt(0)}${p.lastName.charAt(0)}
                        </div>
                        <div>
                            <div class="mf-patient-name">
                                ${p.firstName} ${p.lastName} <span class="mf-patient-gender">${p.gender || 'U'}</span>
                            </div>
                            <div class="mf-patient-meta">
                                <span><strong>HN:</strong> ${p.hn || 'Pending'}</span>
                                <span><strong>ID:</strong> ${maskedId}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button class="mf-btn mf-btn-primary checkin-btn" data-id="${p.id}">
                            ${i18n.t('checkin.walkin_btn')}
                        </button>
                    </div>
                `;
                resultsContainer.appendChild(card);
            });

            // Bind checkin buttons
            resultsContainer.querySelectorAll('.checkin-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    await this.handleCheckIn(id, results.find(p => p.id === id));
                });
            });

        } catch (e) {
            this.renderEmptyState(`Search error: ${e.message}`);
        }
    }

    async handleCreatePatient() {
        const fnameInput = document.getElementById('np-fname');
        const lnameInput = document.getElementById('np-lname');
        const idcardInput = document.getElementById('np-idcard');
        const dobInput = document.getElementById('np-dob');
        const genderInput = document.getElementById('np-gender');
        const errorDiv = document.getElementById('np-error');

        const fname = fnameInput.value.trim();
        const lname = lnameInput.value.trim();
        
        if (!fname || !lname) {
            errorDiv.textContent = 'First Name and Last Name are required.';
            errorDiv.style.display = 'block';
            return;
        }

        try {
            const btn = document.getElementById('np-save-btn');
            btn.textContent = 'Saving...';
            btn.disabled = true;
            
            const newPatient = await this.patientService.create({
                firstName: fname,
                lastName: lname,
                idCard: idcardInput.value.trim(),
                dob: dobInput.value || null,
                gender: genderInput.value
            });

            document.getElementById('new-patient-modal').style.display = 'none';
            
            // Clean form
            fnameInput.value = '';
            lnameInput.value = '';
            idcardInput.value = '';
            
            // Immediately check-in
            await this.handleCheckIn(newPatient.id, newPatient);
            
        } catch (e) {
            errorDiv.textContent = 'Failed to create patient: ' + e.message;
            errorDiv.style.display = 'block';
        } finally {
            const btn = document.getElementById('np-save-btn');
            btn.textContent = i18n.t('checkin.save');
            btn.disabled = false;
        }
    }

    async handleCheckIn(patientId, patient) {
        const branchId = authSession.getCurrentBranch().id;
        try {
            const { ticket } = await this.visitQueueService.checkIn(patientId, null, branchId);
            
            document.getElementById('ticket-number').textContent = ticket.number;
            document.getElementById('ticket-patient-name').textContent = `${patient.firstName} ${patient.lastName}`;
            document.getElementById('ticket-patient-hn').textContent = patient.hn || 'Pending';
            document.getElementById('ticket-modal').style.display = 'flex';
        } catch (e) {
            showToast('Check-in failed: ' + e.message);
        }
    }
}
