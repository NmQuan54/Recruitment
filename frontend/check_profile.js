import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set local storage to mock a logged in candidate
    await page.goto('http://localhost:5173/login'); 
    await page.evaluate(() => {
        const mockUser = {
            id: 1,
            email: 'candidate@test.com',
            fullName: 'Nguyễn Văn A',
            role: 'CANDIDATE',
            token: 'mock-token'
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
    });

    let errors = '';
    page.on('console', msg => {
      if (msg.type() === 'error') {
          errors += 'PAGE ERROR LOG: ' + msg.text() + '\n';
      }
    });
    page.on('pageerror', err => {
      errors += 'PAGE CRASH STACK: ' + (err.stack || err.toString()) + '\n';
    });

    await page.goto('http://localhost:5173/candidate/profile');
    await new Promise(r => setTimeout(r, 2000));
    
    const rootHtml = await page.evaluate(() => {
        const el = document.getElementById('root');
        return el ? el.innerHTML : 'NO ROOT ELEMENT';
    });
    
    errors += '\nHTML length: ' + rootHtml.length + '\n';
    if (rootHtml.length < 500) {
        errors += 'HTML content: ' + rootHtml + '\n';
    }
    
    fs.writeFileSync('profile_error.txt', errors, 'utf8');
    await browser.close();
  } catch (e) {
    fs.writeFileSync('profile_error.txt', e.toString(), 'utf8');
  }
})();
