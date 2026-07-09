# POL Tracking Platform

A full-stack inventory and order management system built to **track, manage, and sell Petroleum, Oil, and Lubricants (POL) before expiry**. The platform features a dual-role system with separate dashboards for Admin and Super Admin users, a marketplace for buying/selling POL products, AI-powered assistants (Lilian & Marie), a Support Ticket System with n8n workflow automation, Stripe-powered payments and subscriptions, Google OAuth login, and a complete authentication system with email verification and OTP-based password recovery.

**Below is the full presentation video walking through every feature of the platform in detail:**<br>
📹 Video Link: https://drive.google.com/file/d/1DyC9Vxe6nUQbo6U15trIA-qL0ODeRsqn/view?usp=sharing

**Live Link:**<br>
https://aerovectranexus.com

**Admin Panel:**<br>
https://poltrackingbyantor.netlify.app

**Super Admin Panel:**<br>
https://poltrackingbyantor.netlify.app/superadmindash

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend | Django 5, Django REST Framework, SimpleJWT |
| AI Backend | Django + FAISS (RAG-powered, separate service) |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Task Queue | Celery + Redis |
| Email | Gmail SMTP with HTML templates |
| Payments | Stripe (Checkout, Subscriptions, Connect) |
| Auth | JWT (SimpleJWT) + Google OAuth 2.0 |
| Containerization | Docker & Docker Compose |
| Deployment | Netlify (frontend), Docker/Cloud (backend) |

---

## Features

### 01. Authentication & Registration

- **Account Registration** — Create a new account with email + password
- **Secure Login** — Email + password login with email verification guard
- **Google OAuth Login** — Sign in with Google (OAuth 2.0, server-side token verification)
- **Super Admin Login** — Separate login portal for superadmin role
- **Email Verification** — Token-based link (24-hour expiry), sent via Celery worker
- **Resend Verification Email** — Regenerate and resend verification link
- **Forgot Password — OTP Flow** — Send OTP to registered email address
- **OTP Verification** — 6-digit code confirmation with expiry check
- **Reset Password** — Set new password after verified OTP
- **Change Password** — Update password from within the dashboard
- **JWT Token Refresh** — Silent session renewal using refresh tokens
- **Token Blacklist on Logout** — Prevents reuse of invalidated tokens
- **Role-Based Login Guard** — Admin and superadmin routed to separate portals

---

### 02. User Dashboard (Admin)

#### Overview Panel
- Total POL Items in system
- Near Expiry Items Count
- Low Stock Items Count
- Active Transactions Count
- Stock Levels by Status (Healthy / Expired / Low Stock)
- Recent Orders Summary

#### POL Usage Tracker (Full CRUD)
- Add / Edit / Delete POL items
- **Core Fields:** Part Number, Product Name, POL Type (Petroleum / Oil / Lubricant), Unit of Measurement (14 units: GAL, QT, OZ, LB, ML, PT, KT, GM, FT, YD, CC, RL, EA, SQ ST), Quantity, Shelf Life, Expiry Date, Condition (New / Leftover / Opened POL), Price Per Unit
- **Optional Fields:** Alt Part Number, Manufacturer Part Number, MIL Spec, Serial Number, Batch Number, Source, Balance, Notes
- **Image Upload** per item
- **MSDS File Upload** (PDF attachment per item)
- Auto-computed **Health Status**: Healthy / Expired / Low Stock
- Auto-computed **Expiry Status**: Active / Near Expiry / Expired
- Filter by Status & Expiry Status
- Search by Product Name or Part Number
- Sort by Expiry / Date Created / Product Name

#### Inventory View
- All POL items with filter & search
- Used as source for Marketplace listings

#### Bulk Data Import
- Upload **CSV / XLS / XLSX** files
- Auto-populate item fields from spreadsheet columns
- Supports multiple date formats (YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY)
- Row-level error reporting
- Smart upsert: create new or update existing items (matched by Part Number + Expiry)

#### Notifications
- Expiry Alerts with Alert / Pending status
- Manually trigger expiry alert generation
- Notification list with timestamps

---

### 03. Marketplace

