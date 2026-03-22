from sqlalchemy.orm import Session
from models.comment import Comment
from schemas.comment import CommentCreate, CommentUpdate
from datetime import datetime, timezone


def get_comments_for_section(db: Session, section_id: int) -> list[Comment]:
    return db.query(Comment).filter(Comment.section_id == section_id).all()


def get_all_comments(db: Session) -> list[Comment]:
    return db.query(Comment).all()


def get_comment(db: Session, comment_id: int) -> Comment | None:
    return db.query(Comment).filter(Comment.id == comment_id).first()


def create_comment(db: Session, section_id: int, user_id: int, data: CommentCreate) -> Comment:
    comment = Comment(content=data.content, section_id=section_id, user_id=user_id)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


def update_comment(db: Session, comment_id: int, data: CommentUpdate) -> Comment | None:
    comment = get_comment(db, comment_id)
    if not comment:
        return None
    comment.content = data.content
    comment.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(comment)
    return comment


def delete_comment(db: Session, comment_id: int) -> bool:
    comment = get_comment(db, comment_id)
    if not comment:
        return False
    db.delete(comment)
    db.commit()
    return True
