"""
tests/test_auth.py — Authentication endpoints.

Covers:
  POST /auth/register  — success, duplicate e-mail
  POST /auth/login     — success, wrong password, unknown e-mail
"""

from tests.constants import RECRUITER_EMAIL, RECRUITER_PASSWORD


# ── Registration ──────────────────────────────────────────────────────────────


def test_register_success_returns_201_with_recruiter_role(client):
    resp = client.post(
        "/auth/register",
        json={"email": "new@example.com", "password": "password123", "full_name": "New User"},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == "new@example.com"
    assert data["role"] == "recruiter"
    assert data["full_name"] == "New User"
    assert "id" in data
    assert "created_at" in data


def test_register_duplicate_email_returns_400(client):
    payload = {"email": "dup@example.com", "password": "pass123"}
    client.post("/auth/register", json=payload)          # first — ok
    resp = client.post("/auth/register", json=payload)   # second — duplicate
    assert resp.status_code == 400


# ── Login ─────────────────────────────────────────────────────────────────────


def test_login_valid_credentials_returns_token_and_role(client):
    resp = client.post(
        "/auth/login",
        json={"email": RECRUITER_EMAIL, "password": RECRUITER_PASSWORD},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["role"] == "recruiter"
    assert data["full_name"] == "Test Recruiter"


def test_login_wrong_password_returns_401(client):
    resp = client.post(
        "/auth/login",
        json={"email": RECRUITER_EMAIL, "password": "wrongpassword"},
    )
    assert resp.status_code == 401


def test_login_unknown_email_returns_401(client):
    resp = client.post(
        "/auth/login",
        json={"email": "nobody@example.com", "password": "anything"},
    )
    assert resp.status_code == 401
