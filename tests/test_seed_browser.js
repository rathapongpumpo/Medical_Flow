import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import path from 'path';

async function run() {
    console.log('[INFO] Starting PHP Server...');
    const server = spawn('php', ['-S', 'localhost:8080', '-t', 'public']);
    
    // Wait for server to start
    await new Promise(r => setTimeout(r, 1500));

    console.log('[INFO] Launching Puppeteer...');
    const browser = await puppeteer.launch({ 
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'] 
    });
    const page = await browser.newPage();
    
    let hasUnexpectedError = false;
    page.on('console', msg => {
        const text = msg.text();
        if (msg.type() === 'error' && !text.includes('Simulated UI Failure') && !text.includes('Atomic Seed Transaction failed') && !text.includes('Failed to load resource')) {
            console.error(`[BROWSER ERROR] ${text}`);
            hasUnexpectedError = true;
        } else {
            console.log(`[BROWSER CONSOLE] ${text}`);
        }
    });

    console.log('[INFO] Navigating to http://localhost:8080/seed-browser-test.html');
    await page.goto('http://localhost:8080/seed-browser-test.html', { waitUntil: 'networkidle2' });

    console.log('[INFO] Waiting for tests to complete...');
    try {
        await page.waitForFunction(() => {
            const status = document.getElementById('status').textContent;
            return status === 'DONE_SUCCESS' || status === 'DONE_FAIL';
        }, { timeout: 10000 });

        const status = await page.$eval('#status', el => el.textContent);
        if (status === 'DONE_SUCCESS' && !hasUnexpectedError) {
            console.log('[PASS] Browser Verification Successful.');
        } else {
            console.error('[FAIL] Browser Verification Failed or had unexpected errors.');
            process.exit(1);
        }
    } catch (e) {
        console.error('[FAIL] Timeout or error during verification', e);
        process.exit(1);
    } finally {
        await browser.close();
        server.kill();
    }
}

run().catch(e => {
    console.error(e);
    process.exit(1);
});
