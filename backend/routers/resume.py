from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas.resume import ResumeSectionCreate, ResumeSectionUpdate, ResumeSectionOut
from services import resume as resume_service
from dependencies import get_db, require_role

router = APIRouter(prefix="/resume", tags=["resume"])

admin_guard = require_role("admin")


@router.get("/", response_model=dict[str, list[ResumeSectionOut]])
def list_sections(db: Session = Depends(get_db)):
    """Public endpoint — no auth required."""
    return resume_service.get_all_sections(db)


@router.get("/{section_id}", response_model=ResumeSectionOut)
def get_section(section_id: int, db: Session = Depends(get_db)):
    section = resume_service.get_section(db, section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    return section


@router.post("/", response_model=ResumeSectionOut, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(admin_guard)])
def create_section(payload: ResumeSectionCreate, db: Session = Depends(get_db)):
    return resume_service.create_section(db, payload)


@router.put("/{section_id}", response_model=ResumeSectionOut,
            dependencies=[Depends(admin_guard)])
def update_section(section_id: int, payload: ResumeSectionUpdate, db: Session = Depends(get_db)):
    section = resume_service.update_section(db, section_id, payload)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    return section


@router.delete("/{section_id}", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(admin_guard)])
def delete_section(section_id: int, db: Session = Depends(get_db)):
    if not resume_service.delete_section(db, section_id):
        raise HTTPException(status_code=404, detail="Section not found")
