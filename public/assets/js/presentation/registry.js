// public/assets/js/presentation/registry.js
import { logger } from '../shared/logger.js';

export class ModuleRegistry {
    constructor() {
        this.controllers = new Map();
    }

    register(routeId, controllerFactory) {
        if (this.controllers.has(routeId)) {
            logger.warn(`Controller for route '${routeId}' is already registered and will be overwritten.`);
        }
        this.controllers.set(routeId, controllerFactory);
        logger.info(`Registered controller for route: ${routeId}`);
    }

    getController(routeId) {
        return this.controllers.get(routeId);
    }
}

export const registry = new ModuleRegistry();
