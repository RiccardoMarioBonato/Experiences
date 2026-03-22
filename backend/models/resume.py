from sqlalchemy import Column, Integer, String, Text, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base
import enum


class SectionType(str, enum.Enum):
    about = "about"
    experience = "experience"
    education = "education"
    projects = "projects"
    skills = "skills"


class ResumeSection(Base):
    __tablename__ = "resume_sections"

    id = Column(Integer, primary_key=True, index=True)
    section_type = Column(Enum(SectionType), nullable=False)
    title = Column(String(255), nullable=False)
    subtitle = Column(String(255), nullable=True)   # company / institution / tech
    description = Column(Text, nullable=True)
    start_date = Column(String(20), nullable=True)  # "June 2023"
    end_date = Column(String(20), nullable=True)    # "Present"
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))

    comments = relationship("Comment", back_populates="section", cascade="all, delete-orphan")
