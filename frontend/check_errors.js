import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let errors = '';
    page.on('console', msg => {
      if (msg.type() === 'error') {
          errors += 'PAGE ERROR LOG: ' + msg.text() + '\n';
      }
    });
    page.on('pageerror', err => {
      errors += 'PAGE CRASH STACK: ' + (err.stack || err.toString()) + '\n';
    });
    await page.goto('http://localhost:5175');
    await new Promise(r => setTimeout(r, 2000));
    fs.writeFileSync('error_trace.txt', errors, 'utf8');
    await browser.close();
  } catch (e) {
    fs.writeFileSync('error_trace.txt', e.toString(), 'utf8');
  }
})();