- Browse all listings (platform-wide)
- My Listings (own active/sold listings)
- Create a New Listing (manual entry)
- Sell from Inventory (link listing to an existing POL item)
- Listing Detail Page
- Update / Remove / Delete a Listing
- Listing Statuses: **Listed / Unlisted / Sold**
- Category: **Buy / Sell**
- SDS File upload per listing
- Rating field per listing

#### Marketplace Orders & Checkout
- **Stripe Checkout** integration per listing
- Payment verification (session-based)
- Stripe Webhook for order fulfillment
- Order tracking: **Pending / Approved / Cancelled**

---

### 04. Subscription Management

- Subscription tiers: **Basic ($29) / Business ($99) / Premium ($299)**
- Stripe Checkout for subscription upgrade
- Session-based payment verification and tier update
- **Stripe Connect Onboarding** for sellers (Express Account)
- Stripe onboarding status check (details submitted, charges enabled, payouts enabled)

---

### 05. AI Backend — POL AI Assistants

#### Lilian AI (Inventory Assistant)
- FAISS RAG-powered conversational AI
- Inventory-context aware responses
- Per-user conversation history

#### Marie AI (Marketplace Assistant)
- FAISS RAG-powered conversational AI
- Marketplace-context aware responses
- Per-user conversation history

#### Support Ticket System
- Users can create support tickets (via Contact Us)
- Admin ticket list & detail view
- Ticket resolution flow with status update
- Notification triggered on ticket resolution
- n8n workflow automation — tickets automatically routed to Super Admin Issues page via Jira integration

#### Security
- JWT-authenticated AI requests
- Rate limiting on all AI endpoints

---

### 06. Super Admin Dashboard

#### Overview Panel
- Platform-wide statistics (users, orders, registrations)

#### User Management
- List all registered users
- Toggle user Active / Inactive
- Delete users

#### Administrator Management
- List all administrators
- Create new administrators
- Update administrator details
- Delete administrators

#### Orders Management
- View all orders (platform-wide)
- Order detail view
- Approve / Cancel orders (status update)
- Toggle order active/inactive
- Delete orders
- **Platform Commission** tracking per order

#### Notifications
- New Order Placed alerts
- New User Registered alerts
- Mark notification as read
- Notification list (reverse chronological)

#### Issues (Support Tickets)
- View all user-submitted support tickets
- Respond to / resolve tickets

---

### 07. Infrastructure & DevOps

- **Docker & Docker Compose** — Multi-service containerized setup
- **Redis** — Celery message broker for async task queuing
- **Celery Workers** — Async tasks: email verification, OTP delivery, expiry alert generation
- **Django REST Framework** — Main backend API
- **FAISS AI Backend** — Separate Django service for AI assistants
- **Next.js Frontend** — TypeScript, SSR-ready, Tailwind CSS
- **SimpleJWT** — Access/refresh tokens, rotation, blacklisting
- **Stripe** — Checkout, Subscriptions, Connect (payouts)
- **Google OAuth 2.0** — Social login
- **CORS** — Configured for secure cross-origin API access
- **Netlify** — Frontend deployment (`netlify.toml` preconfigured)
- **Environment Variables** — `.env` based config for all services

---

## API Endpoints

### Auth (`/api/auth/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register/` | Register new admin |
| GET | `/verify-email/?token=` | Verify email via link |
| POST | `/resend-verification/` | Resend verification email |
| POST | `/login/` | Admin login |
| POST | `/google-login/` | Google OAuth login |
| POST | `/superadmin-login/` | Super admin login |
| POST | `/logout/` | Logout (blacklist token) |
| POST | `/token/refresh/` | Refresh access token |
| GET/PATCH | `/profile/` | View / update profile |
| POST | `/change-password/` | Change password |
| POST | `/send-otp/` | Send OTP to email |
| POST | `/verify-otp/` | Verify OTP code |
| POST | `/reset-password/` | Reset password with OTP |
| POST | `/subscribe/` | Start subscription checkout |
| POST | `/verify-subscription/` | Verify subscription payment |
| POST | `/stripe-connect/` | Start Stripe Connect onboarding |
| GET | `/stripe-verify/` | Check Stripe onboarding status |

