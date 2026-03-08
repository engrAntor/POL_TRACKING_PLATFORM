# POL Tracking Platform — Backend Documentation

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Django 5.x + Django REST Framework |
| Auth | JWT (SimpleJWT) — Email-based login |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Task Queue | Celery + Redis |
| Email | Google SMTP with HTML templates |
| Deployment | Docker (Redis), Local (Django, Celery) |

---

## Architecture Overview

```
backend/
├── config/              # Project settings, URLs, Celery config
├── apps/
│   ├── accounts/        # Auth, Users, Email Verification, OTP
│   ├── admin_dashboard/ # POL Items, Tracker, Inventory, Notifications
│   ├── superadmin/      # User Mgmt, Admin Mgmt, Orders
│   └── marketplace/     # Buy/Sell Listings
└── manage.py
```

---

## Database Models

### 1. User (accounts)
| Field | Type | Notes |
|-------|------|-------|
| email | EmailField | Primary login (USERNAME_FIELD), unique |
| first_name | CharField(100) | Required |
| last_name | CharField(100) | Required |
| phone | CharField(20) | Optional |
| company | CharField(200) | Optional |
| job_title | CharField(200) | Optional |
| role | CharField(20) | `admin` or `superadmin` |
| avatar | ImageField | Optional |
| is_email_verified | BooleanField | Must be True to login (admin) |
| is_active | BooleanField | Toggle by superadmin |
| created_at | DateTimeField | Auto |
| updated_at | DateTimeField | Auto |

### 2. EmailVerificationToken (accounts)
| Field | Type | Notes |
|-------|------|-------|
| user | FK → User | CASCADE |
| token | UUIDField | Auto-generated, unique |
| expires_at | DateTimeField | 24 hours from creation |

### 3. OTP (accounts)
| Field | Type | Notes |
|-------|------|-------|
| email | EmailField | |
| code | CharField(6) | Random 6-digit |
| purpose | CharField | `register` or `reset` |
| is_verified | BooleanField | |
| expires_at | DateTimeField | 5 minutes from creation |

### 4. POLItem (admin_dashboard)
| Field | Type | Notes |
|-------|------|-------|
| user | FK → User | CASCADE |
| product_name | CharField(200) | |
| brand | CharField(100) | |
| part_number | CharField(50) | |
| pol_type | CharField | `petroleum`, `oil`, `lubricant`, `other` |
| usage_rate | CharField(50) | e.g. "500Liters" |
| batch_number | CharField(50) | |
| shelf_life | CharField(50) | e.g. "5 years" |
| expiry | DateField | |
| expiry_status | CharField | `active`, `expired`, `near_expiry` |
| company | CharField(200) | |
| location | CharField(200) | Optional |
| status | CharField | `healthy`, `expired`, `low_stock` |
| quantity | Decimal(10,2) | |
| price_per_unit | Decimal(10,2) | |

### 5. Notification (admin_dashboard)
| Field | Type | Notes |
|-------|------|-------|
| user | FK → User | CASCADE |
| title | CharField(300) | |
| recipient_email | EmailField | |
| message | TextField | |
| status | CharField | `sent`, `pending`, `failed` |

### 6. Order (superadmin)
| Field | Type | Notes |
|-------|------|-------|
| user | FK → User | CASCADE |
| product_name | CharField(200) | |
| category | CharField(50) | Default: "Petroleum" |
| brand | CharField(100) | Optional |
| phone | CharField(20) | |
| location | CharField(200) | |
| quantity | Decimal(10,2) | |
| quantity_unit | CharField(20) | Default: "liter" |
| price_per_unit | Decimal(10,2) | |
| batch_number | CharField(50) | Optional |
| expiry | DateField | Optional |
| shelf_life | CharField(50) | Optional |
| status | CharField | `pending`, `approved`, `cancelled`, `delivered` |
| is_active | BooleanField | |

### 7. Listing (marketplace)
| Field | Type | Notes |
|-------|------|-------|
| user | FK → User | CASCADE |
| pol_item | FK → POLItem | SET_NULL, optional |
| name | CharField(200) | |
| company | CharField(200) | |
| pol_type | CharField | `petroleum`, `oil`, `lubricant`, `other` |
| price | Decimal(10,2) | |
| price_unit | CharField(20) | Default: "Liter" |
| description | TextField | Optional |
| location | CharField(200) | |
| brand | CharField(100) | Optional |
| batch_number | CharField(50) | Optional |
| expiry | DateField | Optional |
| shelf_life | CharField(50) | Optional |
| quantity | Decimal(10,2) | |
| quantity_unit | CharField(20) | Default: "Liter" |
| rating | Decimal(3,1) | Optional |
| category | CharField | `buy` or `sell` |
| status | CharField | `listed`, `unlisted`, `sold` |

---

## API Endpoints

### Authentication (`/api/auth/`)

| Method | Endpoint | Permission | Description |
|--------|----------|-----------|-------------|
| POST | `/register/` | Public | Register new admin user |
| GET | `/verify-email/?token=uuid` | Public | Verify email via token link |
| POST | `/resend-verification/` | Public | Resend verification email |
| POST | `/login/` | Public | Admin login (email must be verified) |
| POST | `/superadmin-login/` | Public | Super Admin login |
| POST | `/logout/` | Auth | Blacklist refresh token |
| POST | `/token/refresh/` | Public | Refresh access token |
| GET/PATCH | `/profile/` | Auth | Get/Update profile |
| POST | `/change-password/` | Auth | Change password |
| POST | `/send-otp/` | Public | Send OTP to email |
| POST | `/verify-otp/` | Public | Verify OTP code |
| POST | `/reset-password/` | Public | Reset password with verified OTP |

