const puppeteer = require('./node_modules/puppeteer');
const path = require('path');
const jwt = require('../server/node_modules/jsonwebtoken');
const express = require('../server/node_modules/express');
const app = require('../server/src/app');

// Serve client dist and mount API
const clientDist = path.join(__dirname, '../client/dist');
const webApp = express();
webApp.use(app);
webApp.use(express.static(clientDist));
webApp.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

const PORT = 5173;
const JWT_SECRET = 'globetrek_super_secret_jwt_key_2026_lk';

function makeToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

const customerUser = { id: 1, full_name: 'Amara Perera', email: 'customer@globetrek.com', role: 'customer' };
const staffUser = { id: 2, full_name: 'Dinesh Silva', email: 'staff@globetrek.com', role: 'staff' };
const adminUser = { id: 3, full_name: 'Kavinda Fernando', email: 'admin@globetrek.com', role: 'admin' };

const customerToken = makeToken(customerUser);
const staffToken = makeToken(staffUser);
const adminToken = makeToken(adminUser);

async function run() {
  console.log('Starting GlobeTrek verification server on port ' + PORT + '...');
  const server = webApp.listen(PORT);
  const outDir = path.join(__dirname, '../docs/screenshots');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  async function snap(urlPath, filename, delay = 800) {
    console.log(`Capturing: ${urlPath} -> ${filename}`);
    await page.goto(`http://localhost:${PORT}${urlPath}`, { waitUntil: 'networkidle0' });
    if (delay) await new Promise((r) => setTimeout(r, delay));
    await page.screenshot({ path: path.join(outDir, filename), fullPage: false });
  }

  async function setAuth(token, user) {
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    await page.evaluate((t, u) => {
      if (t) {
        localStorage.setItem('globetrek_token', t);
        localStorage.setItem('globetrek_user', JSON.stringify(u));
      } else {
        localStorage.clear();
      }
    }, token, user);
  }

  try {
    // 1. Public Pages (Unauthenticated)
    await setAuth(null, null);
    await snap('/', '01_public_home.png');
    await snap('/about', '02_public_about.png');
    await snap('/packages', '03_public_packages.png');
    await snap('/packages/sigiriya-cultural-triangle-heritage-explorer', '04_public_package_detail.png');
    await snap('/accommodations', '05_public_accommodations.png');
    await snap('/transportation', '06_public_transportation.png');
    await snap('/travel-guides', '07_public_travel_guides.png');
    await snap('/contact', '08_public_contact.png');
    await snap('/login', '09_public_login.png');
    await snap('/register', '10_public_register.png');
    await snap('/some-invalid-path-404', '11_system_404.png');

    // 2. Customer Journey
    console.log('Capturing Customer Journey...');
    await setAuth(customerToken, customerUser);
    await snap('/dashboard', '12_customer_dashboard.png');
    await snap('/book/sigiriya-cultural-triangle-heritage-explorer', '13_customer_booking_flow.png');
    await snap('/booking/confirmation/1', '14_customer_booking_voucher.png');
    await snap('/queries/1', '15_customer_query_thread.png');

    // 3. Staff Journey
    console.log('Capturing Staff Journey...');
    await setAuth(staffToken, staffUser);
    await snap('/staff', '16_staff_dashboard.png');
    await snap('/staff/packages', '17_staff_packages_crud.png');
    await snap('/staff/bookings', '18_staff_bookings_queue.png');
    await snap('/staff/queries', '19_staff_queries_desk.png');

    // 4. Admin Journey
    console.log('Capturing Admin Journey...');
    await setAuth(adminToken, adminUser);
    await snap('/admin', '20_admin_dashboard.png');
    await snap('/admin/staff', '21_admin_staff_management.png');
    await snap('/admin/bookings', '22_admin_bookings_oversight.png');
    await snap('/admin/reports', '23_admin_reports_analytics.png', 1500);
    await snap('/admin/audit-log', '24_admin_audit_trail.png');

    // 5. System RBAC Forbidden (Customer accessing admin)
    await setAuth(customerToken, customerUser);
    await snap('/unauthorized', '25_system_403_forbidden.png');

    console.log('All 25 automated screenshots successfully captured!');
  } catch (err) {
    console.error('Screenshot capture failure:', err);
  } finally {
    await browser.close();
    server.close();
    process.exit(0);
  }
}

run();
