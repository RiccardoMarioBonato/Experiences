from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    full_name: str | None = None


class TokenData(BaseModel):
    sub: str | None = None
    role: str | None = None