### Admin Dashboard (`/api/dashboard/`)

| Method | Endpoint | Permission | Description |
|--------|----------|-----------|-------------|
| GET | `/overview/` | Admin | Dashboard stats (items, expiry, stock, transactions) |
| GET | `/tracker/` | Admin | List POL items (filter, search, sort) |
| POST | `/tracker/create/` | Admin | Create new POL item |
| GET/PUT/PATCH/DELETE | `/tracker/<id>/` | Admin | Single POL item CRUD |
| GET | `/inventory/` | Admin | List inventory items |
| GET | `/notifications/` | Admin | List notifications |

### Super Admin (`/api/superadmin/`)

| Method | Endpoint | Permission | Description |
|--------|----------|-----------|-------------|
| GET | `/overview/` | SuperAdmin | Stats (total users, new today, monthly chart) |
| GET | `/users/` | SuperAdmin | List admin users |
| PATCH | `/users/<id>/toggle/` | SuperAdmin | Enable/disable user |
| DELETE | `/users/<id>/delete/` | SuperAdmin | Delete user |
| GET | `/administrators/` | SuperAdmin | List all admins & superadmins |
| POST | `/administrators/create/` | SuperAdmin | Create new administrator |
| PATCH | `/administrators/<id>/update/` | SuperAdmin | Update administrator |
| DELETE | `/administrators/<id>/delete/` | SuperAdmin | Delete administrator |
| GET | `/orders/` | SuperAdmin | List all orders |
| GET | `/orders/<id>/` | SuperAdmin | Order detail |
| PATCH | `/orders/<id>/status/` | SuperAdmin | Update order status |
| PATCH | `/orders/<id>/toggle/` | SuperAdmin | Toggle order active |
| DELETE | `/orders/<id>/delete/` | SuperAdmin | Delete order |

### Marketplace (`/api/marketplace/`)

| Method | Endpoint | Permission | Description |
|--------|----------|-----------|-------------|
| GET | `/listings/` | Auth | Browse all listed items |
| GET | `/listings/my/` | Admin | My listings |
| GET | `/listings/<id>/` | Auth | Listing detail |
| POST | `/listings/create/` | Admin | Create new listing |
| POST | `/listings/sell/` | Admin | Sell from inventory (auto-fill from POLItem) |
| PATCH/PUT | `/listings/<id>/update/` | Admin | Update listing |
| PATCH | `/listings/<id>/remove/` | Admin | Unlist a listing |
| DELETE | `/listings/<id>/delete/` | Admin | Delete listing |

---

## Authentication Flow

### Registration & Email Verification
```
1. POST /api/auth/register/  →  User created (is_email_verified=False)
                              →  Verification email sent via Celery+SMTP
2. User clicks "Confirm Email" button in email
   → Opens frontend /verify-email?token=<uuid>
3. User clicks "Confirm Email" on frontend page
   → GET /api/auth/verify-email/?token=<uuid>
   → is_email_verified = True
4. POST /api/auth/login/  →  Now works (returns JWT tokens)
```

### Password Reset
```
1. POST /api/auth/send-otp/     →  OTP sent to email (HTML template)
2. POST /api/auth/verify-otp/   →  OTP verified
3. POST /api/auth/reset-password/ →  Password changed
```

### JWT Token Structure
```json
{
  "access": "eyJ...",    // 60 min lifetime
  "refresh": "eyJ..."    // 7 day lifetime
}
```
- Send access token: `Authorization: Bearer <access_token>`
- Refresh when expired: `POST /api/auth/token/refresh/`

---

## Role-Based Access Control

| Role | Can Access | Login Endpoint |
|------|-----------|---------------|
| **admin** | Dashboard, Tracker, Inventory, Marketplace, Notifications | `/api/auth/login/` |
| **superadmin** | User Mgmt, Admin Mgmt, Orders, Overview | `/api/auth/superadmin-login/` |

Cross-login is blocked — admin cannot login through superadmin endpoint and vice versa.

---

## Services Architecture

```
┌──────────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Next.js (3000) │────▶│ Django (8000) │────▶│  SQLite / PgSQL │
│   Frontend       │     │ REST API      │     │  Database       │
└──────────────────┘     └──────┬───────┘     └─────────────────┘
                                │
                         ┌──────▼───────┐     ┌─────────────────┐
                         │ Celery Worker │────▶│  Redis (6379)   │
                         │ (Email Tasks) │     │  Message Broker │
                         └──────┬───────┘     └─────────────────┘
                                │
                         ┌──────▼───────┐
                         │  Gmail SMTP  │
                         │  (HTML Email)│
                         └──────────────┘
```

## Teammate's Scope (External API)
The following features exist in the **frontend only** — backend is handled by teammate via separate API:
- Ask Lilian (AI — Marketplace Assistant)
- Ask Marie (AI — Inventory Assistant)
- Contact Us page
- Super Admin Issues page

---

## Start All Services
```
.\start.bat
```
Starts: Docker → Redis → Celery → Django (8000) → Next.js (3000)

## Test Accounts
| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@poltracking.com | Admin@123 |
| Admin | user@poltracking.com | User@123 |
