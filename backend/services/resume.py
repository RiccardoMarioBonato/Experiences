from sqlalchemy.orm import Session
from models.resume import ResumeSection
from schemas.resume import ResumeSectionCreate, ResumeSectionUpdate
from datetime import datetime, timezone


def get_all_sections(db: Session) -> list[ResumeSection]:
    return db.query(ResumeSection).order_by(ResumeSection.section_type, ResumeSection.order).all()


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
