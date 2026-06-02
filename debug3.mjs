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

  // Test Premium
  await page.selectOption('.previewToolbar select', 'premium');
  await page.waitForTimeout(3000);
  let mp = await page.evaluate(() => document.querySelectorAll('.mpPage').length);
  console.log('PREMIUM pages:', mp);

  // Test Modern
  await page.selectOption('.previewToolbar select', 'modern');
  await page.waitForTimeout(3000);
  mp = await page.evaluate(() => document.querySelectorAll('.mpPage').length);
  const modScroll = await page.evaluate(() => {
    const p = document.querySelector('.mpPage');
    return p ? `${p.scrollHeight}/${p.clientHeight}` : 'none';
  });
  console.log('MODERN pages:', mp, 'scroll/client:', modScroll);

  // Test Classic
  await page.selectOption('.previewToolbar select', 'classic');
  await page.waitForTimeout(3000);
  mp = await page.evaluate(() => document.querySelectorAll('.mpPage').length);
  const clsScroll = await page.evaluate(() => {
    const p = document.querySelector('.mpPage');
    return p ? `${p.scrollHeight}/${p.clientHeight}` : 'none';
  });
  console.log('CLASSIC pages:', mp, 'scroll/client:', clsScroll);

  // Back to Premium for screenshot
  await page.selectOption('.previewToolbar select', 'premium');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshot-final.png', fullPage: true });
  console.log('SCREENSHOT_OK');
} catch (e) {
  console.error('ERROR:', e.message);
}
await browser.close();
