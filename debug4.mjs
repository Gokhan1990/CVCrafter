import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
try {
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);

  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Şablon Göster'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(1000);

  await page.selectOption('.previewToolbar select', 'premium');
  await page.waitForTimeout(3000);

  // Check break points via the DOM (they're stored as styles)
  const info = await page.evaluate(() => {
    const pages = document.querySelectorAll('.mpPage');
    const innerDivs = document.querySelectorAll('.mpPage > div');
    return Array.from(pages).map((p, i) => {
      const inner = p.querySelector('div[style*="translateY"]');
      const transform = inner ? inner.style.transform : 'no-transform';
      const pScroll = p.scrollHeight;
      const pClient = p.clientHeight;
      const innerScroll = inner ? inner.scrollHeight : 0;
      return { page: i + 1, transform, pScroll, pClient, innerScroll };
    });
  });
  console.log('PAGE_INFO:', JSON.stringify(info, null, 2));

  // Check what's actually visible by checking first card's position
  const visibleCheck = await page.evaluate(() => {
    const pages = document.querySelectorAll('.mpPage');
    return Array.from(pages).map((p, i) => {
      const inner = p.querySelector('div[style*="translateY"]');
      if (!inner) return { page: i + 1, error: 'no inner' };
      const rect = inner.getBoundingClientRect();
      const items = inner.querySelectorAll('[data-card="experience"]');
      const firstItemRect = items.length > 0 ? items[0].getBoundingClientRect() : null;
      const lastItemRect = items.length > 0 ? items[items.length - 1].getBoundingClientRect() : null;
      return {
        page: i + 1,
        innerTop: Math.round(rect.top),
        innerBottom: Math.round(rect.bottom),
        firstExpTop: firstItemRect ? Math.round(firstItemRect.top) : null,
        firstExpText: items.length > 0 ? items[0].textContent.substring(0, 30) : 'none',
        lastExpTop: lastItemRect ? Math.round(lastItemRect.top) : null,
        lastExpText: items.length > 0 ? items[items.length - 1].textContent.substring(0, 30) : 'none',
      };
    });
  });
  console.log('VISIBLE:', JSON.stringify(visibleCheck, null, 2));

  await page.screenshot({ path: 'screenshot-translatey.png', fullPage: true });
  console.log('SCREENSHOT_OK');
} catch (e) {
  console.error('ERROR:', e.message);
}
await browser.close();
