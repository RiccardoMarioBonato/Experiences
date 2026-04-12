import os

from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType


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


async def send_contact_email(from_name: str, from_email: str, message: str) -> None:
    mail_to = os.environ["MAIL_TO"]

    msg = MessageSchema(
        subject=f"RickFolio — New message from {from_name}",
        recipients=[mail_to],
        body=(
            f"From: {from_name} ({from_email})\n"
            f"\n"
            f"{message}"
        ),
        subtype=MessageType.plain,
    )

    try:
        fm = FastMail(_mail_config())
        await fm.send_message(msg)
    except Exception as exc:
        raise Exception("Failed to send email") from exc
