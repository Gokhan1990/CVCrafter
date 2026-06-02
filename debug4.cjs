const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  
  const logs = [];
  page.on('console', msg => logs.push({type: msg.type(), text: msg.text()}));
  page.on('pageerror', err => logs.push({type: 'error', text: err.message}));
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  
  // Print all console logs
  logs.forEach(l => {
    if (l.type === 'error' || l.text.includes('Error') || l.text.includes('error') || l.text.includes('fail') || l.text.includes('pdf')) {
      console.log(l.type.toUpperCase(), ':', l.text.substring(0, 300));
    }
  });
  
  console.log('---');
  
  // Check network for PDF loading
  const resp = await page.evaluate(() => {
    const entries = performance.getEntriesByType('resource');
    return entries.filter(e => e.name.includes('uploads/') || e.name.includes('pdf')).map(e => ({
      name: e.name.substring(0, 60),
      dur: e.duration.toFixed(0),
      type: e.initiatorType
    }));
  });
  console.log('PDF related network requests:', JSON.stringify(resp));
  
  await browser.close();
})();
