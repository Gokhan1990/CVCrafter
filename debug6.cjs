const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  // Log ALL console messages
  const allLogs = [];
  page.on('console', msg => allLogs.push({type: msg.type(), text: msg.text()}));
  page.on('pageerror', err => allLogs.push({type: 'pageerror', text: err.message}));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(6000);

  // Print everything
  allLogs.forEach(l => console.log(`[${l.type}] ${l.text}`));

  console.log('=== END OF LOGS ===');

  // Try to see if pdfjs is available and what's happening
  const pdfState = await page.evaluate(() => {
    // Check if PDFPreview exists
    const viewers = document.querySelectorAll('.pdfViewer');
    const canvas = document.querySelector('.pdfCanvas');
    return {
      viewerCount: viewers.length,
      canvasExists: !!canvas,
      canvasSize: canvas ? {w: canvas.width, h: canvas.height} : null,
      canvases: document.querySelectorAll('canvas').length
    };
  });
  console.log('PDF state:', JSON.stringify(pdfState));

  await browser.close();
})();
