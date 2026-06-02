const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  const logs = [];
  page.on('console', msg => {
    if (msg.text().includes('PDFPreview') || msg.text().includes('pdf') || msg.type() === 'error') {
      logs.push({type: msg.type(), text: msg.text()});
    }
  });
  page.on('pageerror', err => logs.push({type: 'pageerror', text: err.message}));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(8000);

  logs.forEach(l => console.log(l.type, ':', l.text.substring(0, 300)));

  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim());
  });
  console.log('Buttons:', JSON.stringify(buttons));

  await browser.close();
})();
