from fastapi import APIRouter, HTTPException

from schemas.contact import ContactMessage
from services.contact import send_contact_email

router = APIRouter()


@router.post("", status_code=200)
async def contact(body: ContactMessage) -> dict[str, str]:
    try:
        await send_contact_email(body.from_name, body.from_email, body.message)
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Failed to send email") from exc

    return {"message": "Email sent successfully"}
