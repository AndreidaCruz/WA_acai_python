from __future__ import annotations

import logging

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from .. import crud, schemas
from ..database import get_db
from ..models import Order, OrderItem
from .admin import admin_guard
router = APIRouter(prefix="/api/orders", tags=["orders"])
logger = logging.getLogger(__name__)


@router.get("", response_model=list[schemas.OrderRead])
def list_orders(db: Session = Depends(get_db), user=Depends(admin_guard)):
    logger.debug("orders.list requested")
    orders = (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.complements))
        .order_by(Order.created_at.desc())
        .all()
    )
    return orders


@router.post("", response_model=schemas.OrderRead)
def create_order(payload: schemas.OrderCreate, db: Session = Depends(get_db)):
    order = crud.create_order(db, payload)
    logger.info("orders.create number=%s customer=%s total=%.2f items=%s", order.number, order.customer_name, order.total, len(order.items))
    return order


@router.get("/track/{order_number}", response_model=schemas.OrderRead)
def track_order(order_number: str, db: Session = Depends(get_db)):
    logger.debug("orders.track requested order_number=%s", order_number)
    order = (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.complements))
        .filter(Order.number == order_number)
        .first()
    )
    if order is None:
        from fastapi import HTTPException, status

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order


@router.patch("/track/{order_number}/cancel", response_model=schemas.OrderRead)
def cancel_tracked_order(order_number: str, db: Session = Depends(get_db)):
    logger.debug("orders.cancel requested order_number=%s", order_number)
    order = (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.complements))
        .filter(Order.number == order_number)
        .first()
    )
    if order is None:
        from fastapi import HTTPException, status

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return crud.cancel_order(db, order)


@router.get("/{order_id}", response_model=schemas.OrderRead)
def get_order(order_id: int, db: Session = Depends(get_db), user=Depends(admin_guard)):
    logger.debug("orders.get requested order_id=%s", order_id)
    order = (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.complements))
        .filter(Order.id == order_id)
        .first()
    )
    return order


@router.patch("/{order_id}/status", response_model=schemas.OrderRead)
def update_status(order_id: int, payload: schemas.StatusUpdate, db: Session = Depends(get_db), user=Depends(admin_guard)):
    logger.debug("orders.status_change requested order_id=%s target_status=%s by_user=%s", order_id, payload.status.value, user.id)
    order = db.get(Order, order_id)
    if order is None:
        from fastapi import HTTPException, status

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    previous_status = order.status if order else None
    updated = crud.set_order_status(db, order, payload.status, user_id=user.id)
    logger.info(
        "orders.status_change order=%s from=%s to=%s by_user=%s",
        updated.number,
        previous_status.value if previous_status else "unknown",
        payload.status.value,
        user.id,
    )
    return updated
