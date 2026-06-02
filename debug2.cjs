const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE_ERROR:', err.message));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  console.log('--- Initial load ---');
  await page.waitForTimeout(3000);

  // Check state after page load
  const label = await page.$('.previewLabel');
  if (label) console.log('Label:', await label.textContent());

  const pdfViewer = await page.$('.pdfViewer');
  console.log('PDF viewer found:', !!pdfViewer);

  const canvas = await page.$('.pdfCanvas');
  console.log('PDF canvas found:', !!canvas);

  const uploadBtn = await page.$('.uploadBtn');
  console.log('Upload button:', !!uploadBtn);

  const uploadHero = await page.$('.uploadHero');
  console.log('Upload hero:', !!uploadHero);

  // Check what sections are visible
  const results = await page.$('button:has-text("Veriyi")');
  console.log('Results button (apply):', !!results);

  const toggleBtn = await page.$('button:has-text("PDF Göster")');
  console.log('Toggle PDF button:', !!toggleBtn);

  // Check sidebar for sections
  const sidebarBtns = await page.$$('.sidebarBtn.active');
  for (const btn of sidebarBtns) {
    console.log('Active section:', await btn.textContent());
  }

  // Try to find the toggle and click it if exists
  if (toggleBtn) {
    console.log('Clicking PDF Göster...');
    await toggleBtn.click();
    await page.waitForTimeout(3000);

    const pdfViewer2 = await page.$('.pdfViewer');
    console.log('PDF viewer after click:', !!pdfViewer2);
    const canvas2 = await page.$('.pdfCanvas');
    console.log('PDF canvas after click:', !!canvas2);
    if (canvas2) {
      const box = await canvas2.boundingBox();
      console.log('Canvas box:', JSON.stringify(box));
      const visible = await canvas2.isVisible();
      console.log('Canvas visible:', visible);
    }
  }

  await page.screenshot({ path: 'debug2.png', fullPage: true });

  await browser.close();
})();
