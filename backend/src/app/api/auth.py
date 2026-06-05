from __future__ import annotations

import logging

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..logging_helpers import mask_email
from ..database import get_db
from ..models import Role
from ..security import create_access_token
from .deps import current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])
logger = logging.getLogger(__name__)


@router.get("/setup-status")
def setup_status(db: Session = Depends(get_db)):
    logger.debug("auth.setup_status checked")
    return {"needs_setup": crud.count_admins(db) == 0}


@router.post("/bootstrap-admin", response_model=schemas.TokenData)
def bootstrap_admin(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.count_admins(db) > 0:
        from fastapi import HTTPException, status

        logger.warning("auth.bootstrap_admin rejected: setup already completed")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Initial setup already completed")
    user = crud.create_user(db, payload.name, payload.email, payload.phone, payload.password, role=Role.admin)
    token, expires_at = create_access_token(user)
    logger.info("auth.bootstrap_admin created admin email=%s", mask_email(payload.email))
    return schemas.TokenData(access_token=token, expires_at=expires_at)


@router.post("/register", response_model=schemas.UserRead)
def register(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    user = crud.create_user(db, payload.name, payload.email, payload.phone, payload.password, role=Role.user)
    logger.info("auth.register created user email=%s", mask_email(payload.email))
    return user


@router.post("/login", response_model=schemas.TokenData)
def login(payload: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, payload.email, payload.password)
    if user is None:
        from fastapi import HTTPException, status

        logger.warning("auth.login failed email=%s", mask_email(payload.email))
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token, expires_at = create_access_token(user)
    logger.info("auth.login success email=%s role=%s", mask_email(payload.email), user.role.value)
    return schemas.TokenData(access_token=token, expires_at=expires_at)


@router.get("/me", response_model=schemas.UserRead)
def me(user=Depends(current_user)):
    logger.debug("auth.me requested user_id=%s role=%s", user.id, user.role.value)
    return user
