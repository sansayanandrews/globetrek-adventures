# GlobeTrek Adventures — Site Map & Information Architecture

GlobeTrek Adventures is a comprehensive travel and tourism management platform for a Negombo-based travel agency in Sri Lanka. The architecture is organized into four major navigation realms: Public Portal, Authenticated Customer Journey, Agency Staff Operations Workspace, and Business Administrator Management Suite, along with system-level exception screens.

---

## 1. Public Portal (Unauthenticated & General Access)
Accessible to all visitors, international tourists, and returning travelers.

| URL Route | Page Name | Primary Features & User Functions |
|---|---|---|
| `/` | **Home Page** | Brand hero, Negombo beach & lagoon highlight, search & filter bar, featured tour packages, why choose GlobeTrek, traveler testimonials, quick inquiry CTA. |
| `/about` | **About Us** | Agency origin story (Negombo HQ), licensed guide credentials, sustainable tourism philosophy, local team profiles, company values. |
| `/packages` | **Tour Packages Catalog** | Dynamic catalog with real-time text search, category filters (Cultural, Wildlife, Beach, Scenic, Adventure), price slider, duration filter, sort options, responsive package cards. |
| `/packages/:slug` | **Package Detail & Customizer** | Destination overview, day-by-day itinerary accordion, high-res photo gallery, default accommodations/transports, interactive live price calculation widget ("Customize This Trip"). |
| `/accommodations` | **Accommodations Showcase** | Catalog of partnered Sri Lankan hotels, beach villas, mountain eco-lodges with location filters, star ratings, and room amenities. |
| `/transportation` | **Transportation Services** | Fleet directory (Private AC cars, luxury vans, safari 4x4 jeeps, scenic train bookings) with capacity details and route descriptions. |
| `/travel-guides` | **Travel Guides & Insights** | Curated Sri Lanka travel guides (e.g. Cultural Triangle tips, seasonal monsoon calendar, packing for the hill country, wildlife safari etiquette). |
| `/contact` | **Contact & Inquiries** | Negombo headquarters contact details (address, direct hotline, email), interactive Google-style map placeholder, public general inquiry submission form. |
| `/login` | **User Sign In** | Email and password authentication with role-aware redirection (Customer / Staff / Admin) and mock "Forgot Password" modal. |
| `/register` | **Customer Registration** | Traveler account creation with client-side password strength validation, name, email, phone number, and auto-login upon success. |

---

## 2. Customer Journey (Authenticated Travelers)
Protected routes accessible to authenticated travelers with role `customer`.

| URL Route | Page Name | Primary Features & User Functions |
|---|---|---|
| `/dashboard` | **Customer Dashboard** | Traveler overview with metric cards (Total Bookings, Upcoming Trips, Open Queries, Unread Notifications), "My Bookings" list with live status badges (`pending`, `confirmed`, `cancelled`, `completed`), and "My Inquiries" tracking list. |
| `/book/:slug` | **Customize & Book Flow** | Multi-step interactive booking funnel: <br>1. *Trip Configuration*: Select start date, number of adult/child travelers.<br>2. *Customization & Upgrades*: Select accommodation tier, transportation preference, add extra night options with live recalculating price in LKR.<br>3. *Review & Contact*: Traveler details summary and price breakdown.<br>4. *Simulated Payment*: Dummy card payment gateway validating format without storing card details.<br>5. *Voucher Confirmation*: Instant confirmation with `GT-TXN-` transaction reference and downloadable summary. |
| `/booking/confirmation/:id` | **Booking Receipt & Voucher** | Comprehensive booking confirmation screen showing full itinerary, selected upgrades, coordination notes, and receipt breakdown. |
| `/queries/new` | **Submit Inquiry / Ticket** | Customer query form categorized by Booking Issue, Customization Request, General Inquiry, or Complaint with optional booking reference link. |
| `/queries/:id` | **Inquiry Thread Detail** | Customer view of inquiry conversation, original inquiry submission, status badge, and official response from GlobeTrek staff. |

---

## 3. Staff Operations Workspace (Travel Agency Operations)
Protected routes accessible to users with role `staff` or `admin`.

| URL Route | Page Name | Primary Features & User Functions |
|---|---|---|
| `/staff` | **Staff Operational Dashboard** | Operations control center with KPI metric counters: Pending Bookings needing review, Active Packages, Open Customer Inquiries, and recent operational alerts. |
| `/staff/packages` | **Package Management (CRUD)** | Comprehensive tour package ledger: Search, filter by category, view publishing status, create new package modal/form, edit itinerary, toggle active/inactive status. |
| `/staff/bookings` | **Booking Queue Management** | Manage bookings across all travelers: Status filtering (`pending`, `confirmed`, `cancelled`), assign handling staff, one-click Confirm/Reject actions, and add internal coordination notes (hotel confirmations, driver details). |
| `/staff/queries` | **Inquiry Desk & Ticket Resolution** | Customer support ticket queue: Filter by open/in-progress/resolved, assign ticket to self, compose and send staff replies, and mark tickets resolved. |

---

## 4. Admin Management Suite (Executive & Governance)
Protected routes strictly restricted to users with role `admin`.

| URL Route | Page Name | Primary Features & User Functions |
|---|---|---|
| `/admin` | **Admin Executive Dashboard** | High-level agency performance KPIs: Total Agency Gross Revenue (LKR), Total Bookings, Active Customers, Conversion Rate, and quick links to management modules. |
| `/admin/staff` | **Staff Account Administration** | User administration: List all agency staff members, create new staff account with credentials, activate/deactivate staff access. |
| `/admin/bookings` | **Comprehensive Booking Oversight** | Master agency booking repository across all customers and destinations with advanced search, status filters, date ranges, and staff assignment insights. |
| `/admin/reports` | **Reports & Business Analytics** | Visual analytical dashboards powered by interactive charts: <br>• Monthly Revenue Growth (LKR)<br>• Bookings distribution by Sri Lankan Destination<br>• Customer Acquisition Trends<br>• One-click CSV Export of full financial and booking datasets. |
| `/admin/audit-log` | **System Audit Trail** | Tamper-evident audit log recording staff/admin actions (Actor, Action, Target Entity, Target ID, Timestamp) for security and accountability. |

---

## 5. System & Error Pages
Branded, helpful error screens matching the GlobeTrek coastal design identity.

| Route / State | Page Name | Description & Visual Feedback |
|---|---|---|
| `*` | **404 Not Found** | Custom ocean-themed page indicating the requested trail or page was not found, with direct links back to Home and Packages. |
| `/unauthorized` | **403 Access Denied** | Clear, branded alert indicating insufficient permissions for customer/staff attempting to access elevated management routes. |
| Server Exception | **500 Server Error** | User-friendly error message with recovery buttons without exposing stack traces or sensitive system details. |
