"""
tests/test_layer_integrity.py — Architecture fitness functions.

These tests encode structural invariants of the codebase.  They must pass
on every commit and will catch regressions if the layer boundaries are
accidentally violated.

Rules enforced
--------------
1. Routers never import the database layer directly.
2. Services never raise HTTP-level exceptions.
3. Every POST and PUT endpoint declares a typed Pydantic request body.
"""

import inspect
import re
from pathlib import Path

import pytest
from fastapi.routing import APIRoute
from pydantic import BaseModel

from main import app

BACKEND_DIR = Path(__file__).resolve().parent.parent
ROUTERS_DIR = BACKEND_DIR / "routers"
SERVICES_DIR = BACKEND_DIR / "services"


# ── File-grep helper ──────────────────────────────────────────────────────────

def _grep(directory: Path, pattern: str) -> list[tuple[str, int, str]]:
    """Return (relative_path, lineno, stripped_line) for every match."""
    matches = []
    regex = re.compile(pattern)
    for path in sorted(directory.rglob("*.py")):
        if "__pycache__" in path.parts:
            continue
        for lineno, raw_line in enumerate(
            path.read_text(encoding="utf-8").splitlines(), start=1
        ):
            if regex.search(raw_line):
                rel = str(path.relative_to(BACKEND_DIR))
                matches.append((rel, lineno, raw_line.strip()))
    return matches


# ── Test 1: Routers have no direct DB imports ────────────────────────────────

DB_IMPORT_PATTERNS = [
    r"from database import",   # e.g. from database import SessionLocal
    r"from models import",     # e.g. from models import User  (catches submodule imports too)
    r"\bimport models\b",      # e.g. import models
    r"\bdb\.query\b",          # raw ORM call
    r"\bdb\.add\b",
    r"\bdb\.commit\b",
    r"\bdb\.delete\b",
]


@pytest.mark.parametrize("pattern", DB_IMPORT_PATTERNS)
def test_routers_have_no_direct_db_access(pattern):
    matches = _grep(ROUTERS_DIR, pattern)
    assert matches == [], (
        f"Pattern {pattern!r} found in routers/ — DB access must stay in services/:\n"
        + "\n".join(f"  {f}:{ln}  {line}" for f, ln, line in matches)
    )


# ── Test 2: Services never raise HTTPException ────────────────────────────────

def test_services_never_raise_http_exception():
    matches = _grep(SERVICES_DIR, r"\bHTTPException\b")
    assert matches == [], (
        "HTTPException found in services/ — HTTP concerns belong in routers/ only:\n"
        + "\n".join(f"  {f}:{ln}  {line}" for f, ln, line in matches)
    )


# ── Test 3: Every POST and PUT route has a typed Pydantic body ────────────────

def test_all_post_put_routes_declare_pydantic_body():
    """
    Inspects the endpoint function's signature directly.
    A route passes if at least one parameter is annotated with a class that
    is a subclass of pydantic.BaseModel (i.e. a schema, not Session/int/str).
    """
    violations = []

    for route in app.routes:
        if not isinstance(route, APIRoute):
            continue
        if not (route.methods & {"POST", "PUT"}):
            continue

        sig = inspect.signature(route.endpoint)
        has_pydantic_body = any(
            isinstance(param.annotation, type)
            and issubclass(param.annotation, BaseModel)
            for param in sig.parameters.values()
            if param.annotation is not inspect.Parameter.empty
        )

        if not has_pydantic_body:
            violations.append(f"{sorted(route.methods)} {route.path}")

    assert not violations, (
        "POST/PUT routes with no typed Pydantic body parameter:\n"
        + "\n".join(f"  {v}" for v in violations)
    )
