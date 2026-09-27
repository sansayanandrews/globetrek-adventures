# GlobeTrek Adventures — Web-Based Travel & Tourism Platform

> **GlobeTrek Adventures** is a dynamic full-stack travel and tourism management platform designed and built for a newly established travel agency headquartered in **Negombo, Sri Lanka**. The platform features an authentic coastal aesthetic, a rich tour package catalog, live interactive price customization, simulated payment processing, role-based operations dashboards, Recharts analytics, and full audit logging.

---

## 1. Tech Stack

- **Frontend**: React 18 (via Vite), React Router DOM v6, Tailwind CSS (modern Royal Blue & Crisp White palette with bespoke compass logo), Lucide-React icon set, Recharts for business intelligence visualizations, Axios client with automatic JWT bearer interceptors.
- **Backend**: Node.js + Express REST API, CORS, JSON Web Tokens (JWT), bcryptjs password hashing, Morgan request logging, custom uniform JSON error middleware.
- **Database**: SQLite 3 via Prisma ORM (`file:./dev.db`) for zero-configuration local execution (a one-line change in `schema.prisma` switches the datasource to PostgreSQL or MySQL).
- **Testing & Tooling**: Jest 29 + Supertest 7 for backend API suites; Puppeteer 25 for automated headless browser journey walkthroughs and high-resolution screenshot generation.
- **Source Control**: Git with clean, incremental, phase-by-phase commits.

---

## 2. Seed Demo Credentials

The platform is pre-seeded with three demo accounts covering all system roles:

| Role | Email Address | Password | Permissions & Available Portals |
|---|---|---|---|
| **Customer / Traveler** | `customer@globetrek.com` | `Customer123!` | Browse, filter, customize tours, simulated booking, manage own bookings & queries (`/dashboard`, `/book/:slug`). |
| **Travel Agency Staff** | `staff@globetrek.com` | `Staff123!` | All customer views + Package CRUD, Booking queue confirmation, coordination notes, inquiry responses (`/staff`, `/staff/packages`, `/staff/bookings`, `/staff/queries`). |
| **Agency Administrator** | `admin@globetrek.com` | `Admin123!` | Full superuser access: manage staff accounts, master booking oversight across agency, revenue/analytics charts, CSV export, audit trail (`/admin`, `/admin/staff`, `/admin/reports`, `/admin/audit-log`). |

*Note: The login page at `/login` includes one-click "Demo Quick Credentials" buttons to populate any role instantly.*

---

## 3. Stated Assumptions (Treat as Fixed Decisions)

In accordance with project requirements, the following eight assumptions govern this deployment:

1. **Currency**: Sri Lankan Rupees (**LKR**) is used exclusively throughout all catalog prices, customization add-ons, payments, and financial analytics.
2. **Simulated Payments**: Payments are strictly simulated. The checkout interface collects standard dummy card-style fields, validates format client-side, and produces a `Payment` record with a transaction reference (`GT-TXN-XXXXXX`). No real gateway is called and no real card data is ever persisted. (A production deployment would integrate a provider such as Stripe or PayHere).
3. **Accommodation & Transport Coordination**: Modeled via internal database catalog tables (`Accommodation`, `Transportation`) plus a free-text `coordination_notes` field that staff update per booking (e.g. driver assignment, hotel confirmation numbers) rather than live third-party GDS/hotel APIs.
4. **Simulated Notifications**: Email and SMS dispatches are simulated by writing directly to an in-app `Notification` database table tied to the user, eliminating external telecom/SMTP credentials.
5. **High-Fidelity Mockups**: The built, working web application pages themselves serve as high-fidelity UI mockups. Automated headless browser screenshots are captured for all distinct screens and user journeys in `docs/screenshots/`.
6. **Demo Data**: The database is seeded with exactly one demo user per role plus 9 comprehensive tour packages covering real Sri Lankan destinations (Sigiriya, Ella, Yala, Galle, Kandy, Mirissa, Nuwara Eliya, Negombo, and Sinharaja).
7. **Single Agency Scope**: Single agency, single language (English), single currency (LKR) — no multi-tenant or i18n requirements.
8. **Feedback Evaluation Deliverable**: A blank 6–8 item usability questionnaire template and evaluation structure is produced in `docs/feedback-evaluation-template.md`. In strict adherence to academic and testing integrity, no synthetic respondents or feedback data have been fabricated.

---

## 4. Setup & Running Locally

### Prerequisites
- Node.js (v18 or higher; tested on v24)
- npm (v9 or higher)

### Quick Start (Root Directory)

```bash
# Clone or navigate to the repository
cd globetrek-adventures

# Install backend dependencies & setup database
cd server
npm install
npx prisma db push
npm run db:seed
npm start   # Runs backend API on http://localhost:5000

# In a separate terminal, run frontend
cd ../client
npm install
npm run dev # Runs Vite dev server on http://localhost:5173
```

