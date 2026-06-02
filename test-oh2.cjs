const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    btns[16]?.click();
  });
  await page.waitForTimeout(3000);

  const info = await page.evaluate(() => {
    const ps = document.querySelector('.previewScroll');
    const root = ps?.firstElementChild;
    const children = Array.from(root?.children || []);
    const pageContainer = children[1]; // second child = page 0
    const cs = pageContainer ? getComputedStyle(pageContainer) : null;
    return {
      childrenCount: children.length,
      inlineStyle: pageContainer?.getAttribute('style'),
      computedH: cs?.height,
      offH: pageContainer?.offsetHeight,
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
