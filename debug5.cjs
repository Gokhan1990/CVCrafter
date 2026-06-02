const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  // Intercept network requests to see what's happening
  const requests = [];
  page.on('request', req => {
    if (req.url().includes('uploads/') || req.url().includes('pdf.worker')) {
      requests.push({url: req.url().substring(0, 80), method: req.method(), type: req.resourceType()});
    }
  });
  page.on('response', resp => {
    if (resp.url().includes('uploads/') || resp.url().includes('pdf.worker')) {
      console.log('RESP:', resp.status(), resp.url().substring(0, 80));
    }
  });
  page.on('console', msg => {
    const t = msg.text().toLowerCase();
    if (t.includes('error') || t.includes('fail') || t.includes('exception') || t.includes('pdf') || t.includes('canvas')) {
      console.log('CONSOLE', msg.type(), ':', msg.text().substring(0, 200));
    }
  });
  page.on('pageerror', err => console.log('PAGE_ERROR:', err.message.substring(0, 200)));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  console.log('--- Page loaded ---');
  await page.waitForTimeout(5000);
  console.log('--- After 5s wait ---');

  // Check if there's an uploads request
  const uploadReqs = requests.filter(r => r.url.includes('uploads/'));
  console.log('Upload requests:', JSON.stringify(uploadReqs));

  // Check the preview label
  const label = await page.$('.previewLabel');
  if (label) console.log('Label:', await label.textContent());

  // Check all visible text on page related to PDF/loading
  const loadingText = await page.$('.pdfLoading');
  if (loadingText) console.log('Loading text:', await loadingText.textContent());

  // Check canvas details
  const canvasInfo = await page.evaluate(() => {
    const c = document.querySelector('.pdfCanvas');
    if (!c) return 'no canvas';
    return { w: c.width, h: c.height, cssW: c.style.width, cssH: c.style.height };
  });
  console.log('Canvas info:', JSON.stringify(canvasInfo));

  // Check what's in the sidebar content area
  const sidebarText = await page.evaluate(() => {
    const sc = document.querySelector('.sidebarContent');
    return sc ? sc.textContent.trim().substring(0, 200) : 'no sidebar';
  });
  console.log('Sidebar content:', sidebarText);

  await browser.close();
})();
