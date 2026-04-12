import os

from fastapi import APIRouter, HTTPException
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

from schemas.contact import ContactMessage

router = APIRouter()


def _mail_config() -> ConnectionConfig:
    return ConnectionConfig(
        MAIL_USERNAME=os.environ["MAIL_USERNAME"],
        MAIL_PASSWORD=os.environ["MAIL_PASSWORD"],
        MAIL_FROM=os.environ["MAIL_FROM"],
        MAIL_PORT=587,
        MAIL_SERVER="smtp.gmail.com",
        MAIL_STARTTLS=True,
        MAIL_SSL_TLS=False,
        USE_CREDENTIALS=True,
    )


@router.post("", status_code=200)
async def send_contact_email(body: ContactMessage) -> dict[str, str]:
    mail_to = os.environ["MAIL_TO"]

    message = MessageSchema(
        subject=f"RickFolio — New message from {body.from_name}",
        recipients=[mail_to],
        body=(
            f"From: {body.from_name} ({body.from_email})\n"
            f"\n"
            f"{body.message}"
        ),
        subtype=MessageType.plain,
    )

    try:
        fm = FastMail(_mail_config())
        await fm.send_message(message)
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Failed to send email") from exc

    return {"message": "Email sent successfully"}
