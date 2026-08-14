// public/assets/js/presentation/error-boundary.js
import { logger } from '../shared/logger.js';

export class GlobalErrorBoundary {
    constructor(rootElementId) {
        this.rootElement = document.getElementById(rootElementId) || document.body;
        this.hasError = false;
        this.originalContent = null;
    }

    setup() {
        window.addEventListener('error', (event) => this.handleUncaughtError(event.error || new Error(event.message)));
        window.addEventListener('unhandledrejection', (event) => this.handleUnhandledRejection(event.reason));
    }

    handleUncaughtError(error) {
        this._renderErrorState(error, 'Uncaught Error');
    }

    handleUnhandledRejection(reason) {
        this._renderErrorState(reason instanceof Error ? reason : new Error(String(reason)), 'Unhandled Promise Rejection');
    }

    _renderErrorState(error, type) {
        if (this.hasError) return; // Prevent cascading error renders
        
        const cid = logger.error(`Global Error Boundary caught: ${type}`, error);
        
        this.hasError = true;
        
        // Save original if we want to restore later, but typically full crash requires reload
        if (!this.originalContent && this.rootElement) {
            // Can't clone body easily if it's full screen, but we can clear innerHTML of app-root
            this.originalContent = this.rootElement.innerHTML;
        }

        const escapeHtml = (unsafe) => {
            return String(unsafe)
                 .replace(/&/g, "&amp;")
                 .replace(/</g, "&lt;")
                 .replace(/>/g, "&gt;")
                 .replace(/"/g, "&quot;")
                 .replace(/'/g, "&#039;");
        };
        const safeCid = escapeHtml(cid);

        const errorHtml = `
            <div class="container py-5">
                <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">ระบบขัดข้อง (System Error)</h4>
                    <p>ขออภัย พบข้อผิดพลาดที่ไม่คาดคิดในระบบ หากปัญหายังคงอยู่ กรุณาติดต่อผู้ดูแลระบบ</p>
                    <hr>
                    <p class="mb-0"><strong>รหัสอ้างอิง (Correlation ID):</strong> ${safeCid}</p>
                    <div class="mt-4">
                        <button class="btn btn-outline-danger" onclick="window.location.reload()">โหลดหน้าเว็บใหม่ (Reload)</button>
                        <button class="btn btn-outline-secondary ms-2" onclick="window.location.href='/'">กลับสู่หน้าหลัก (Home)</button>
                    </div>
                </div>
            </div>
        `;

        if (this.rootElement) {
            this.rootElement.innerHTML = errorHtml;
        }
    }
}
