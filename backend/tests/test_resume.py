"""
tests/test_resume.py — Resume section CRUD.

Covers:
  GET  /resume/           — public, grouped response, empty-title filter
  POST /resume/           — admin success, recruiter 403, unauthenticated 401
  PUT  /resume/{id}       — admin success, recruiter 403
  DELETE /resume/{id}     — admin success, non-existent 404
"""

import pytest


# ── Helper ────────────────────────────────────────────────────────────────────

def _create_section(client, admin_headers, **overrides) -> dict:
    payload = {
        "section_type": "about",
        "title": "Test Section",
        "order": 0,
    }
    payload.update(overrides)
    resp = client.post("/resume/", json=payload, headers=admin_headers)
    assert resp.status_code == 201, resp.text
    return resp.json()


# ── GET /resume/ ──────────────────────────────────────────────────────────────


def test_list_sections_is_public(client):
    resp = client.get("/resume/")
    assert resp.status_code == 200


def test_list_sections_returns_grouped_dict_by_section_type(client, admin_headers):
    _create_section(client, admin_headers, section_type="about", title="About Me")
    _create_section(client, admin_headers, section_type="experience", title="My Job")

    resp = client.get("/resume/")
    data = resp.json()

    assert isinstance(data, dict)
    assert "about" in data
    assert "experience" in data
    assert isinstance(data["about"], list)
    assert isinstance(data["experience"], list)
    # Every section in "about" must carry section_type == "about"
    for section in data["about"]:
        assert section["section_type"] == "about"


def test_list_sections_filters_out_empty_titles(client, admin_headers):
    _create_section(client, admin_headers, title="Visible Section")
    # Empty title: Pydantic allows str="" so the row is created but filtered on GET
    _create_section(client, admin_headers, section_type="experience", title="")

    resp = client.get("/resume/")
    all_titles = [s["title"] for sections in resp.json().values() for s in sections]

    assert "Visible Section" in all_titles
    assert "" not in all_titles


# ── POST /resume/ ─────────────────────────────────────────────────────────────


def test_admin_can_create_section_returns_201(client, admin_headers):
    resp = client.post(
        "/resume/",
        json={"section_type": "skills", "title": "Python", "order": 1},
        headers=admin_headers,
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Python"
    assert data["section_type"] == "skills"
    assert "id" in data


def test_recruiter_cannot_create_section_returns_403(client, recruiter_headers):
    resp = client.post(
        "/resume/",
        json={"section_type": "skills", "title": "Python"},
        headers=recruiter_headers,
    )
    assert resp.status_code == 403


def test_unauthenticated_cannot_create_section_returns_401(client):
    resp = client.post(
        "/resume/",
        json={"section_type": "skills", "title": "Python"},
    )
    assert resp.status_code == 401


# ── PUT /resume/{id} ──────────────────────────────────────────────────────────


def test_admin_can_update_section_returns_200(client, admin_headers):
    section = _create_section(client, admin_headers, title="Original Title")
    section_id = section["id"]

    resp = client.put(
        f"/resume/{section_id}",
        json={"title": "Updated Title"},
        headers=admin_headers,
    )
    assert resp.status_code == 200
    assert resp.json()["title"] == "Updated Title"


def test_recruiter_cannot_update_section_returns_403(client, admin_headers, recruiter_headers):
    section_id = _create_section(client, admin_headers)["id"]

    resp = client.put(
        f"/resume/{section_id}",
        json={"title": "Hacked"},
        headers=recruiter_headers,
    )
    assert resp.status_code == 403


# ── DELETE /resume/{id} ───────────────────────────────────────────────────────


def test_admin_can_delete_section_returns_204(client, admin_headers):
    section_id = _create_section(client, admin_headers)["id"]

    resp = client.delete(f"/resume/{section_id}", headers=admin_headers)
    assert resp.status_code == 204

    # Confirm it is gone
    assert client.get(f"/resume/{section_id}").status_code == 404


def test_delete_nonexistent_section_returns_404(client, admin_headers):
    resp = client.delete("/resume/99999", headers=admin_headers)
    assert resp.status_code == 404
