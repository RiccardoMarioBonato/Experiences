from pydantic import BaseModel, EmailStr


class ContactMessage(BaseModel):
    from_name: str
    from_email: EmailStr
    message: str
