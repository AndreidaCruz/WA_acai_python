from __future__ import annotations

import logging
from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, joinedload

from .models import (
    MovementType,
    Order,
    OrderItem,
    OrderItemComplement,
    OrderStatus,
    Product,
    Recipe,
    Role,
    StockMovement,
    StockProduct,
    StoreSettings,
    User,
)
from .logging_helpers import mask_email
from .security import hash_password, verify_password

logger = logging.getLogger(__name__)


def repair_mojibake(value: str) -> str:
    if not isinstance(value, str):
        return value
    if not any(marker in value for marker in ("Ã", "Â", "�")):
        return value
    try:
        return value.encode("latin1").decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError):
        return value


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.scalar(select(User).where(User.email == email))


def get_user_by_identifier(db: Session, identifier: str) -> User | None:
    normalized = identifier.strip()
    if not normalized:
        return None
    lowered = normalized.casefold()
    return db.scalar(
        select(User).where(or_(func.lower(User.email) == lowered, func.lower(User.name) == lowered))
    )


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
    logger.info("user created id=%s email=%s role=%s", user.id, mask_email(email), role.value)
    return user


def authenticate_user(db: Session, identifier: str, password: str) -> User | None:
    user = get_user_by_identifier(db, identifier)
    if user is None or not user.active:
        logger.warning("authentication failed email=%s reason=missing_or_inactive", mask_email(identifier))
        return None
    if verify_password(password, user.password_hash):
        logger.info("authentication success user_id=%s email=%s role=%s", user.id, mask_email(identifier), user.role.value)
        return user
    logger.warning("authentication failed email=%s reason=invalid_password", mask_email(identifier))
    return None


def get_or_create_settings(db: Session) -> StoreSettings:
    settings = db.get(StoreSettings, 1)
    if settings is None:
        settings = StoreSettings(id=1)
        db.add(settings)
        db.commit()
        db.refresh(settings)
        logger.info("store settings created with default values")
    return settings


def list_active_products(db: Session) -> list[Product]:
    products = list(db.scalars(select(Product).where(Product.active.is_(True)).order_by(Product.id)).all())
    seen_names: set[str] = set()
    unique_products: list[Product] = []

    for product in products:
        product.name = repair_mojibake(product.name).strip()
        if product.description:
            product.description = repair_mojibake(product.description)

        normalized_name = product.name.casefold()
        if normalized_name in seen_names:
            continue

        seen_names.add(normalized_name)
        unique_products.append(product)

    return unique_products


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
        payment_method=payload.payment_method,
        delivery_fee=payload.delivery_fee,
        status=OrderStatus.ABERTO,
    )
    subtotal = 0.0
    for item in payload.items:
        product = db.get(Product, item.product_id)
        if product is None or not product.active:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Produto {item.product_id} indisponivel")
        combo_parts = getattr(item, "combo_parts", None) or []
        order_item = OrderItem(
            product_id=product.id,
            product_name=product.name,
            quantity=item.quantity,
            unit_price=product.price,
            total_price=product.price * item.quantity,
        )
        if combo_parts:
            if len(combo_parts) != 2:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Combo precisa de exatamente dois açaís")
            order_item.total_price = product.price * item.quantity
            for part_index, part in enumerate(combo_parts):
                for complement_index, complement in enumerate(part.complements):
                    stock = db.get(StockProduct, complement.stock_product_id)
                    if stock is None or not stock.active or not stock.available_for_complement:
                        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Complemento {complement.stock_product_id} indisponivel")
                    is_paid = complement_index >= 3
                    complement_unit_price = stock.complement_extra_price * complement.quantity_consumed if is_paid else 0.0
                    order_item.complements.append(
                        OrderItemComplement(
                            stock_product_id=stock.id,
                            stock_product_name=stock.name,
                            quantity_consumed=complement.quantity_consumed,
                            extra_price=complement_unit_price,
                            combo_part_index=part_index,
                        )
                    )
                    order_item.total_price += complement_unit_price * item.quantity
        else:
            for complement_index, complement in enumerate(item.complements):
                stock = db.get(StockProduct, complement.stock_product_id)
                if stock is None or not stock.active or not stock.available_for_complement:
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Complemento {complement.stock_product_id} indisponivel")
                is_paid = complement_index >= 3
                complement_unit_price = stock.complement_extra_price * complement.quantity_consumed if is_paid else 0.0
                order_item.complements.append(
                    OrderItemComplement(
                        stock_product_id=stock.id,
                        stock_product_name=stock.name,
                        quantity_consumed=complement.quantity_consumed,
                        extra_price=complement_unit_price,
                        combo_part_index=None,
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
    order = (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.complements))
        .filter(Order.id == order.id)
        .first()
    )
    if order is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Order could not be reloaded")
    logger.info(
        "order created number=%s customer=%s user_id=%s items=%s subtotal=%.2f total=%.2f",
        order.number,
        order.customer_name,
        user_id,
        len(order.items),
        order.subtotal,
        order.total,
    )
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
            problems.append(f"{stock.name if stock else stock_id} indisponivel no momento.")
    if problems:
        logger.warning("order stock validation failed order=%s problems=%s", order.number, problems)
    return (len(problems) == 0), problems


def deduct_stock_for_order(db: Session, order: Order, user_id: int | None = None) -> None:
    if order.stock_deducted:
        logger.debug("stock deduction skipped order=%s already deducted", order.number)
        return
    ok, problems = validate_order_stock(db, order)
    if not ok:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=problems)

    movement_count = 0
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
            movement_count += 1
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
            movement_count += 1
    order.stock_deducted = True
    db.commit()
    logger.info("stock deducted order=%s user_id=%s movements=%s", order.number, user_id, movement_count)


def set_order_status(db: Session, order: Order, status_value: OrderStatus, user_id: int | None = None) -> Order:
    previous_status = order.status
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
    logger.info(
        "order status updated number=%s from=%s to=%s user_id=%s",
        order.number,
        previous_status.value,
        status_value.value,
        user_id,
    )
    return order


def delete_order(db: Session, order: Order) -> None:
    number = order.number
    db.query(StockMovement).filter(StockMovement.order_id == order.id).update({StockMovement.order_id: None})
    db.delete(order)
    db.commit()
    logger.info("order deleted number=%s", number)


def cancel_order(db: Session, order: Order, user_id: int | None = None) -> Order:
    cancellable_statuses = {
        OrderStatus.ABERTO,
        OrderStatus.ACEITO,
        OrderStatus.EM_PREPARACAO,
        OrderStatus.PRONTO,
    }
    if order.status == OrderStatus.CANCELADO:
        logger.debug("order cancel skipped order=%s already canceled", order.number)
        return order
    if order.status not in cancellable_statuses:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Order can no longer be canceled")

    previous_status = order.status
    order.status = OrderStatus.CANCELADO
    order.finalization_at = datetime.utcnow()
    db.commit()
    db.refresh(order)
    logger.info(
        "order canceled number=%s from=%s user_id=%s",
        order.number,
        previous_status.value,
        user_id,
    )
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
    logger.info("stock adjusted stock_id=%s stock_name=%s delta=%s user_id=%s reason=%s", stock.id, stock.name, quantity_delta, user_id, reason)
    return stock
