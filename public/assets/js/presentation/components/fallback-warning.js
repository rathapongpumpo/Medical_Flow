export class FallbackWarningComponent {
    constructor() {
        this.dismissed = false;
    }

    /**
     * @param {Object} storageInfo 
     * @param {boolean} storageInfo.isFallback
     * @param {string} storageInfo.mode
     * @param {string} storageInfo.warningCode
     */
    render(storageInfo) {
        // If not a fallback, or already dismissed, do nothing
        if (!storageInfo || !storageInfo.isFallback || this.dismissed) {
            return;
        }

        if (typeof document === 'undefined') return;
        if (document.getElementById('storage-fallback-warning')) return;
        
        const warningDiv = document.createElement('div');
        warningDiv.id = 'storage-fallback-warning';
        warningDiv.className = 'alert alert-warning';
        warningDiv.style.position = 'fixed';
        warningDiv.style.bottom = '10px';
        warningDiv.style.right = '10px';
        warningDiv.style.zIndex = '9999';
        warningDiv.style.maxWidth = '300px';
        warningDiv.innerHTML = `
            <strong>Storage Warning</strong><br>
            ระบบทำงานในโหมด Fallback (${storageInfo.mode}) เนื่องจาก IndexedDB ใช้งานไม่ได้ อาจส่งผลต่อประสิทธิภาพ
            <button id="btn-dismiss-fallback" class="mf-btn mf-btn-sm" style="margin-top: 5px; width: 100%;">รับทราบ</button>
        `;
        document.body.appendChild(warningDiv);

        document.getElementById('btn-dismiss-fallback').addEventListener('click', () => {
            this.dismissed = true;
            warningDiv.remove();
        });
    }
}
