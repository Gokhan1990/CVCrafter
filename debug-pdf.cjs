const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE_ERROR:', err.message));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  console.log('--- Page loaded ---');
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
  console.log('--- Screenshot saved ---');

  const pdfViewer = await page.$('.pdfViewer');
  console.log('PDF viewer found:', !!pdfViewer);

  const canvas = await page.$('.pdfCanvas');
  console.log('PDF canvas found:', !!canvas);
  if (canvas) {
    const box = await canvas.boundingBox();
    console.log('Canvas box:', JSON.stringify(box));
    const visible = await canvas.isVisible();
    console.log('Canvas visible:', visible);
  }

  const label = await page.$('.previewLabel');
  if (label) console.log('Label:', await label.textContent());

  const error = await page.$('.pdfLoading');
  if (error) console.log('Loading text:', await error.textContent());

  const preview = await page.$('.preview');
  if (preview) {
    const box = await preview.boundingBox();
    console.log('Preview area:', JSON.stringify(box));
  }

  await browser.close();
})();
