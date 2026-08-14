// public/assets/js/presentation/page-resolver.js
import { registry } from './registry.js';
import { logger } from '../shared/logger.js';

export class PageControllerResolver {
    constructor(rootElementId) {
        this.rootElement = document.getElementById(rootElementId);
    }

    async resolveAndMount() {
        if (!this.rootElement) {
            logger.error('Root element not found. Cannot mount page controller.');
            return;
        }

        // Look for data-controller
        const routeShell = this.rootElement.querySelector('[data-controller]');
        if (!routeShell) {
            logger.info('No controller container found. Assuming static page or no controller needed.');
            return;
        }

        const routeId = routeShell.getAttribute('data-controller');
        if (!routeId) {
            logger.error('Controller container found but data-controller is empty.');
            return;
        }

        const ControllerFactory = registry.getController(routeId);
        
        if (!ControllerFactory) {
            logger.warn(`No controller registered for route: ${routeId}. The page will remain static.`);
            return;
        }

        try {
            logger.info(`Mounting controller for route: ${routeId}`);
            const controller = new ControllerFactory(routeShell);
            if (typeof controller.mount === 'function') {
                await controller.mount();
            } else {
                logger.warn(`Controller for ${routeId} does not have a mount() method.`);
            }
        } catch (error) {
            logger.error(`Failed to mount controller for route: ${routeId}`, error);
            // Re-throw to be caught by Global Error Boundary if it's severe enough
            throw error;
        }
    }
}
