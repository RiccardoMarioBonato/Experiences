"""
Seed script: creates roles and default admin user.
Safe to run multiple times (idempotent).
"""
from database import SessionLocal, engine, Base
import models  # noqa: registers all ORM models
from models.user import Role, User
from services.auth import hash_password
from dotenv import load_dotenv
import os

load_dotenv()

ROLES = ["guest", "recruiter", "admin"]
SECTIONS = [
    {
        "section_type": "about",
        "title": "About Me",
        "subtitle": None,
        "description": (
            "Software Engineer with experience in full-stack web development, game development, and AI/ML projects. "
            "Multilingual (Thai Native, English Master, Italian Native). Currently studying B.E. in Software and "
            "Knowledge Engineering at Kasetsart University while working as IT/Tech Support and Translator at Guru Electronics. "
            "Skilled in Python, JavaScript, C#, and various frameworks including Django, Next.js, and Unity."
        ),
        "start_date": None,
        "end_date": None,
        "order": 0,
    },
    {
        "section_type": "experience",
        "title": "IT/Tech Support & Translator",
        "subtitle": "Guru Electronics",
        "description": (
            "Multilingual translator (Thai, English, Italian). Provided software & hardware support to clients. "
            "Handled customer sales support and initial web development setup for clients. Managed product delivery "
            "across the country and performed media editing using Vegas Pro, Photoshop, and Blender."
        ),
        "start_date": "June 2023",
        "end_date": "Present",
        "order": 0,
    },
    {
        "section_type": "education",
        "title": "B.E. in Software and Knowledge Engineering",
        "subtitle": "Kasetsart University",
        "description": None,
        "start_date": "June 2023",
        "end_date": "October 2027",
        "order": 0,
    },
    {
        "section_type": "education",
        "title": "High School Diploma — English & Mathematics",
        "subtitle": "Satriwitthaya 2 School",
        "description": None,
        "start_date": "May 2017",
        "end_date": "March 2023",
        "order": 1,
    },
    {
        "section_type": "projects",
        "title": "SleepEfficiencyPrediction",
        "subtitle": "Django Web App",
        "description": "Full-stack web app and API predicting sleep efficiency using sensor data.",
        "start_date": None,
        "end_date": None,
        "order": 0,
    },
    {
        "section_type": "projects",
        "title": "UniPlus",
        "subtitle": "Django & Next.js",
        "description": "University event management platform with QR code attendance tracking.",
        "start_date": None,
        "end_date": None,
        "order": 1,
    },
    {
        "section_type": "projects",
        "title": "Chimera",
        "subtitle": "Unity (C#)",
        "description": "2D side-scrolling game combining mob DNA to evolve the player character.",
        "start_date": None,
        "end_date": None,
        "order": 2,
    },
    {
        "section_type": "projects",
        "title": "Maze Escape",
        "subtitle": "C++, Unreal Engine 4",
        "description": "A 3D horror maze puzzle built with UE4, functioning as a fully playable demo with puzzle mechanics and atmospheric design.",
        "start_date": "August 2021",
        "end_date": None,
        "order": 3,
    },
    {
        "section_type": "projects",
        "title": "Fruits Anomaly Detector",
        "subtitle": "AI/ML (Cira-core)",
        "description": "AI deep learning model detecting bruises on conveyor belt fruits.",
        "start_date": None,
        "end_date": None,
        "order": 4,
    },
    {
        "section_type": "skills",
        "title": "JavaScript / TypeScript",
        "subtitle": None,
        "description": None,
        "start_date": None,
        "end_date": None,
        "order": 0,
    },
    {
        "section_type": "skills",
        "title": "Python",
        "subtitle": None,
        "description": None,
        "start_date": None,
        "end_date": None,
        "order": 1,
    },
    {
        "section_type": "skills",
        "title": "C# / C++",
        "subtitle": None,
        "description": None,
        "start_date": None,
        "end_date": None,
        "order": 2,
    },
    {
        "section_type": "skills",
        "title": "Django / FastAPI",
        "subtitle": None,
        "description": None,
        "start_date": None,
        "end_date": None,
        "order": 3,
    },
    {
        "section_type": "skills",
        "title": "Next.js / React",
        "subtitle": None,
        "description": None,
        "start_date": None,
        "end_date": None,
        "order": 4,
    },
    {
        "section_type": "skills",
        "title": "Unity / Unreal Engine",
        "subtitle": None,
        "description": None,
        "start_date": None,
        "end_date": None,
        "order": 5,
    },
    {
        "section_type": "skills",
        "title": "Docker / Git",
        "subtitle": None,
        "description": None,
        "start_date": None,
        "end_date": None,
        "order": 6,
    },
    {
        "section_type": "skills",
        "title": "PostgreSQL / MySQL",
        "subtitle": None,
        "description": None,
        "start_date": None,
        "end_date": None,
        "order": 7,
    },
]


