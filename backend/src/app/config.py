from __future__ import annotations

from functools import lru_cache
import os

from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = "WA Açaí"
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./wa_acai.db")
    secret_key: str = os.getenv("SECRET_KEY", "change-me-in-env")
    access_token_expires_hours: int = 12
    cors_origins: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173,https://waacaipython.vercel.app,https://waacaipython.vercel.app/",
        ).split(",")
        if origin.strip()
    ]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
