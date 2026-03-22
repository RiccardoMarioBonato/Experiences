from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas.user import UserOut
from schemas.comment import CommentOut
from services import user as user_service, comment as comment_service
from dependencies import get_db, require_role

router = APIRouter(prefix="/admin", tags=["admin"])

admin_guard = require_role("admin")


@router.get("/users", response_model=list[UserOut], dependencies=[Depends(admin_guard)])
def list_users(db: Session = Depends(get_db)):
    users = user_service.get_all_users(db)
    return [
        UserOut(id=u.id, email=u.email, full_name=u.full_name,
                role=u.role.name, created_at=u.created_at)
        for u in users
    ]


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(admin_guard)])
def delete_user(user_id: int, db: Session = Depends(get_db)):
    if not user_service.delete_user(db, user_id):
        raise HTTPException(status_code=404, detail="User not found")


@router.get("/comments", response_model=list[CommentOut], dependencies=[Depends(admin_guard)])
def list_all_comments(db: Session = Depends(get_db)):
    return comment_service.get_all_comments(db)


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(admin_guard)])
def delete_comment(comment_id: int, db: Session = Depends(get_db)):
    if not comment_service.delete_comment(db, comment_id):
        raise HTTPException(status_code=404, detail="Comment not found")
