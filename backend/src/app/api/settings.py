from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db
from ..models import StoreSettings
from .admin import admin_guard

router = APIRouter(prefix="/api/settings", tags=["settings"])


@router.get("", response_model=schemas.StoreSettingsRead)
def read_settings(db: Session = Depends(get_db)):
    return crud.get_or_create_settings(db)


@router.put("/admin", response_model=schemas.StoreSettingsRead)
def update_settings(payload: schemas.StoreSettingsRead, db: Session = Depends(get_db), user=Depends(admin_guard)):
    settings = crud.get_or_create_settings(db)
    for field, value in payload.model_dump().items():
        if field != "id" and hasattr(settings, field):
            setattr(settings, field, value)
    db.commit()
    db.refresh(settings)
    return settings
