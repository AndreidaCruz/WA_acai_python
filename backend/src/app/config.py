from __future__ import annotations

from functools import lru_cache

from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = "WA Açaí"
    database_url: str = "sqlite:///./wa_acai.db"
    secret_key: str = "change-me-in-env"
    access_token_expires_hours: int = 12
    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
