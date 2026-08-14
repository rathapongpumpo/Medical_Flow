export class BaseEntity {
    constructor(data = {}) {
        this.id = data.id || null;
        this.createdAt = data.createdAt || null;
        this.updatedAt = data.updatedAt || null;
        if (data.version !== undefined) {
            this.version = data.version;
        }
    }

    validate() {
        if (!this.id) throw new Error('Entity must have an id');
    }

    toJSON() {
        const obj = {};
        for (const key of Object.keys(this)) {
            obj[key] = this[key];
        }
        return obj;
    }
}
