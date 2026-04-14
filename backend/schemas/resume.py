from pydantic import BaseModel
from datetime import datetime
from models.resume import SectionType


class ResumeSectionCreate(BaseModel):
    section_type: SectionType
    title: str
    subtitle: str | None = None
    description: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    order: int = 0


class ResumeSectionUpdate(BaseModel):
    section_type: SectionType | None = None
    title: str | None = None
    subtitle: str | None = None
    description: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    order: int | None = None


class ResumeSectionOut(BaseModel):
    id: int
    section_type: SectionType
    title: str
    subtitle: str | None
    description: str | None
    start_date: str | None
    end_date: str | None
    order: int
    created_at: datetime
    updated_at: datetime
    has_video: bool = False
    youtube_url: str | None = None

    model_config = {"from_attributes": True}
