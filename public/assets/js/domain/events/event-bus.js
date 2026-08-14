import { IdGenerator } from '../../shared/id-generator.js';

export class DomainEvent {
    constructor(entityType, entityId, entityVersion, eventType, payload) {
        this.eventId = IdGenerator.generateCommandId();
        this.entityType = entityType;
        this.entityId = entityId;
        this.entityVersion = entityVersion || 1;
        this.eventType = eventType;
        this.payload = payload;
        this.occurredAt = new Date().toISOString();
    }
}

export class EventBus {
    constructor() {
        this.subscribers = new Map();
        this.processedEvents = new Set(); // For deduplication
        this.adapters = [];
    }

    /**
     * Subscribe to a specific entity type or '*' for all
     */
    subscribe(entityType, callback) {
        if (!this.subscribers.has(entityType)) {
            this.subscribers.set(entityType, []);
        }
        this.subscribers.get(entityType).push(callback);
        
        return () => {
            const list = this.subscribers.get(entityType);
            this.subscribers.set(entityType, list.filter(cb => cb !== callback));
        };
    }

    /**
     * Register an external adapter (e.g. BroadcastChannel, LocalStorage)
     */
    registerAdapter(adapter) {
        this.adapters.push(adapter);
        adapter.onReceive((event) => this.publishInternal(event, false));
    }

    /**
     * Publish an event locally and to external adapters
     */
    publish(event) {
        this.publishInternal(event, true);
    }

    /**
     * Internal publish handles deduplication and routing
     * @param {DomainEvent} event 
     * @param {boolean} broadcast Should this be sent to adapters?
     */
    publishInternal(event, broadcast = false) {
        if (!event || !event.eventId) return;

        // Deduplication
        if (this.processedEvents.has(event.eventId)) {
            return;
        }

        // Keep set size manageable (simple LRU logic by clearing occasionally or just limit size)
        if (this.processedEvents.size > 1000) {
            const arr = Array.from(this.processedEvents);
            this.processedEvents = new Set(arr.slice(500));
        }
        
        this.processedEvents.add(event.eventId);

        // Notify local subscribers
        const notify = (type) => {
            if (this.subscribers.has(type)) {
                this.subscribers.get(type).forEach(cb => {
                    try { cb(event); } catch (e) { console.error('Event subscriber error:', e); }
                });
            }
        };

        notify(event.entityType);
        notify('*');

        // Broadcast to other tabs if requested
        if (broadcast) {
            this.adapters.forEach(adapter => {
                try {
                    adapter.broadcast(event);
                } catch (e) {
                    console.error('Event adapter broadcast error:', e);
                }
            });
        }
    }
}

export const globalEventBus = new EventBus();
