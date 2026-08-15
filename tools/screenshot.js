const { chromium } = require('playwright');
const path = require('path');

const viewports = {
  mobile: { width: 390, height: 844 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
};

(async () => {
  const browser = await chromium.launch();
  const outDir = path.join(__dirname, 'screenshots');
  require('fs').mkdirSync(outDir, { recursive: true });

  for (const [name, size] of Object.entries(viewports)) {
    const page = await browser.newPage({ viewport: size });
    const errors = [];
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', (err) => errors.push(String(err)));
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, `${name}-top.png`) });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.35));
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, `${name}-mid.png`) });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.7));
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, `${name}-lower.png`) });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, `${name}-bottom.png`) });
    if (errors.length) console.log(`[${name}] console errors:`, errors);
    else console.log(`[${name}] no console errors`);
    await page.close();
  }

  await browser.close();
})();
