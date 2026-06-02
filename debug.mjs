import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
try {
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);

  // Switch to template view
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Şablon Göster'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(1000);

  // Switch to Premium
  await page.selectOption('.previewToolbar select', 'premium');
  await page.waitForTimeout(2000);

  const template = await page.evaluate(() => {
    const sel = document.querySelector('.previewToolbar select');
    return sel ? sel.value : 'not-found';
  });
  console.log('TEMPLATE:', template);

  const mpPages = await page.evaluate(() =>
    document.querySelectorAll('.mpPage').length
  );
  console.log('MP_PAGES:', mpPages);

  // Check each page's content
  const pageContent = await page.evaluate(() => {
    const pages = document.querySelectorAll('.mpPage');
    return Array.from(pages).map((p, i) => {
      const text = p.textContent.substring(0, 200);
      const cards = p.querySelectorAll('[data-card]').length;
      const h2s = Array.from(p.querySelectorAll('h2')).map(h => h.textContent.trim());
      const h = p.offsetHeight;
      const ch = p.scrollHeight;
      return { page: i + 1, cards, h2s, h, ch, text };
    });
  });
  pageContent.forEach(p => {
    console.log(`PAGE ${p.page}: cards=${p.cards} h2s=[${p.h2s.join(', ')}] h=${p.h} ch=${p.ch}`);
  });

  await page.screenshot({ path: 'screenshot-pageplan.png', fullPage: true });
  console.log('SCREENSHOT_OK');

} catch (e) {
  console.error('ERROR:', e.message);
}
await browser.close();
