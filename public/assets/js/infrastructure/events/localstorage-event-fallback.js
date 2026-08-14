export class LocalStorageEventFallback {
    constructor(keyName = 'mfq_events_fallback') {
        this.keyName = keyName;
        this.receiveCallback = null;

        if (typeof window !== 'undefined') {
            window.addEventListener('storage', (e) => {
                if (e.key === this.keyName && e.newValue) {
                    try {
                        const event = JSON.parse(e.newValue);
                        if (this.receiveCallback) {
                            this.receiveCallback(event);
                        }
                    } catch (err) {
                        console.error('LocalStorage Event Fallback parse error:', err);
                    }
                }
            });
        }
    }

    onReceive(callback) {
        this.receiveCallback = callback;
    }

    broadcast(event) {
        if (typeof window !== 'undefined' && window.localStorage) {
            try {
                window.localStorage.setItem(this.keyName, JSON.stringify(event));
                // We don't remove it immediately because other tabs might not have caught it yet,
                // but setting a new item overwrites it which is fine.
                // However, to ensure rapid sequential events fire the 'storage' event,
                // we can append a random string to the payload wrapper, or just use a timestamp.
                // Since the event object itself changes (eventId), JSON stringification will be different.
            } catch (err) {
                console.error('LocalStorage Event Fallback broadcast error:', err);
            }
        }
    }
}
