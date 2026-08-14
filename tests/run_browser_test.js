import puppeteer from 'puppeteer';

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Capture console logs from browser
    const browserLogs = [];
    page.on('console', msg => {
        browserLogs.push(msg.text());
    });

    page.on('pageerror', err => {
        // Uncaught errors in page
        browserLogs.push(`UNCAUGHT ERROR: ${err.message}`);
    });

    console.log('Navigating to test page...');
    await page.goto('http://localhost:8080/browser-test.html', { waitUntil: 'networkidle0' });

    console.log('Waiting for Initial IndexedDB Tests to finish...');
    // The tests run immediately, wait a bit for them to finish
    await new Promise(r => setTimeout(r, 500));

    // Get the inner HTML of the test results div
    const resultsHtml = await page.$eval('#test-results', el => el.innerHTML);
    const resultsText = await page.$eval('#test-results', el => el.innerText);
    
    console.log('\n--- Initial Test Output ---');
    console.log(resultsText);
    console.log('---------------------------\n');

    // Toggle Theme Test
    console.log('Testing Toggle Theme...');
    let initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await page.click('#btn-theme');
    let toggledTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    
    console.log(`Initial Theme: ${initialTheme}`);
    console.log(`Toggled Theme: ${toggledTheme}`);
    if (initialTheme !== toggledTheme && toggledTheme === 'alternate') {
        console.log('TC-FND-003 Toggle Theme: PASS');
    } else {
        console.log('TC-FND-003 Toggle Theme: FAIL');
    }

    // Trigger Error Boundary Test
    console.log('\nTesting Global Error Boundary...');
    await page.click('#btn-error');
    // Wait for the alert-danger element to appear (which is rendered by the error boundary)
    try {
        await page.waitForSelector('.alert-danger', { timeout: 2000 });
        const appRootHtml = await page.$eval('#app-root', el => el.innerHTML);
        
        if (appRootHtml.includes('ระบบขัดข้อง (System Error)') && appRootHtml.includes('CID-')) {
            console.log('TC-FND-004 Error Boundary Rendering: PASS');
            if (appRootHtml.includes('Simulated browser error')) {
                console.log('TC-FND-004 Error Security (Raw Error in DOM): FAIL (Found raw error)');
            } else {
                console.log('TC-FND-004 Error Security (Raw Error in DOM): PASS (Raw error is hidden)');
            }

            // Check if buttons exist
            const buttonsText = await page.$$eval('.btn', btns => btns.map(b => b.textContent).join(', '));
            console.log(`Available Buttons: ${buttonsText}`);

        } else {
            console.log('TC-FND-004 Error Boundary Rendering: FAIL');
        }
    } catch (e) {
        console.log('TC-FND-004 Error Boundary Rendering: FAIL (Did not render alert-danger within 2s)');
    }

    console.log('\n--- Browser Console Logs ---');
    console.log(browserLogs.join('\n'));
    console.log('----------------------------');

    await browser.close();
})();
