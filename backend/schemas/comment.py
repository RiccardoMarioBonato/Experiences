from pydantic import BaseModel
from datetime import datetime


class CommentAuthor(BaseModel):
    id: int
    full_name: str | None
    email: str

    model_config = {"from_attributes": True}


class CommentCreate(BaseModel):
    content: str


class CommentUpdate(BaseModel):
    content: str


class CommentOut(BaseModel):
    id: int
    content: str
    section_id: int
    author: CommentAuthor
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
