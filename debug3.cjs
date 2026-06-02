const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  page.on('pageerror', err => console.log('ERR:', err.message));
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);

  // Wait for PDF rendering
  await page.waitForTimeout(2000);

  // Check canvas
  const result = await page.evaluate(() => {
    const c = document.querySelector('.pdfCanvas');
    if (!c) return { found: false, reason: 'no canvas' };
    const rect = c.getBoundingClientRect();
    const ctx = c.getContext('2d');
    let nonWhite = 0;
    try {
      const imgData = ctx.getImageData(0, 0, Math.min(c.width, 100), Math.min(c.height, 100));
      for (let i = 0; i < imgData.data.length; i += 16) {
        if (imgData.data[i] < 250 || imgData.data[i+1] < 250 || imgData.data[i+2] < 250) nonWhite++;
      }
    } catch(e) { return { found: true, error: e.message, rect: {w:rect.width,h:rect.height}, canvasW: c.width, canvasH: c.height }; }
    return { found: true, nonWhitePixels: nonWhite, rect: {w:rect.width,h:rect.height}, canvasW: c.width, canvasH: c.height };
  });
  console.log('Canvas result:', JSON.stringify(result, null, 2));

  // Check for the template toggle
  const btns = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim());
  });
  console.log('Buttons:', JSON.stringify(btns));

  await page.screenshot({ path: 'debug3.png', fullPage: true });
  console.log('Screenshot saved');
  await browser.close();
})();
