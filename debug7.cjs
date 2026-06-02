const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  page.on('console', msg => console.log(msg.type(), ':', msg.text().substring(0, 200)));
  page.on('pageerror', err => console.log('ERR:', err.message.substring(0, 200)));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Try to load PDF via direct fetch first
  const fetchResult = await page.evaluate(async () => {
    try {
      const resp = await fetch('/uploads/cv-1780388596004.pdf');
      const blob = await resp.blob();
      return { ok: resp.ok, status: resp.status, size: blob.size, type: blob.type };
    } catch(e) {
      return { error: e.message };
    }
  });
  console.log('Direct fetch result:', JSON.stringify(fetchResult));

  // Now try to load the PDF via pdfjs directly
  const pdfjsResult = await page.evaluate(async () => {
    try {
      // Access pdfjs from the global scope or window
      // Since it's bundled via Vite, it might not be globally available
      // Let's try importing it dynamically
      const pdfjs = await import('/node_modules/pdfjs-dist/build/pdf.mjs');
      const loadingTask = pdfjs.getDocument('/uploads/cv-1780388596004.pdf');
      const pdf = await loadingTask.promise;
      return { numPages: pdf.numPages, success: true };
    } catch(e) {
      return { error: e.message, stack: e.stack?.substring(0, 200) };
    }
  });
  console.log('pdfjs direct test:', JSON.stringify(pdfjsResult));

  await browser.close();
})();
