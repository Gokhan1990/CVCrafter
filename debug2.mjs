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
  await page.waitForTimeout(3000);

  // Get measured heights of all cards via interception
  const heights = await page.evaluate(() => {
    const meas = document.querySelector('[style*="top: -9999"]');
    if (!meas) return 'NO_MEAS_DIV';
    const cards = meas.querySelectorAll('[data-card]');
    const h2s = meas.querySelectorAll('h2');
    return {
      cardCount: cards.length,
      h2Count: h2s.length,
      totalScroll: meas.scrollHeight,
      totalHeight: meas.offsetHeight,
      cards: Array.from(cards).map(c => ({
        type: c.getAttribute('data-card'),
        idx: c.getAttribute('data-card-index'),
        h: c.offsetHeight,
        w: c.offsetWidth,
      })),
      parentWidth: meas.offsetWidth,
    };
  });
  console.log('MEASUREMENT:', JSON.stringify(heights, null, 2));

  // Check page renders
  const pages = await page.evaluate(() => {
    const mpPages = document.querySelectorAll('.mpPage');
    return Array.from(mpPages).map((p, i) => {
      const cards = p.querySelectorAll('[data-card]');
      return {
        page: i + 1,
        cardCount: cards.length,
        scrollH: p.scrollHeight,
        clientH: p.clientHeight,
        cards: Array.from(cards).map(c => ({
          type: c.getAttribute('data-card'),
          idx: c.getAttribute('data-card-index'),
          text: c.textContent.substring(0, 50),
        })),
      };
    });
  });
  console.log('PAGES:', JSON.stringify(pages, null, 2));

  await page.screenshot({ path: 'screenshot-plan.png', fullPage: true });
  console.log('SCREENSHOT_OK');
} catch (e) {
  console.error('ERROR:', e.message);
}
await browser.close();
