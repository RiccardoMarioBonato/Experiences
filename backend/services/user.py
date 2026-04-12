from sqlalchemy.orm import Session
from models.user import User, Role
from services.auth import hash_password, verify_password


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, email: str, password: str, full_name: str | None, role_name: str = "recruiter") -> User:
    role = db.query(Role).filter(Role.name == role_name).first()
    if not role:
        raise ValueError(f"Role '{role_name}' not found")
    user = User(
        email=email,
        hashed_password=hash_password(password),
        full_name=full_name,
        role_id=role.id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def get_user_by_google_id(db: Session, google_id: str) -> User | None:
    return db.query(User).filter(User.google_id == google_id).first()


def get_or_create_google_user(
    db: Session, google_id: str, email: str, full_name: str
) -> User:
    """
    Three-way upsert for Google OAuth:
      1. User found by google_id           → return as-is
      2. User found by email only          → link google_id, return
      3. No existing user                  → create new recruiter, return
    Raises ValueError if the recruiter role is missing (seed not run).
    """
    user = get_user_by_google_id(db, google_id)
    if user:
        return user

    user = get_user_by_email(db, email)
    if user:
        user.google_id = google_id
        db.commit()
        db.refresh(user)
        return user

    role = db.query(Role).filter(Role.name == "recruiter").first()
    if not role:
        raise ValueError("Recruiter role not found")
    user = User(
        email=email,
        hashed_password="",
        full_name=full_name,
        role_id=role.id,
        google_id=google_id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_all_users(db: Session) -> list[User]:
    return db.query(User).all()


def delete_user(db: Session, user_id: int) -> bool:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return False
    db.delete(user)
    db.commit()
    return True
