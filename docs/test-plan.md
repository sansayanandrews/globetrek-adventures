# GlobeTrek Adventures — Software Test Plan

This document outlines the testing strategy, scope, environment, and entry/exit criteria for the GlobeTrek Adventures travel management platform.

---

## 1. Scope & Objectives

### 1.1 Scope of Testing
The testing lifecycle encompasses functional, security, and user-experience verification across all four core platform dimensions:
- **Public Discovery**: Dynamic catalog search, multi-factor filtering (category, duration, price in LKR), package itinerary presentation, and live customization calculation.
- **Authentication & RBAC**: Customer registration, credential validation, JWT token issuance/expiration, and strict role-based route protection for Customer, Staff, and Admin roles.
- **Booking & Simulated Payment Pipeline**: Multi-step booking funnel, parameter validation, real-time total price calculation in Sri Lankan Rupees, simulated card processing, and booking voucher generation.
- **Agency Operations & Administration**: Staff package CRUD, booking queue state transitions with dispatch coordination notes, support ticket resolution, staff user provisioning, and executive analytics with CSV export.

### 1.2 Objectives
- Verify that every user journey runs end-to-end without unhandled runtime exceptions.
- Guarantee that sensitive staff/admin routes return HTTP 403 Forbidden when accessed with customer credentials or unauthenticated tokens.
- Ensure that the live price calculation matches the backend database pricing logic to prevent pricing discrepancies.
- Validate that the user interface conforms to the coastal/tropical design identity with responsive behavior across mobile and desktop viewports.

---

## 2. Test Environment & Configuration

| Component | Specification / Version |
|---|---|
| **Operating System** | Windows 11 / Windows Server / Cross-platform POSIX compatible |
| **Runtime Environment** | Node.js v24.x & npm 11.x |
| **Backend Framework** | Express.js 4.x (REST API on Port 5000) |
| **Frontend Framework** | React 18 with Vite build system (Port 5173) |
| **Database Engine** | SQLite 3 via Prisma ORM 5.x (`file:./dev.db`) |
| **Automated Test Runners** | Jest 29.x + Supertest 7.x (Integration & API) |
| **Browser Automation Tool** | Puppeteer 25.x (Headless Chromium end-to-end journey execution) |

---

## 3. Test Levels & Methodology

### 3.1 Backend API & Integration Testing (Jest + Supertest)
- Isolated, repeatable API test suites covering `/api/auth`, `/api/packages`, `/api/bookings`, `/api/queries`, and `/api/admin`.
- Direct database verification confirming that entities (`Booking`, `Payment`, `Notification`, `AuditLog`) persist with correct foreign keys.

### 3.2 Automated End-to-End Visual Walkthrough (Puppeteer)
- Automated browser script executes complete end-to-end user journeys for each role.
- High-fidelity full-page screenshots captured and archived into `docs/screenshots/` as empirical verification evidence.

### 3.3 Security & Role-Based Access Control (RBAC) Verification
- Strict negative testing asserting that unauthenticated requests receive 401 Unauthorized and insufficient privileges receive 403 Forbidden with uniform JSON error structures.

---

## 4. Entry & Exit Criteria

### 4.1 Entry Criteria
1. Database schema migrated and seeded with initial demo data (customer, staff, admin demo users + 9 Sri Lankan packages + 8 accommodations + 6 transport options).
2. Backend Express API server and Vite frontend build run without compilation errors.
3. Environment variables (`DATABASE_URL`, `JWT_SECRET`, `PORT`) configured.

### 4.2 Exit Criteria
1. 100% of automated Jest + Supertest test suites pass successfully with zero failures.
2. Visual walkthrough generates clean, high-resolution screenshots of all distinct screens and user journeys.
3. No stack traces or raw internal server errors leaked to API clients.
4. All 8 stated assumptions validated and documented.
