from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from .. import crud, schemas
from ..database import get_db
from ..models import Order, OrderItem
from .deps import current_user

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.get("", response_model=list[schemas.OrderRead])
def list_orders(db: Session = Depends(get_db)):
    orders = (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.complements))
        .order_by(Order.created_at.desc())
        .all()
    )
    return orders


@router.post("", response_model=schemas.OrderRead)
def create_order(payload: schemas.OrderCreate, db: Session = Depends(get_db)):
    return crud.create_order(db, payload)


@router.get("/{order_id}", response_model=schemas.OrderRead)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.complements))
        .filter(Order.id == order_id)
        .first()
    )
    return order


@router.patch("/{order_id}/status", response_model=schemas.OrderRead)
def update_status(order_id: int, payload: schemas.StatusUpdate, db: Session = Depends(get_db), user=Depends(current_user)):
    order = db.get(Order, order_id)
    return crud.set_order_status(db, order, payload.status, user_id=user.id)
