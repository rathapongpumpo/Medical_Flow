import { storage } from '../../infrastructure/storage-selector.js';

export class AuthSessionService {
    constructor() {
        this._user = null;
        this._branch = null;
        this._loadFromStorage();
    }

    _loadFromStorage() {
        try {
            const storedUser = sessionStorage.getItem('mf_demo_user');
            const storedBranch = sessionStorage.getItem('mf_demo_branch');
            if (storedUser) this._user = JSON.parse(storedUser);
            if (storedBranch) this._branch = JSON.parse(storedBranch);
        } catch (e) {
            console.error('Failed to parse session storage auth data', e);
        }
    }

    getCurrentUser() {
        return this._user;
    }

    getCurrentBranch() {
        return this._branch;
    }

    async login(userId, branchId) {
        const adapter = await storage.getAdapter();
        const { UserRepository } = await import('../../infrastructure/repositories/user-repository.js');
        const { BranchRepository } = await import('../../infrastructure/repositories/branch-repository.js');
        
        const userRepo = new UserRepository(adapter);
        const branchRepo = new BranchRepository(adapter);

        const user = await userRepo.getById(userId);
        if (!user) throw new Error('User not found');

        const branch = await branchRepo.getById(branchId);
        if (!branch) throw new Error('Branch not found');

        this._user = user;
        this._branch = branch;

        sessionStorage.setItem('mf_demo_user', JSON.stringify(user));
        sessionStorage.setItem('mf_demo_branch', JSON.stringify(branch));
    }

    logout() {
        this._user = null;
        this._branch = null;
        sessionStorage.removeItem('mf_demo_user');
        sessionStorage.removeItem('mf_demo_branch');
    }
}

export const authSession = new AuthSessionService();
