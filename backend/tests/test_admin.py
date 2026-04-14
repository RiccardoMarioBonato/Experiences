"""
tests/test_admin.py — Admin-only endpoints.

Covers:
  GET    /admin/users        — admin success, recruiter 403, unauthenticated 401
  DELETE /admin/users/{id}  — admin deletes a user, non-existent 404
"""


# ── GET /admin/users ──────────────────────────────────────────────────────────


def test_admin_can_list_users_returns_200(client, admin_headers):
    resp = client.get("/admin/users", headers=admin_headers)
    assert resp.status_code == 200
    users = resp.json()
    assert isinstance(users, list)
    # Both seeded users (admin + recruiter) must be present
    assert len(users) >= 2
    roles = {u["role"] for u in users}
    assert "admin" in roles
    assert "recruiter" in roles


def test_recruiter_cannot_list_users_returns_403(client, recruiter_headers):
    resp = client.get("/admin/users", headers=recruiter_headers)
    assert resp.status_code == 403


def test_unauthenticated_cannot_list_users_returns_401(client):
    resp = client.get("/admin/users")
    assert resp.status_code == 401


# ── DELETE /admin/users/{id} ──────────────────────────────────────────────────


def test_admin_can_delete_user(client, admin_headers):
    # Resolve the recruiter's ID from the user list
    users = client.get("/admin/users", headers=admin_headers).json()
    recruiter = next(u for u in users if u["role"] == "recruiter")

    resp = client.delete(f"/admin/users/{recruiter['id']}", headers=admin_headers)
    assert resp.status_code == 204

    # Recruiter should no longer appear in the list
    remaining = client.get("/admin/users", headers=admin_headers).json()
    assert all(u["id"] != recruiter["id"] for u in remaining)


def test_admin_delete_nonexistent_user_returns_404(client, admin_headers):
    resp = client.delete("/admin/users/99999", headers=admin_headers)
    assert resp.status_code == 404
