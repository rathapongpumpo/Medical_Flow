import { IdGenerator } from '../../shared/id-generator.js';

export class AuditService {
    constructor(auditRepository) {
        this.repository = auditRepository;
        this.sensitiveFields = ['idCard', 'phone', 'address', 'password'];
    }

    _maskSensitiveData(obj) {
        if (!obj) return obj;
        if (typeof obj !== 'object') return obj;

        const masked = { ...obj };
        for (const key of Object.keys(masked)) {
            if (this.sensitiveFields.includes(key) && masked[key]) {
                // If it's a string longer than 4, keep last 4 chars
                if (typeof masked[key] === 'string' && masked[key].length > 4) {
                    masked[key] = '***' + masked[key].substring(masked[key].length - 4);
                } else {
                    masked[key] = '***MASKED***';
                }
            } else if (typeof masked[key] === 'object' && masked[key] !== null) {
                masked[key] = this._maskSensitiveData(masked[key]);
            }
        }
        return masked;
    }

    _computeDiff(before, after) {
        const maskedBefore = this._maskSensitiveData(before);
        const maskedAfter = this._maskSensitiveData(after);

        if (!maskedBefore) return { after: maskedAfter };
        if (!maskedAfter) return { before: maskedBefore };

        const diff = {};
        const allKeys = new Set([...Object.keys(maskedBefore), ...Object.keys(maskedAfter)]);
        
        for (const key of allKeys) {
            const bVal = maskedBefore[key];
            const aVal = maskedAfter[key];
            
            if (JSON.stringify(bVal) !== JSON.stringify(aVal)) {
                diff[key] = {
                    before: bVal,
                    after: aVal
                };
            }
        }
        return diff;
    }

    async record(action, entityType, entityId, beforeState, afterState, userId = 'system', reason = '') {
        const diff = this._computeDiff(beforeState, afterState);
        
        // If there's no diff and it's an update, skip recording?
        // Let's record anyway if action explicitly called, but usually we filter empty diffs out in the caller.
        if (action === 'UPDATE' && Object.keys(diff).length === 0) {
            return null;
        }

        const auditLog = {
            id: IdGenerator.generateCommandId(),
            action,
            entityType,
            entityId,
            diff,
            userId,
            reason,
            createdAt: new Date().toISOString()
        };

        await this.repository.create(auditLog);
        return auditLog;
    }

    async queryByEntity(entityId) {
        if (typeof this.repository.findAll === 'function') {
            const all = await this.repository.findAll();
            return all.filter(log => log.entityId === entityId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return [];
    }
}
