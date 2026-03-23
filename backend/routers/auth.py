from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from schemas.user import UserCreate, UserLogin, UserOut
from schemas.token import Token
from services.user import create_user, authenticate_user, get_user_by_email
from services.auth import create_access_token
from dependencies import get_db
from models.user import User, Role
import os
import httpx

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    existing = get_user_by_email(db, payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = create_user(db, payload.email, payload.password, payload.full_name, role_name="recruiter")
    return UserOut(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role.name,
        created_at=user.created_at,
    )


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id), "role": user.role.name})
    return Token(access_token=token, token_type="bearer", role=user.role.name, full_name=user.full_name)


# ── Google OAuth ──────────────────────────────────────────────────────────────

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


@router.get("/google")
def google_login():
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
    params = (
        f"?client_id={client_id}"
        f"&redirect_uri={redirect_uri}"
        f"&response_type=code"
        f"&scope=openid%20email%20profile"
        f"&access_type=offline"
    )
    return RedirectResponse(url=GOOGLE_AUTH_URL + params)


@router.get("/google/callback")
def google_callback(code: str, db: Session = Depends(get_db)):
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

    # Exchange authorization code for access token
    token_response = httpx.post(
        GOOGLE_TOKEN_URL,
        data={
            "code": code,
            "client_id": client_id,
            "client_secret": client_secret,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code",
        },
    )
    if token_response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to exchange code for token")

    access_token = token_response.json().get("access_token")

    # Fetch user profile from Google
    userinfo_response = httpx.get(
        GOOGLE_USERINFO_URL,
        headers={"Authorization": f"Bearer {access_token}"},
    )
    if userinfo_response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to fetch user info from Google")

    userinfo = userinfo_response.json()
    google_id = userinfo.get("sub")
    email = userinfo.get("email")
    full_name = userinfo.get("name", "")

    # Check if user exists by google_id
    user = db.query(User).filter(User.google_id == google_id).first()

    if not user:
        # Check if user exists by email
        user = get_user_by_email(db, email)
        if user:
            # Link google_id to existing account
            user.google_id = google_id
            db.commit()
            db.refresh(user)
        else:
            # Create new recruiter account
            role = db.query(Role).filter(Role.name == "recruiter").first()
            if not role:
                raise HTTPException(status_code=500, detail="Recruiter role not found")
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

    jwt_token = create_access_token({"sub": str(user.id), "role": user.role.name})
    name_param = (user.full_name or "").replace(" ", "%20")
    return RedirectResponse(
        url=f"{frontend_url}/auth/callback?token={jwt_token}&role={user.role.name}&name={name_param}"
    )
