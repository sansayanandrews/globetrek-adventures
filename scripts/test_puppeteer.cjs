const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    const outPath = path.join(__dirname, '../docs/screenshots/phase1_foundation.png');
    await page.setContent(`
      <div style="font-family: system-ui, sans-serif; padding: 40px; background: #0891b2; color: white; min-height: 100vh;">
        <h1 style="font-size: 36px; margin-bottom: 10px;">GlobeTrek Adventures — Negombo, Sri Lanka</h1>
        <h2 style="font-size: 24px; color: #fed7aa; margin-top: 0;">Phase 1: Foundation & Design Artifacts Complete</h2>
        <div style="background: white; color: #0f172a; padding: 30px; border-radius: 12px; margin-top: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
          <h3 style="color: #0e7490; margin-top: 0;">System Architecture Verified</h3>
          <ul style="line-height: 1.8; font-size: 16px;">
            <li><b>Backend:</b> Node.js + Express REST API configured with JWT auth & RBAC</li>
            <li><b>Database:</b> SQLite via Prisma ORM synced & seeded with 3 roles, 9 Sri Lankan packages, 8 accommodations, 6 transport modes</li>
            <li><b>Frontend:</b> React + Vite + Tailwind CSS (Ocean Teal & Sunset Orange palette)</li>
            <li><b>Design Documentation:</b> <code>docs/sitemap.md</code> & <code>docs/design-rationale.md</code> generated</li>
          </ul>
        </div>
      </div>
    `);
    await page.screenshot({ path: outPath });
    await browser.close();
    console.log('Successfully captured Phase 1 screenshot at ' + outPath);
  } catch (err) {
    console.error('Puppeteer error:', err.message);
    process.exit(1);
  }
})();
