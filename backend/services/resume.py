import re
from sqlalchemy.orm import Session
from models.resume import ResumeSection
from schemas.resume import ResumeSectionCreate, ResumeSectionUpdate, ResumeSectionOut
from datetime import datetime, timezone

_HAS_VIDEO_TAG = " [has_video]"
_YT_TAG_RE = re.compile(r"\[yt:([^\]]+)\]$")


def get_all_sections(db: Session) -> dict[str, list[ResumeSectionOut]]:
    sections = (
        db.query(ResumeSection)
        .filter(ResumeSection.title != None, ResumeSection.title != "")  # noqa: E711
        .order_by(ResumeSection.order)
        .all()
    )
    grouped: dict[str, list[ResumeSectionOut]] = {}
    for section in sections:
        key = section.section_type.value
        raw_desc = section.description or ""

        # Strip [yt:URL] first (outermost tag)
        youtube_url: str | None = None
        yt_match = _YT_TAG_RE.search(raw_desc)
        if yt_match:
            youtube_url = yt_match.group(1)
            raw_desc = raw_desc[: yt_match.start()]

        # Then strip [has_video]
        has_video = raw_desc.endswith(_HAS_VIDEO_TAG)
        clean_desc = raw_desc[: -len(_HAS_VIDEO_TAG)] if has_video else raw_desc

        out = ResumeSectionOut(
            id=section.id,
            section_type=section.section_type,
            title=section.title,
            subtitle=section.subtitle,
            description=clean_desc if clean_desc else None,
            start_date=section.start_date,
            end_date=section.end_date,
            order=section.order,
            created_at=section.created_at,
            updated_at=section.updated_at,
            has_video=has_video,
            youtube_url=youtube_url,
        )
        grouped.setdefault(key, []).append(out)
    return grouped


def get_section(db: Session, section_id: int) -> ResumeSection | None:
    return db.query(ResumeSection).filter(ResumeSection.id == section_id).first()


def create_section(db: Session, data: ResumeSectionCreate) -> ResumeSection:
    section = ResumeSection(**data.model_dump())
    db.add(section)
    db.commit()
    db.refresh(section)
    return section


def update_section(db: Session, section_id: int, data: ResumeSectionUpdate) -> ResumeSection | None:
    section = get_section(db, section_id)
    if not section:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(section, field, value)
    section.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(section)
    return section


def delete_section(db: Session, section_id: int) -> bool:
    section = get_section(db, section_id)
    if not section:
        return False
    db.delete(section)
    db.commit()
    return True
