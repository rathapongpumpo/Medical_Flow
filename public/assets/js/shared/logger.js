// public/assets/js/shared/logger.js

import { clock } from './clock.js';

export class Logger {
    constructor() {
        this.level = 'info';
    }

    generateCorrelationId() {
        return 'CID-' + clock.getTimestampMs().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
    }

    info(message, context = {}) {
        if (this._shouldLog('info')) {
            console.info(`[INFO] ${message}`, this._formatContext(context));
        }
    }

    warn(message, context = {}) {
        if (this._shouldLog('warn')) {
            console.warn(`[WARN] ${message}`, this._formatContext(context));
        }
    }

    error(message, errorOrContext = {}, additionalContext = {}) {
        if (this._shouldLog('error')) {
            const isError = errorOrContext instanceof Error;
            const context = isError ? additionalContext : errorOrContext;
            const errorObj = isError ? errorOrContext : null;
            
            const cid = context.correlationId || this.generateCorrelationId();
            const finalContext = { ...context, correlationId: cid };
            
            console.error(`[ERROR] [${cid}] ${message}`, this._formatContext(finalContext), errorObj);
            
            return cid;
        }
        return 'CID-SILENT';
    }

    _shouldLog(level) {
        const levels = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(level) >= levels.indexOf(this.level);
    }

    _formatContext(context) {
        return Object.keys(context).length > 0 ? context : '';
    }
}

export const logger = new Logger();
