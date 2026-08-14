import { globalEventBus } from '../domain/events/event-bus.js';
import { authSession } from '../application/services/auth-session-service.js';
import { i18n } from '../application/services/i18n-service.js';

export class PublicDisplayController {
    constructor(element) {
        this.element = element;
        this.unsubscribeQueue = null;
        this.calledQueues = []; // Limit to recent 5
    }

    async mount() {
        const branch = authSession.getCurrentBranch();
        
        this.element.innerHTML = `
            <div class="mf-pd-container">
                <div class="mf-pd-topbar">
                    <div class="mf-pd-topbar-left">
                        <button onclick="window.location.href='/'" class="mf-btn mf-btn-outline" title="${i18n.t('pd.exit')}">
                            <i class="bi bi-arrow-left"></i> ${i18n.t('pd.exit')}
                        </button>
                        <div>
                            <h1 class="mf-pd-title">${i18n.t('pd.title')} <span class="mf-pd-title-branch">${branch ? '- ' + branch.name : ''}</span></h1>
                            <div class="mf-pd-subtitle">${i18n.t('pd.subtitle')}</div>
                        </div>
                    </div>
                    <div class="mf-pd-clock" id="pd-clock">00:00:00</div>
                </div>

                <div class="mf-pd-grid mf-grid">
                    <div id="pd-current-call" class="mf-pd-calling">
                        <h2 class="mf-pd-calling-label">${i18n.t('pd.now_calling')}</h2>
                        <div id="pd-active-ticket" class="mf-pd-calling-ticket">---</div>
                        <div id="pd-active-room" class="mf-pd-calling-room">${i18n.t('pd.please_wait')}</div>
                        <div class="mf-pd-calling-glow"></div>
                    </div>
                    
                    <div class="mf-pd-sidebar">
                        <h3 class="mf-pd-sidebar-title">${i18n.t('pd.previous_calls')}</h3>
                        <div id="pd-history" class="mf-pd-history">
                            <!-- History items -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        setInterval(() => {
            const now = new Date();
            document.getElementById('pd-clock').textContent = now.toLocaleTimeString();
        }, 1000);

        this.unsubscribeQueue = globalEventBus.subscribe('queue', (event) => {
            if (event.action === 'called' && event.data) {
                this.handleQueueCall(event.data.ticket, event.data.visit);
            }
        });
    }

    handleQueueCall(ticket, visit) {
        if (!ticket) return;
        
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
            oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.5);
        } catch(e) { console.log('Audio blocked', e); }

        const roomName = visit.room ? visit.room.name : i18n.t('pd.please_wait');
        document.getElementById('pd-active-ticket').textContent = ticket.number;
        document.getElementById('pd-active-room').textContent = roomName;

        this.calledQueues.unshift({ number: ticket.number, room: roomName });
        if (this.calledQueues.length > 5) this.calledQueues.pop();

        this.renderHistory();
    }

    renderHistory() {
        const historyContainer = document.getElementById('pd-history');
        historyContainer.innerHTML = '';
        
        this.calledQueues.forEach((q, i) => {
            if (i === 0) return; // Skip the currently calling one (which is index 0)
            
            const el = document.createElement('div');
            el.className = 'mf-pd-history-item';
            
            el.innerHTML = `
                <span class="mf-pd-history-ticket">${q.number}</span>
                <span class="mf-pd-history-room">${q.room}</span>
            `;
            historyContainer.appendChild(el);
        });
    }
}
