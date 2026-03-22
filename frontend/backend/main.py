from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from database import engine, Base
import models  # noqa: ensure all models are registered with Base

from routers import auth, resume, comments, admin

# Create all tables (Alembic handles migrations; this is a fallback for dev)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PortfolioOS API",
    description="Role-based resume portfolio API for Riccardo M. Bonato",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ────────────────────────────────────────────────────────────────────
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(comments.router)
app.include_router(admin.router)


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok", "service": "PortfolioOS API"}
