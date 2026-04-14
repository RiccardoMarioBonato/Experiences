"""
RickFolio test configuration.

Architecture
------------
* Override DATABASE_URL → SQLite before any app module is imported so that
  database.py creates its engine against SQLite, never Postgres.
* Monkey-patch database.engine / database.SessionLocal to a StaticPool SQLite
  engine so every session shares the same in-memory database.
* Drop + recreate all tables and re-seed before every test (autouse fixture).
* No Postgres, no network, no SMTP required.
"""

import os
import sys
from pathlib import Path

# ── 1. Env vars MUST be set before any app module is imported ────────────────
os.environ["DATABASE_URL"] = "sqlite://"          # in-memory SQLite
os.environ.setdefault("SECRET_KEY", "test-secret-key-not-for-production")
os.environ.setdefault("ALGORITHM", "HS256")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
os.environ.setdefault("CORS_ORIGINS", "http://localhost:3000")

# ── 2. Put backend/ on sys.path so bare module names resolve ─────────────────
BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

# ── 2b. Fix passlib 1.7.4 + bcrypt 4.x incompatibility ──────────────────────
# passlib's internal wrap-bug detector calls bcrypt.hashpw() with a 300-byte
# secret.  bcrypt 4.x raises ValueError for inputs > 72 bytes instead of
# silently truncating, which crashes passlib's backend initialisation.
# The fix: swap the CryptContext on services.auth to sha256_crypt so that
# tests never touch bcrypt at all.  All hash/verify paths remain consistent
# because both seed and runtime calls use the same patched context.
from passlib.context import CryptContext as _CryptContext  # noqa: E402
import services.auth as _auth_module  # noqa: E402

_auth_module.pwd_context = _CryptContext(schemes=["sha256_crypt"], deprecated="auto")

# ── 3. Build the test engine with StaticPool (single shared connection) ──────
import pytest  # noqa: E402
from sqlalchemy import create_engine  # noqa: E402
from sqlalchemy.orm import sessionmaker  # noqa: E402
from sqlalchemy.pool import StaticPool  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

_test_engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
_TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=_test_engine
)

# ── 4. Patch the database module BEFORE main.py is imported ──────────────────
#
# database.py creates `engine` and `SessionLocal` at module-load time.
# Importing it first (with DATABASE_URL already set to sqlite://) gives us
# access to `Base`.  We then replace engine/SessionLocal so every downstream
# `from database import engine` or `from database import SessionLocal` — which
# happens when main.py imports its routers — binds to our test objects.
#
import database as _db_module  # noqa: E402

_db_module.engine = _test_engine
_db_module.SessionLocal = _TestingSessionLocal

# ── 5. Safe to import the app now; it will use _test_engine everywhere ────────
from main import app  # noqa: E402
from database import Base  # noqa: E402
import models  # noqa: E402  — registers User, Role, ResumeSection, Comment with Base

from models.user import Role, User  # noqa: E402
from models.resume import ResumeSection, SectionType  # noqa: E402
from services.auth import hash_password, create_access_token  # noqa: E402
from tests.constants import (  # noqa: E402
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    RECRUITER_EMAIL,
    RECRUITER_PASSWORD,
)


def _seed(db) -> None:
    """Create roles + one admin + one recruiter.  Always called on a fresh DB."""
    for name in ("guest", "recruiter", "admin"):
        db.add(Role(name=name))
    db.flush()

    admin_role = db.query(Role).filter(Role.name == "admin").first()
    db.add(
        User(
            email=ADMIN_EMAIL,
            hashed_password=hash_password(ADMIN_PASSWORD),
            full_name="Test Admin",
            role_id=admin_role.id,
        )
    )

    recruiter_role = db.query(Role).filter(Role.name == "recruiter").first()
    db.add(
        User(
            email=RECRUITER_EMAIL,
            hashed_password=hash_password(RECRUITER_PASSWORD),
            full_name="Test Recruiter",
            role_id=recruiter_role.id,
        )
    )
    db.commit()


# ── Core fixtures ─────────────────────────────────────────────────────────────


@pytest.fixture(autouse=True)
def reset_db():
    """Drop + recreate all tables and re-seed before every test."""
    Base.metadata.drop_all(bind=_test_engine)
    Base.metadata.create_all(bind=_test_engine)
    db = _TestingSessionLocal()
    try:
        _seed(db)
    finally:
        db.close()
    yield  # test body runs here; teardown of next reset_db handles cleanup


@pytest.fixture
def client(reset_db):
    """Synchronous TestClient wired to the SQLite test DB."""
    with TestClient(app) as c:
        yield c


def _make_token(role_name: str) -> str:
    """Query the seeded user for *role_name* and return a valid JWT."""
    db = _TestingSessionLocal()
    try:
        user = db.query(User).join(Role).filter(Role.name == role_name).first()
        return create_access_token({"sub": str(user.id), "role": role_name})
    finally:
        db.close()


@pytest.fixture
def admin_headers(reset_db) -> dict:
    return {"Authorization": f"Bearer {_make_token('admin')}"}


@pytest.fixture
def recruiter_headers(reset_db) -> dict:
    return {"Authorization": f"Bearer {_make_token('recruiter')}"}
