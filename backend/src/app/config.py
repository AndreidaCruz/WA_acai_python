from __future__ import annotations

from functools import lru_cache
import os

from pydantic import BaseModel


def _env_flag(name: str, default: str = "0") -> bool:
    return os.getenv(name, default).strip().lower() in {"1", "true", "yes", "on"}


class Settings(BaseModel):
    app_name: str = "WA Açaí"
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./wa_acai.db")
    secret_key: str = os.getenv("SECRET_KEY", "change-me-in-env")
    access_token_expires_hours: int = 12
    debug: bool = _env_flag("WA_ACAI_DEBUG")
    cors_origins: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "https://wacaipython.vercel.app,http://localhost:5173,http://127.0.0.1:5173",
        ).split(",")
        if origin.strip()
    ]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
