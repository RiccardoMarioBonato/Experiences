"""
tests/test_comments.py — Comment CRUD.

Covers:
  GET    /comments/{section_id}    — public, sorted order, author_display field
  POST   /comments/{section_id}    — recruiter success, unauthenticated 401
  PUT    /comments/{id}            — owner can edit
  DELETE /comments/{id}            — owner can delete, other recruiter 403
  DELETE /admin/comments/{id}      — admin can delete any comment
"""


# ── Helpers ───────────────────────────────────────────────────────────────────

def _create_section(client, admin_headers, title="Comment Test Section") -> int:
    resp = client.post(
        "/resume/",
        json={"section_type": "about", "title": title, "order": 0},
        headers=admin_headers,
    )
    assert resp.status_code == 201, resp.text
    return resp.json()["id"]


def _post_comment(client, section_id: int, headers: dict, content="Hello") -> dict:
    resp = client.post(
        f"/comments/{section_id}",
        json={"content": content},
        headers=headers,
    )
    assert resp.status_code == 201, resp.text
    return resp.json()


# ── GET /comments/{section_id} ────────────────────────────────────────────────


def test_list_comments_is_public(client, admin_headers):
    section_id = _create_section(client, admin_headers)
    resp = client.get(f"/comments/{section_id}")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


def test_list_comments_sorted_by_created_at(client, admin_headers, recruiter_headers):
    section_id = _create_section(client, admin_headers)
    _post_comment(client, section_id, recruiter_headers, content="first")
    _post_comment(client, section_id, recruiter_headers, content="second")

    comments = client.get(f"/comments/{section_id}").json()

    assert len(comments) == 2
    # Verify content is in insertion order (ORDER BY created_at ASC)
    assert comments[0]["content"] == "first"
    assert comments[1]["content"] == "second"
    # Also verify timestamps are non-decreasing
    timestamps = [c["created_at"] for c in comments]
    assert timestamps == sorted(timestamps)


def test_list_comments_includes_author_display_field(client, admin_headers, recruiter_headers):
    section_id = _create_section(client, admin_headers)
    _post_comment(client, section_id, recruiter_headers)

    comments = client.get(f"/comments/{section_id}").json()

    assert len(comments) == 1
    comment = comments[0]
    assert "author_display" in comment
    # Seeded recruiter has full_name="Test Recruiter"
    assert comment["author_display"] == "Test Recruiter"


# ── POST /comments/{section_id} ───────────────────────────────────────────────


def test_recruiter_can_post_comment_returns_201(client, admin_headers, recruiter_headers):
    section_id = _create_section(client, admin_headers)

    resp = client.post(
        f"/comments/{section_id}",
        json={"content": "Great portfolio!"},
        headers=recruiter_headers,
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["content"] == "Great portfolio!"
    assert data["section_id"] == section_id
    assert "author" in data
    assert data["author"]["full_name"] == "Test Recruiter"


def test_unauthenticated_cannot_post_comment_returns_401(client, admin_headers):
    section_id = _create_section(client, admin_headers)

    resp = client.post(
        f"/comments/{section_id}",
        json={"content": "Sneaky comment"},
    )
    assert resp.status_code == 401


# ── PUT /comments/{id} ────────────────────────────────────────────────────────


def test_recruiter_can_edit_own_comment(client, admin_headers, recruiter_headers):
    section_id = _create_section(client, admin_headers)
    comment_id = _post_comment(client, section_id, recruiter_headers, "Original")["id"]

    resp = client.put(
        f"/comments/{comment_id}",
        json={"content": "Edited"},
        headers=recruiter_headers,
    )
    assert resp.status_code == 200
    assert resp.json()["content"] == "Edited"


# ── DELETE /comments/{id} ─────────────────────────────────────────────────────


def test_recruiter_can_delete_own_comment(client, admin_headers, recruiter_headers):
    section_id = _create_section(client, admin_headers)
    comment_id = _post_comment(client, section_id, recruiter_headers)["id"]

    resp = client.delete(f"/comments/{comment_id}", headers=recruiter_headers)
    assert resp.status_code == 204


def test_recruiter_cannot_delete_anothers_comment_returns_403(
    client, admin_headers, recruiter_headers
):
    section_id = _create_section(client, admin_headers)
    # First recruiter posts a comment
    comment_id = _post_comment(client, section_id, recruiter_headers)["id"]

    # Register and log in a second recruiter
    client.post(
        "/auth/register",
        json={"email": "other@test.com", "password": "otherpass123"},
    )
    login = client.post(
        "/auth/login",
        json={"email": "other@test.com", "password": "otherpass123"},
    )
    other_headers = {"Authorization": f"Bearer {login.json()['access_token']}"}

    resp = client.delete(f"/comments/{comment_id}", headers=other_headers)
    assert resp.status_code == 403


# ── DELETE /admin/comments/{id} ───────────────────────────────────────────────


def test_admin_can_delete_any_comment(client, admin_headers, recruiter_headers):
    section_id = _create_section(client, admin_headers)
    comment_id = _post_comment(client, section_id, recruiter_headers)["id"]

    # Admin deletes a comment that belongs to the recruiter
    resp = client.delete(f"/admin/comments/{comment_id}", headers=admin_headers)
    assert resp.status_code == 204

    # Confirm it is gone — the section should now have zero comments
    comments = client.get(f"/comments/{section_id}").json()
    assert all(c["id"] != comment_id for c in comments)
