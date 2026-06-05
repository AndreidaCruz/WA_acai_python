from __future__ import annotations

import logging

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db
from ..models import Role, User
from .deps import current_user

router = APIRouter(prefix="/api/admin", tags=["admin"])
logger = logging.getLogger(__name__)


def admin_guard(user=Depends(current_user)):
    if user.role != Role.admin:
        from fastapi import HTTPException, status

        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return user


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db), user=Depends(admin_guard)):
    logger.info("admin.dashboard viewed by user_id=%s", user.id)
    return {
        "orders": len(crud.list_orders(db)),
        "low_stock": [schemas.StockProductRead.model_validate(item) for item in crud.list_low_stock(db)],
        "settings": schemas.StoreSettingsRead.model_validate(crud.get_or_create_settings(db)),
    }


@router.get("/stock", response_model=list[schemas.StockProductRead])
def stock(db: Session = Depends(get_db), user=Depends(admin_guard)):
    logger.debug("admin.stock viewed by user_id=%s", user.id)
    return crud.list_active_stock(db)


@router.patch("/stock/{stock_id}", response_model=schemas.StockProductRead)
def adjust_stock(stock_id: int, quantity_delta: float, reason: str = "Ajuste manual", db: Session = Depends(get_db), user=Depends(admin_guard)):
    stock = crud.upsert_stock_adjustment(db, stock_id, quantity_delta, user.id, reason)
    logger.info(
        "admin.stock_adjustment stock_id=%s stock_name=%s delta=%s user_id=%s reason=%s",
        stock.id,
        stock.name,
        quantity_delta,
        user.id,
        reason,
    )
    return stock


@router.get("/orders", response_model=list[schemas.OrderRead])
def admin_orders(db: Session = Depends(get_db), user=Depends(admin_guard)):
    logger.debug("admin.orders viewed by user_id=%s", user.id)
    return crud.list_orders(db)


@router.get("/users", response_model=list[schemas.UserRead])
def admin_users(db: Session = Depends(get_db), user=Depends(admin_guard)):
    logger.debug("admin.users viewed by user_id=%s", user.id)
    return list(db.query(User).order_by(User.created_at.desc()).all())


@router.patch("/users/{user_id}/role", response_model=schemas.UserRead)
def update_user_role(user_id: int, payload: schemas.UserRoleUpdate, db: Session = Depends(get_db), user=Depends(admin_guard)):
    target = db.get(User, user_id)
    if target is None:
        from fastapi import HTTPException, status

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    previous = target.role
    target.role = payload.role
    db.commit()
    db.refresh(target)
    logger.info(
        "admin.user_role updated target_user_id=%s from=%s to=%s by_user_id=%s",
        target.id,
        previous.value,
        payload.role.value,
        user.id,
    )
    return target