### Running Automated Test Suites

```bash
cd server
npm test
```
*Executes all 25 Jest + Supertest suites covering authentication, package CRUD, booking calculations, queries, and role-based access control.*

### Capturing Automated Screenshots

```bash
node scripts/capture_screenshots.cjs
```
*Launches headless Chromium, navigates public and authenticated flows, and writes PNG screenshots to `docs/screenshots/`.*

---

## 5. Database Architecture & How to Access It on GitHub

The platform uses an embedded, relational **SQLite 3** database managed via **Prisma ORM**. The database is fully pre-seeded and committed directly to the GitHub repository for zero-config onboarding.

### 5.1 Database Files in the GitHub Repository

- **Database Binary**: [`server/prisma/dev.db`](https://github.com/sansayanandrews/globetrek-adventures/blob/main/server/prisma/dev.db) — The SQLite database file containing all seeded tables and records.
- **Prisma Schema**: [`server/prisma/schema.prisma`](https://github.com/sansayanandrews/globetrek-adventures/blob/main/server/prisma/schema.prisma) — Human-readable schema definition with all 10 models (`User`, `Package`, `Accommodation`, `Transportation`, `Booking`, `Payment`, `Query`, `AuditLog`, `Notification`).
- **Seed Script**: [`server/prisma/seed.js`](https://github.com/sansayanandrews/globetrek-adventures/blob/main/server/prisma/seed.js) — The executable JavaScript script that populates the initial packages, accounts, and catalog.

### 5.2 How to Access & Inspect the Database

#### Method 1: Interactive Browser GUI via Prisma Studio (Recommended)
Prisma Studio provides a rich visual web interface to browse, filter, edit, and query all database tables directly in your browser:
```bash
cd server
npx prisma studio
```
This automatically launches **`http://localhost:5555`** with dedicated tabs for every model (`User`, `Package`, `Booking`, `Payment`, `Query`, `AuditLog`, etc.).

#### Method 2: Online SQLite Viewer (No Installation Required)
You can inspect the database file without installing any software:
1. Download or clone `server/prisma/dev.db` from your GitHub repository.
2. Open **[sqliteviewer.app](https://sqliteviewer.app/)** or **[inloop.github.io/sqlite-viewer](https://inloop.github.io/sqlite-viewer/)** in your browser.
3. Drag and drop `dev.db` to view all tables and run SQL queries in the browser.

#### Method 3: Desktop SQLite Tools
Open `server/prisma/dev.db` using desktop database software:
- **DB Browser for SQLite** (Free, open-source for Windows / macOS / Linux)
- **VS Code Extension**: Install the *"SQLite Viewer"* or *"SQLite"* extension to inspect `dev.db` directly inside your editor.

#### Method 4: SQLite Command Line
```bash
cd server
sqlite3 prisma/dev.db "SELECT id, full_name, email, role FROM User;"
sqlite3 prisma/dev.db "SELECT id, title, destination, base_price_lkr FROM Package;"
```

---

## 6. Key Feature Highlights

- **Dynamic Public Catalog**: Instant search and multi-criteria filtering by category (Cultural, Wildlife, Scenic, Beach, Adventure), duration (2 to 4 days), and price slider up to 200,000 LKR without page reload.
- **Interactive Price Customizer**: Live client-side recalculation of total cost in LKR when adjusting group size, swapping accommodation tiers, changing vehicle models, or adding extra nights.
- **Simulated Checkout Funnel**: 3-step streamlined booking with dummy card validation, instant voucher generation (`#GT-BKG-XXXXX`), and printable travel vouchers.
- **Customer Support Desk**: Inquiries submitted with optional booking links; staff can claim tickets, reply, and mark resolved.
- **Agency Operations Workspace**: Dedicated staff dashboard for package publishing, booking queue state changes (`pending` → `confirmed` / `cancelled`), and dispatch notes.
- **Administrator Business Suite**: Provisioning and deactivating staff users, master booking ledger, audit log timeline, and business analytics powered by Recharts (Monthly Revenue trend, Bookings by destination, Customer acquisition) with one-click CSV dataset download.
- **Robust Error Handling**: Uniform JSON error responses from the API, zero leaked stack traces, on-brand custom 404/403/500 screens, and instant toast notifications.

---

## 6. Known Limitations

- **Simulated External Services**: Payment processing, SMS dispatches, and hotel room inventory APIs are simulated locally.
- **Zero Real Card Storage**: Dummy card numbers are validated for format only and are never persisted to the SQLite database.
- **Database Scope**: Uses SQLite for zero-config portability; for high concurrency in production, switch the Prisma datasource to PostgreSQL or MySQL.
