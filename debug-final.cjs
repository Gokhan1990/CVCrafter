const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
    if (msg.text().includes('PDF load')) console.log(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(6000);

  errors.forEach(e => console.log('ERR:', e.substring(0, 200)));

  const info = await page.evaluate(() => {
    const c = document.querySelector('.pdfCanvas');
    if (!c) return { found: false };
    return { w: c.width, h: c.height, loaded: c.width > 500 && c.height > 500 };
  });
  console.log('Canvas:', JSON.stringify(info));

  await page.screenshot({ path: 'debug-after-fix.png', fullPage: true });
  await browser.close();
})();
