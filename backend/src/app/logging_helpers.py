from __future__ import annotations


def mask_email(email: str | None) -> str:
    if not email:
        return "-"
    if "@" not in email:
        return "***"
    local, domain = email.split("@", 1)
    visible = local[:2] if local else ""
    return f"{visible}***@{domain}"


def mask_phone(phone: str | None) -> str:
    if not phone:
        return "-"
    digits = "".join(ch for ch in phone if ch.isdigit())
    if len(digits) <= 4:
        return "***"
    return f"{digits[:2]}***{digits[-2:]}"
