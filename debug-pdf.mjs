import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
page.on('pageerror', err => console.log('PAGE_ERROR:', err.message));

// Navigate to the app
await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
console.log('--- Page loaded ---');

// Wait a moment
await page.waitForTimeout(2000);

// Check if there's already an uploaded file (from previous upload)
// Look for the upload button / file input
const uploadSection = await page.$('.uploadHero');
if (uploadSection) {
  console.log('Upload section visible, checking for file...');
  
  // Check if there's already a file shown
  const resultsSection = await page.$('button:has-text("Veriyi")');
  if (resultsSection) {
    console.log('Results showing - PDF was already uploaded');
  } else {
    console.log('Upload section - no PDF loaded yet');
  }
}

// Take screenshot
await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
console.log('--- Screenshot saved ---');

// Check if PDF viewer elements exist
const pdfViewer = await page.$('.pdfViewer');
console.log('PDF viewer found:', !!pdfViewer);

const pdfCanvas = await page.$('.pdfCanvas');
console.log('PDF canvas found:', !!pdfCanvas);
if (pdfCanvas) {
  const box = await pdfCanvas.boundingBox();
  console.log('Canvas bounding box:', JSON.stringify(box));
}

// Check the preview area
const preview = await page.$('.preview');
if (preview) {
  const previewBox = await preview.boundingBox();
  console.log('Preview area:', JSON.stringify(previewBox));
}

// Check app layout className
const previewToolbar = await page.$('.previewLabel');
if (previewToolbar) {
  const text = await previewToolbar.textContent();
  console.log('Preview label:', text);
}

await browser.close();
