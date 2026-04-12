from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas.comment import CommentCreate, CommentUpdate, CommentOut
from services import comment as comment_service
from dependencies import get_db, get_current_user, require_role
from models.user import User

router = APIRouter(prefix="/comments", tags=["comments"])

recruiter_guard = require_role("recruiter", "admin")


@router.get("/{section_id}")
def list_comments(section_id: int, db: Session = Depends(get_db)):
    """Public — anyone can read comments."""
    return comment_service.get_comments_for_section(db, section_id)


@router.post("/{section_id}", response_model=CommentOut, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(recruiter_guard)])
def create_comment(
    section_id: int,
    payload: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return comment_service.create_comment(db, section_id, current_user.id, payload)


@router.put("/{comment_id}", response_model=CommentOut)
def update_comment(
    comment_id: int,
    payload: CommentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comment = comment_service.get_comment(db, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    # Only owner or admin may edit
    if comment.user_id != current_user.id and current_user.role.name != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")
    updated = comment_service.update_comment(db, comment_id, payload)
    return updated


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comment = comment_service.get_comment(db, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment.user_id != current_user.id and current_user.role.name != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")
    comment_service.delete_comment(db, comment_id)