NEW_PROJECTS = [
    {
        "section_type": "projects",
        "title": "Tactical Hero Battle Game",
        "subtitle": "Python, OOP",
        "description": (
            "A 2D side-scrolling tactical strategy game built with Python combining tower defense mechanics "
            "inspired by Line Ranger and Battle Cats, designed with OOP principles."
        ),
        "start_date": "May 2025",
        "end_date": None,
        "order": 5,
    },
    {
        "section_type": "projects",
        "title": "Chess Haven",
        "subtitle": "Shopify, E-Commerce",
        "description": (
            "A fully functional e-commerce store on Shopify for selling custom chess sets, implementing "
            "custom product catalogs, payment processing, and inventory management."
        ),
        "start_date": "January 2023",
        "end_date": None,
        "order": 6,
    },
    {
        "section_type": "projects",
        "title": "Cotour Jerdan",
        "subtitle": "Shopify, E-Commerce",
        "description": (
            "A fully functional e-commerce store on Shopify for selling luxury furniture, implementing "
            "custom product catalogs, payment processing, and inventory management."
        ),
        "start_date": "November 2024",
        "end_date": None,
        "order": 7,
    },
    {
        "section_type": "projects",
        "title": "Maze Escape",
        "subtitle": "C++, Unreal Engine 4",
        "description": "A 3D horror maze puzzle built with UE4, functioning as a fully playable demo with puzzle mechanics and atmospheric design.",
        "start_date": "August 2021",
        "end_date": None,
        "order": 3,
    },
    {
        "section_type": "projects",
        "title": "MoleDiver",
        "subtitle": "Kotlin, Android",
        "description": "A mobile game developed as a university course project built with Kotlin for Android.",
        "start_date": "April 2026",
        "end_date": None,
        "order": 8,
    },
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Seed roles
        for role_name in ROLES:
            if not db.query(Role).filter(Role.name == role_name).first():
                db.add(Role(name=role_name))
        db.commit()
        print("✅ Roles seeded")

        # Seed admin user
        admin_email = os.getenv("ADMIN_EMAIL", "admin@riccardo.dev")
        admin_pw = os.getenv("ADMIN_PASSWORD", "changeme123")
        admin_name = os.getenv("ADMIN_FULL_NAME", "Riccardo M. Bonato")
        if not db.query(User).filter(User.email == admin_email).first():
            admin_role = db.query(Role).filter(Role.name == "admin").first()
            db.add(User(
                email=admin_email,
                hashed_password=hash_password(admin_pw),
                full_name=admin_name,
                role_id=admin_role.id,
            ))
            db.commit()
            print(f"✅ Admin user created: {admin_email}")
        else:
            print("ℹ️  Admin user already exists")

        # Seed resume sections
        from models.resume import ResumeSection
        existing_count = db.query(ResumeSection).count()
        if existing_count == 0:
            for s in SECTIONS:
                db.add(ResumeSection(**s))
            db.commit()
            print(f"✅ Seeded {len(SECTIONS)} resume sections")
        else:
            print(f"ℹ️  Resume sections already exist ({existing_count} found), skipping")

        # Seed new projects (idempotent: insert only if title not already present)
        added = 0
        for p in NEW_PROJECTS:
            exists = db.query(ResumeSection).filter(ResumeSection.title == p["title"]).first()
            if not exists:
                db.add(ResumeSection(**p))
                added += 1
        if added:
            db.commit()
            print(f"✅ Added {added} new project(s)")
        else:
            print("ℹ️  All new projects already present, skipping")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
