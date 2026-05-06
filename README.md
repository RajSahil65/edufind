# EduFind — College Discovery Platform

A production-grade MVP for discovering, comparing, and predicting college admissions in India.

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| Frontend | `https://edufind.vercel.app` _(deploy to get URL)_ |
| Backend API | `https://edufind-api.railway.app` _(deploy to get URL)_ |

---

## ✅ Features Built (6 of 6)

| Feature | Status | Notes |
|---------|--------|-------|
| **College Listing + Search** | ✅ Complete | Search, 4 filters, 5 sort modes, pagination |
| **College Detail Page** | ✅ Complete | Overview, Courses, Placements, Reviews tabs |
| **Compare Colleges** | ✅ Complete | Up to 3 colleges, 11 metrics, winner highlighting |
| **Rank Predictor** | ✅ Complete | JEE/CAT/GATE/State CET, 3 confidence tiers |
| **Q&A / Discussion** | ✅ Complete | Ask/answer questions, upvotes, accepted answers, tags |
| **Auth + Saved Items** | ✅ Complete | JWT auth, save colleges, save comparisons, dashboard |

---

## 🏗️ Architecture

```
college-platform/
├── frontend/          # Next.js 14 + Tailwind CSS → Vercel
│   └── src/
│       ├── app/       # App Router pages
│       │   ├── auth/       # Login + Registration
│       │   ├── dashboard/  # Saved colleges & comparisons
│       │   ├── profile/    # User profile
│       │   ├── qa/         # Q&A list + detail pages
│       │   ├── colleges/   # College list + detail
│       │   ├── compare/    # College comparison table
│       │   └── predictor/  # Rank predictor
│       ├── components/     # Reusable UI (Navbar, CollegeCard, CompareBar)
│       ├── context/        # AuthContext, CompareContext
│       └── lib/            # API client, types, utilities
│
└── backend/           # Node.js + TypeScript + Express → Railway/Render
    └── src/
        ├── index.ts         # Express app entry
        ├── db.ts            # PostgreSQL schema (10 tables)
        ├── seed.ts          # 30 colleges + courses + reviews + predictor data
        ├── middleware/
        │   └── auth.ts      # JWT middleware (requireAuth, optionalAuth)
        └── routes/
            ├── colleges.ts  # List, detail, compare endpoints
            ├── predictor.ts # Rank prediction
            ├── auth.ts      # Register, login, me, saved items
            └── qa.ts        # Questions, answers, upvotes, accept
```

### Database Schema (PostgreSQL — 10 tables)

```
colleges          — 30 colleges with full metadata
courses           — 150+ courses linked to colleges
reviews           — Mock reviews per college
predictor_data    — Rank cutoff ranges per exam/college
users             — Auth: registered users
saved_colleges    — User → College (many-to-many)
saved_comparisons — User's saved comparison sets
questions         — Q&A questions (with college tag)
answers           — Q&A answers per question
question_upvotes  — Upvote tracking (user × question)
answer_upvotes    — Upvote tracking (user × answer)
```

---

## 🔌 API Reference

### Auth Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, returns JWT token |
| GET | `/api/auth/me` | Required | Get current user |
| GET | `/api/auth/saved` | Required | Get saved colleges & comparisons |
| POST | `/api/auth/saved/college/:id` | Required | Save a college |
| DELETE | `/api/auth/saved/college/:id` | Required | Unsave a college |
| POST | `/api/auth/saved/comparison` | Required | Save a comparison |
| DELETE | `/api/auth/saved/comparison/:id` | Required | Delete a saved comparison |

### Q&A Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/qa` | Optional | List questions (filter/search/sort) |
| GET | `/api/qa/:id` | Optional | Get question + answers |
| POST | `/api/qa` | Required | Ask a question |
| POST | `/api/qa/:id/answers` | Required | Post an answer |
| POST | `/api/qa/:id/upvote` | Required | Toggle upvote on question |
| POST | `/api/qa/answers/:id/upvote` | Required | Toggle upvote on answer |
| PATCH | `/api/qa/answers/:id/accept` | Required | Accept answer (question author only) |

**GET `/api/qa` query params:**
```
college_id  — filter by college
search      — full text search
sort        — latest | popular | unanswered
page, limit — pagination
```

### College Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/colleges` | List with search/filter/pagination |
| GET | `/api/colleges/filters` | Available filter options |
| GET | `/api/colleges/compare/multi?ids=` | Compare 2-3 colleges |
| GET | `/api/colleges/:id` | College detail + courses + reviews |

### Predictor

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/predictor/exams` | Available exams + categories |
| POST | `/api/predictor` | Predict colleges by rank |

---

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure Environment

```bash
# Backend
cp .env.example .env
# Edit: DATABASE_URL, JWT_SECRET

# Frontend
cp .env.local.example .env.local
# Edit: NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Database + Seed

```bash
psql -U postgres -c "CREATE DATABASE college_platform;"

cd backend
npm run dev          # Auto-creates all tables
# In another terminal:
npm run db:seed      # Seeds 30 colleges + all data
```

### 4. Run Frontend

```bash
cd frontend && npm run dev
# Open http://localhost:3000
```

---

## 📦 Deployment

### Backend → Railway

1. Push to GitHub
2. New Project → Deploy from GitHub (select `backend/` folder)
3. Add PostgreSQL plugin
4. Set env vars: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `NODE_ENV=production`
5. Run: `railway run npm run db:seed`

### Frontend → Vercel

1. Import repo on Vercel → set Root Directory: `frontend`
2. Add env var: `NEXT_PUBLIC_API_URL=https://your-backend.railway.app`
3. Deploy

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS, Custom design system |
| State | React Context (Auth + Compare) |
| HTTP Client | Axios |
| Backend | Node.js, Express, TypeScript |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Database | PostgreSQL (pg driver) |
| Deployment (FE) | Vercel |
| Deployment (BE) | Railway / Render |

---

## 📊 Seed Data

- **30 colleges** — IITs, NITs, IIITs, IIMs, private universities
- **~150 courses** — B.Tech, M.Tech, MBA across degrees
- **~80 reviews** — realistic mock reviews
- **~400 predictor records** — rank cutoffs per exam

All data in PostgreSQL — no hardcoded UI data.
