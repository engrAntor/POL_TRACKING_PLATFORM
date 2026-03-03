# POL Tracking Platform

A full-stack inventory and order management system built to **track, manage, and sell Petroleum, Oil, and Lubricants (POL) before expiry**. Features a dual-role system with separate dashboards for Admin and Super Admin users, a marketplace for buying/selling POL products, AI-powered assistants (Ask Lilian & Ask Marie), n8n workflow automation for issue reporting (admin submits problems via Contact Us, automatically routed to Super Admin Issues page through Jira integration), and a complete authentication system with email verification and OTP-based password recovery.

**Admin Panel:**<br>
https://poltrackingbyantor.netlify.app/

**Super Admin Panel:**<br>
https://poltrackingbyantor.netlify.app/superadmindash

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend | Django 5, Django REST Framework, SimpleJWT |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Task Queue | Celery + Redis |
| Email | Gmail SMTP with HTML templates |
| Deployment | Netlify (frontend), Local/Cloud (backend) |

---

## Features

### Admin Panel
- **Dashboard** — Overview stats, stock levels by POL type, near-expiry alerts, low stock warnings, recent orders
- **Usage Tracker** — Full CRUD for POL inventory items with filtering, search, and sorting
- **Inventory** — Stock monitoring and management
- **Marketplace** — Browse, buy, and sell POL products; create listings from inventory
- **Notifications** — Low stock, critical stock, and expiry alerts
- **Ask Lilian** — AI-powered marketplace assistant for product recommendations and queries
- **Ask Marie** — AI-powered inventory assistant for stock insights and management help
- **Contact Us** — Submit support requests and inquiries
- **Profile** — Edit profile, change password, upload avatar

### Super Admin Panel
- **Dashboard** — Total users, daily registrations, monthly user activity chart
- **Profile** — Edit profile, change password, upload avatar
- **Notifications** — New User Issue, New User Registered, New Order Placed
- **Administrator Management** — Create, edit, and delete admin/superadmin accounts
- **User Management** — View, enable/disable, and delete admin users
- **Order Management** — View all orders, update status (Pending/Approved/Cancelled), toggle active/inactive, delete
- **Issues** — View and manage support issues reported by admins

### Authentication
- Email-based registration with verification link
- OTP-based password reset (6-digit, 5-minute expiry)
- JWT access/refresh tokens with rotation and blacklisting
- Role-based login separation (admin vs superadmin)

---

## API Endpoints

### Auth (`/api/auth/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register/` | Register new admin |
| GET | `/verify-email/?token=uuid` | Verify email |
| POST | `/resend-verification/` | Resend verification email |
| POST | `/login/` | Admin login |
| POST | `/superadmin-login/` | Super admin login |
| POST | `/logout/` | Logout (blacklist token) |
| POST | `/token/refresh/` | Refresh access token |
| GET/PATCH | `/profile/` | View/update profile |
| POST | `/change-password/` | Change password |
| POST | `/send-otp/` | Send OTP to email |
| POST | `/verify-otp/` | Verify OTP code |
| POST | `/reset-password/` | Reset password with OTP |

### Admin Dashboard (`/api/dashboard/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/overview/` | Dashboard stats |
| GET | `/tracker/` | List POL items |
| POST | `/tracker/create/` | Create POL item |
| GET/PUT/PATCH/DELETE | `/tracker/<id>/` | Item detail/update/delete |
| GET | `/inventory/` | List inventory |
| GET | `/notifications/` | List notifications |

### Super Admin (`/api/superadmin/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/overview/` | Dashboard stats |
| GET | `/users/` | List admin users |
| PATCH | `/users/<id>/toggle/` | Enable/disable user |
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

### Marketplace (`/api/marketplace/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/listings/` | Browse all listings |
| GET | `/listings/my/` | My listings |
| GET | `/listings/<id>/` | Listing detail |
| POST | `/listings/create/` | Create listing |
| POST | `/listings/sell/` | Sell from inventory |
| PATCH/PUT | `/listings/<id>/update/` | Update listing |
| PATCH | `/listings/<id>/remove/` | Unlist |
| DELETE | `/listings/<id>/delete/` | Delete listing |

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Redis (via Docker)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env      # configure your environment variables
python manage.py migrate
python manage.py runserver
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

---

## Architecture

```
Frontend (Next.js)  ──REST API──▸  Backend (Django REST)  ──▸  Database
     │                                    │
     │                              Celery Worker  ──▸  Redis
     │                                    │
  Netlify                            Gmail SMTP
```