### Admin Dashboard (`/api/dashboard/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/overview/` | Dashboard stats |
| GET | `/tracker/` | List POL items |
| POST | `/tracker/create/` | Create POL item |
| GET/PUT/PATCH/DELETE | `/tracker/<id>/` | Item detail / update / delete |
| POST | `/tracker/<id>/upload-msds/` | Upload MSDS file to item |
| GET | `/inventory/` | List inventory |
| GET | `/notifications/` | List notifications |
| POST | `/notifications/trigger-expiry/` | Manually trigger expiry alerts |
| POST | `/upload-csv/` | Bulk import CSV/XLS/XLSX |

### Marketplace (`/api/marketplace/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/listings/` | Browse all listings |
| GET | `/listings/my/` | My listings |
| GET | `/listings/inventory/` | My inventory (for listing creation) |
| GET | `/listings/<id>/` | Listing detail |
| POST | `/listings/create/` | Create listing |
| POST | `/listings/sell/` | Sell from inventory |
| PATCH/PUT | `/listings/<id>/update/` | Update listing |
| PATCH | `/listings/<id>/remove/` | Unlist a listing |
| DELETE | `/listings/<id>/delete/` | Delete listing |
| POST | `/checkout/` | Create Stripe checkout session |
| POST | `/verify-payment/` | Verify payment session |
| POST | `/webhook/` | Stripe webhook handler |

### Super Admin (`/api/superadmin/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/overview/` | Platform-wide stats |
| GET | `/users/` | List admin users |
| PATCH | `/users/<id>/toggle/` | Enable / disable user |
| DELETE | `/users/<id>/delete/` | Delete user |
| GET | `/administrators/` | List administrators |
| POST | `/administrators/create/` | Create administrator |
| PATCH | `/administrators/<id>/update/` | Update administrator |
| DELETE | `/administrators/<id>/delete/` | Delete administrator |
| GET | `/orders/` | List all orders |
| GET | `/orders/<id>/` | Order detail |
| PATCH | `/orders/<id>/status/` | Update order status |
| PATCH | `/orders/<id>/toggle/` | Toggle order active |
| DELETE | `/orders/<id>/delete/` | Delete order |
| GET | `/notifications/` | List superadmin notifications |
| PATCH | `/notifications/<id>/read/` | Mark notification as read |

### AI Backend (`/api/ai/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chat/` | Chat with Lilian (Inventory AI) |
| POST | `/marketplace-chat/` | Chat with Marie (Marketplace AI) |
| GET | `/history/<assistant>/` | Conversation history |
| POST | `/tickets/` | Create support ticket |
| GET | `/tickets/admin/` | Admin ticket list |
| GET/PATCH | `/tickets/admin/<id>/` | Ticket detail / resolve |

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Redis (via Docker or local install)
- Docker & Docker Compose (optional, for full containerized setup)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # configure your environment variables
python manage.py migrate
python manage.py runserver
```

### AI Backend Setup
```bash
cd POL_AI-main
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py runserver 8001
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Start Celery Worker
```bash
cd backend
celery -A config worker --loglevel=info
```

### Docker (All Services)
```bash
docker-compose up --build
```

---

## Architecture

```
Frontend (Next.js)
      │
      ├──REST API──▶  Backend (Django REST)  ──▶  Database (SQLite/PostgreSQL)
      │                       │
      │                 Celery Worker  ──▶  Redis  ──▶  Gmail SMTP
      │
      └──REST API──▶  AI Backend (Django + FAISS)
                              │
                        FAISS Vector Index
                        (Inventory + Marketplace RAG)

Payments:  Stripe Checkout / Subscriptions / Connect
Auth:      JWT (SimpleJWT) + Google OAuth 2.0
Deploy:    Netlify (frontend) + Docker/Cloud (backend + AI)
```

---

## Environment Variables

Key variables required in `.env`:

```
# Django
SECRET_KEY=
DEBUG=
FRONTEND_URL=

# Database
DATABASE_URL=

# JWT
JWT_SECRET_KEY=

# Email
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Google OAuth
GOOGLE_CLIENT_ID=

# Redis / Celery
CELERY_BROKER_URL=
```

---

## License

This project is proprietary software. All rights reserved.
