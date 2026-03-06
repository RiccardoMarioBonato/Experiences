# RickFolio — Live Resume Platform

> "This isn't a PDF. It's a living resume — built from scratch, designed to show you exactly what I can do before you even reach out."

**RickFolio** is a full-stack, role-based resume portfolio platform built by **Riccardo M. Bonato**. Instead of a static PDF, this resume lives as a dynamic, interactive site — managed through an admin, annotated by recruiters with comments, and publicly viewable by anyone with the link.


---

## Project Overview

| | |
|---|---|
| **Type** | Full-Stack Web Application |
| **Architecture** | Layered (N-Tier) Architecture |
| **Containerization** | Docker + Docker Compose |
| **Course** | Software Architecture |

---

## System Architecture Overview

The system follows a **Layered (N-Tier) Architecture** with 4 distinct layers:

```
┌─────────────────────────────────────┐
│        Presentation Layer           │  Next.js 14 (App Router)
├─────────────────────────────────────┤
│           API Layer                 │  FastAPI + Uvicorn
├─────────────────────────────────────┤
│       Business Logic Layer          │  Services + Depends() Role Guards
├─────────────────────────────────────┤
│          Data Layer                 │  SQLAlchemy + PostgreSQL
└─────────────────────────────────────┘
```

All layers run as isolated **Docker containers** orchestrated with **Docker Compose**.

```
docker-compose.yml
├── frontend      (Next.js)     → port 3000
├── backend       (FastAPI)     → port 8000
└── db            (PostgreSQL)  → port 5432
```

---

## User Roles & Permissions

### 👨‍💻 Admin (Portfolio Owner)
| Permission | Access |
|---|---|
| Resume Sections | Full CRUD |
| User Accounts | Full CRUD |
| Recruiter Comments | Read + Delete |
| Admin Dashboard | ✅ Full Access |

### 🧑‍💼 Recruiter (Hiring Manager)
| Permission | Access |
|---|---|
| Resume Content | Read Only |
| Own Comments | Full CRUD |
| Other Comments | Read Only |
| Admin Dashboard | ❌ No Access |

### 🌐 Guest (Public Visitor)
| Permission | Access |
|---|---|
| Public Resume Page | Read Only |
| PDF Download | ✅ Allowed |
| Comments | ❌ No Access |
| Login Required | ❌ None |

---

## Technology Stack

### Frontend
- **Next.js 14** — App Router, SSR for public resume page (SEO friendly)
- **Tailwind CSS** — Responsive, utility-first styling
- **Axios** — HTTP client with JWT interceptors

### Backend
- **FastAPI** — REST API with auto Swagger docs at `/docs`
- **Uvicorn** — ASGI server
- **python-jose** — JWT token creation and verification
- **passlib + bcrypt** — Secure password hashing

### Database
- **PostgreSQL** — Relational database
- **SQLAlchemy** — ORM for models and queries
- **Alembic** — Schema migration management

### DevOps
- **Docker** — Containerizes each service (frontend, backend, db)
- **Docker Compose** — Orchestrates all containers with one command

---

## Installation & Setup

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- That's it — no need to install Node.js, Python, or PostgreSQL locally

---

### 1. Clone the repository

```bash
git clone https://github.com/RiccardoMarioBonato/RiccardoMarioBonato.github.io.git
cd RiccardoMarioBonato.github.io
```

---

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourpassword
POSTGRES_DB=rickfolio

# Backend
DATABASE_URL=postgresql://postgres:yourpassword@db:5432/rickfolio
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

### 3. Run with Docker Compose

```bash
docker-compose up --build
```

All three containers (frontend, backend, db) will start together.

| Service | URL |
|---|---|
| Public Resume | `http://localhost:3000` |
| Admin Dashboard | `http://localhost:3000/admin` |
| Recruiter View | `http://localhost:3000/recruiter` |
| FastAPI Swagger Docs | `http://localhost:8000/docs` |

---

### 4. Run database migrations

In a separate terminal after containers are running:

```bash
docker-compose exec backend alembic upgrade head
```

---

### Useful Docker Commands

```bash
# Start all containers
docker-compose up

# Start in background (detached)
docker-compose up -d

# Stop all containers
docker-compose down

# Rebuild after code changes
docker-compose up --build

# View logs
docker-compose logs -f

# Access backend container shell
docker-compose exec backend bash

# Access database
docker-compose exec db psql -U postgres -d rickfolio
```

---

## How to Run the System

| Role | URL | Login Required |
|---|---|---|
| Guest | `http://localhost:3000` | ❌ No |
| Recruiter | `http://localhost:3000/login` | ✅ Yes |
| Admin | `http://localhost:3000/login` | ✅ Yes |
| API Docs | `http://localhost:8000/docs` | ❌ No |

---
## Author

**Riccardo M. Bonato**  
Full-Stack Developer  
