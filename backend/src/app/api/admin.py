from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db
from ..models import Role, StockProduct
from .deps import current_user

router = APIRouter(prefix="/api/admin", tags=["admin"])


def admin_guard(user=Depends(current_user)):
    if user.role != Role.admin:
        from fastapi import HTTPException, status

        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return user


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db), user=Depends(admin_guard)):
    return {
        "orders": len(crud.list_orders(db)),
        "low_stock": [schemas.StockProductRead.model_validate(item) for item in crud.list_low_stock(db)],
        "settings": schemas.StoreSettingsRead.model_validate(crud.get_or_create_settings(db)),
    }


@router.get("/stock", response_model=list[schemas.StockProductRead])
def stock(db: Session = Depends(get_db), user=Depends(admin_guard)):
    return crud.list_active_stock(db)


@router.patch("/stock/{stock_id}", response_model=schemas.StockProductRead)
def adjust_stock(stock_id: int, quantity_delta: float, reason: str = "Ajuste manual", db: Session = Depends(get_db), user=Depends(admin_guard)):
    return crud.upsert_stock_adjustment(db, stock_id, quantity_delta, user.id, reason)


@router.get("/orders", response_model=list[schemas.OrderRead])
def admin_orders(db: Session = Depends(get_db), user=Depends(admin_guard)):
    return crud.list_orders(db)
