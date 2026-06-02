from __future__ import annotations

from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .models import (
    MediaAsset,
    MovementType,
    Order,
    OrderItem,
    OrderItemComplement,
    OrderStatus,
    Product,
    ProductComplement,
    Recipe,
    Role,
    StockMovement,
    StockProduct,
    StoreSettings,
    User,
)
from .security import create_access_token, hash_password, verify_password


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.scalar(select(User).where(User.email == email))


def count_admins(db: Session) -> int:
    return db.scalar(
        select(func.count()).select_from(User).where(User.role == Role.admin, User.active.is_(True))
    ) or 0


def create_user(db: Session, name: str, email: str, phone: str | None, password: str, role: Role = Role.user) -> User:
    if get_user_by_email(db, email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    user = User(name=name, email=email, phone=phone, password_hash=hash_password(password), role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    if user is None or not user.active:
        return None
    return user if verify_password(password, user.password_hash) else None


def get_or_create_settings(db: Session) -> StoreSettings:
    settings = db.get(StoreSettings, 1)
    if settings is None:
        settings = StoreSettings(id=1)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


def list_active_products(db: Session) -> list[Product]:
    return list(db.scalars(select(Product).where(Product.active.is_(True))).all())


def list_active_stock(db: Session) -> list[StockProduct]:
    return list(db.scalars(select(StockProduct).where(StockProduct.active.is_(True))).all())


def list_orders(db: Session) -> list[Order]:
    return list(db.scalars(select(Order).order_by(Order.created_at.desc())).all())


def next_order_number(db: Session) -> str:
    last_number = db.scalar(select(func.max(Order.id)))
    base = 1000 if last_number is None else 1000 + int(last_number)
    return f"#{base + 1}"


def create_order(db: Session, payload, user_id: int | None = None) -> Order:
    order = Order(
        number=next_order_number(db),
        user_id=user_id,
        customer_name=payload.customer_name,
        phone=payload.phone,
        address=payload.address,
        observations=payload.observations,
        delivery_fee=payload.delivery_fee,
        status=OrderStatus.ABERTO,
    )
    subtotal = 0.0
    for item in payload.items:
        product = db.get(Product, item.product_id)
        if product is None or not product.active:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Produto {item.product_id} indisponível")
        order_item = OrderItem(
            product_id=product.id,
            product_name=product.name,
            quantity=item.quantity,
            unit_price=product.price,
            total_price=product.price * item.quantity,
        )
        for complement_index, complement in enumerate(item.complements):
            stock = db.get(StockProduct, complement.stock_product_id)
            if stock is None or not stock.active or not stock.available_for_complement:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Complemento {complement.stock_product_id} indisponível")
            is_paid = complement_index >= 3
            complement_unit_price = stock.complement_extra_price * complement.quantity_consumed if is_paid else 0.0
            order_item.complements.append(
                OrderItemComplement(
                    stock_product_id=stock.id,
                    stock_product_name=stock.name,
                    quantity_consumed=complement.quantity_consumed,
                    extra_price=complement_unit_price,
                )
            )
            order_item.total_price += complement_unit_price * item.quantity
        subtotal += order_item.total_price
        order.items.append(order_item)
    order.subtotal = subtotal
    order.total = subtotal + order.delivery_fee
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


def validate_order_stock(db: Session, order: Order) -> tuple[bool, list[str]]:
    required: dict[int, float] = {}
    for item in order.items:
        recipes = db.scalars(select(Recipe).where(Recipe.product_id == item.product_id)).all()
        for recipe in recipes:
            required[recipe.stock_product_id] = required.get(recipe.stock_product_id, 0.0) + recipe.quantity_consumed * item.quantity
        for complement in item.complements:
            required[complement.stock_product_id] = required.get(complement.stock_product_id, 0.0) + complement.quantity_consumed * item.quantity

    problems: list[str] = []
    for stock_id, needed in required.items():
        stock = db.get(StockProduct, stock_id)
        if stock is None or stock.quantity_current < needed:
            problems.append(f"{stock.name if stock else stock_id} indisponível no momento.")
    return (len(problems) == 0), problems


def deduct_stock_for_order(db: Session, order: Order, user_id: int | None = None) -> None:
    if order.stock_deducted:
        return
    ok, problems = validate_order_stock(db, order)
    if not ok:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=problems)

    for item in order.items:
        recipes = db.scalars(select(Recipe).where(Recipe.product_id == item.product_id)).all()
        for recipe in recipes:
            stock = db.get(StockProduct, recipe.stock_product_id)
            if stock is None:
                continue
            stock.quantity_current -= recipe.quantity_consumed * item.quantity
            db.add(
                StockMovement(
                    stock_product_id=stock.id,
                    quantity=-recipe.quantity_consumed * item.quantity,
                    movement_type=MovementType.saida,
                    reason=f"Baixa por pedido {order.number}",
                    user_id=user_id,
                    order_id=order.id,
                )
            )
        for complement in item.complements:
            stock = db.get(StockProduct, complement.stock_product_id)
            if stock is None:
                continue
            stock.quantity_current -= complement.quantity_consumed * item.quantity
            db.add(
                StockMovement(
                    stock_product_id=stock.id,
                    quantity=-complement.quantity_consumed * item.quantity,
                    movement_type=MovementType.saida,
                    reason=f"Complemento em pedido {order.number}",
                    user_id=user_id,
                    order_id=order.id,
                )
            )
    order.stock_deducted = True
    db.commit()


def set_order_status(db: Session, order: Order, status_value: OrderStatus, user_id: int | None = None) -> Order:
    order.status = status_value
    now = datetime.utcnow()
    if status_value == OrderStatus.ACEITO:
        order.accepted_at = now
    elif status_value == OrderStatus.EM_PREPARACAO:
        order.prepared_at = now
    elif status_value == OrderStatus.PRONTO:
        order.ready_at = now
    elif status_value == OrderStatus.SAINDO_PARA_ENTREGA:
        order.dispatch_at = now
        deduct_stock_for_order(db, order, user_id=user_id)
    elif status_value == OrderStatus.FINALIZADO:
        order.finalization_at = now
    db.commit()
    db.refresh(order)
    return order


def list_low_stock(db: Session) -> list[StockProduct]:
    return list(db.scalars(select(StockProduct).where(StockProduct.quantity_current <= StockProduct.minimum_stock)).all())


def upsert_stock_adjustment(db: Session, stock_id: int, quantity_delta: float, user_id: int | None, reason: str) -> StockProduct:
    stock = db.get(StockProduct, stock_id)
    if stock is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stock item not found")
    stock.quantity_current += quantity_delta
    db.add(
        StockMovement(
            stock_product_id=stock.id,
            quantity=quantity_delta,
            movement_type=MovementType.ajuste,
            reason=reason,
            user_id=user_id,
        )
    )
    db.commit()
    db.refresh(stock)
    return stock
