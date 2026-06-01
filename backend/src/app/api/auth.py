from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db
from ..models import Role
from ..security import create_access_token
from .deps import current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.get("/setup-status")
def setup_status(db: Session = Depends(get_db)):
    return {"needs_setup": crud.count_admins(db) == 0}


@router.post("/bootstrap-admin", response_model=schemas.TokenData)
def bootstrap_admin(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.count_admins(db) > 0:
        from fastapi import HTTPException, status

        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Initial setup already completed")
    user = crud.create_user(db, payload.name, payload.email, payload.phone, payload.password, role=Role.admin)
    token, expires_at = create_access_token(user)
    return schemas.TokenData(access_token=token, expires_at=expires_at)


@router.post("/register", response_model=schemas.UserRead)
def register(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, payload.name, payload.email, payload.phone, payload.password, role=Role.user)


@router.post("/login", response_model=schemas.TokenData)
def login(payload: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, payload.email, payload.password)
    if user is None:
        from fastapi import HTTPException, status

        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token, expires_at = create_access_token(user)
    return schemas.TokenData(access_token=token, expires_at=expires_at)


@router.get("/me", response_model=schemas.UserRead)
def me(user=Depends(current_user)):
    return user
