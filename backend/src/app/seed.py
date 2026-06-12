from __future__ import annotations

import logging

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from .models import Product, ProductComplement, Recipe, Role, StockProduct, StoreSettings, User
from .security import hash_password

logger = logging.getLogger(__name__)


def _c(code: int) -> str:
    return chr(code)


ACAI = "A" + _c(0x00E7) + "a" + _c(0x00ED)
ACAI_TRADICIONAL = f"{ACAI} Tradicional"
ACAI_300 = f"{ACAI} 300ml"
ACAI_500 = f"{ACAI} 500ml"
ACAI_700 = f"{ACAI} 700ml"
LEITE_PO = "Leite em p" + _c(0x00F3)
PACOCA = "Pa" + _c(0x00E7) + "oca"
AVELA = "avel" + _c(0x00E3)
CUPUACU = "Cupua" + _c(0x00E7) + "u"
WA_ACAI = f"WA {ACAI}"
COMBO_DESC = f"Combo com dois {ACAI}s de 500ml"


def repair_mojibake(value: str) -> str:
    if not isinstance(value, str):
        return value
    if not any(marker in value for marker in ('Ã', 'Â', '�')):
        return value
    try:
        return value.encode('latin1').decode('utf-8')
    except (UnicodeEncodeError, UnicodeDecodeError):
        return value


def normalize_existing_records(db: Session) -> None:
    for record in db.scalars(select(StockProduct)).all():
        record.name = repair_mojibake(record.name)
        if record.description:
            record.description = repair_mojibake(record.description)

    for record in db.scalars(select(Product)).all():
        record.name = repair_mojibake(record.name)
        if record.description:
            record.description = repair_mojibake(record.description)


def deduplicate_existing_products(db: Session) -> None:
    seen: dict[str, Product] = {}
    for product in db.scalars(select(Product).order_by(Product.id)).all():
        product.name = repair_mojibake(product.name).strip()
        if product.description:
            product.description = repair_mojibake(product.description)

        normalized_name = product.name.casefold()
        keeper = seen.get(normalized_name)
        if keeper is None:
            seen[normalized_name] = product
            continue

        product.active = False
        product.available = False
        logger.info(
            "duplicate product deactivated id=%s name=%s keeper_id=%s",
            product.id,
            product.name,
            keeper.id,
        )


def ensure_default_admin(db: Session) -> None:
    default_name = "admin"
    default_email = "admin@waacai.local"
    default_password = "Admin123"

    existing_admin = db.scalar(
        select(User).where(or_(func.lower(User.name) == default_name, func.lower(User.email) == default_email))
    )

    if existing_admin is None:
        db.add(
            User(
                name=default_name,
                email=default_email,
                phone=None,
                password_hash=hash_password(default_password),
                role=Role.admin,
                active=True,
            )
        )
        logger.info("default admin created name=%s email=%s", default_name, default_email)
        return

    existing_admin.name = default_name
    email_owner = db.scalar(select(User).where(User.email == default_email))
    if email_owner is None or email_owner.id == existing_admin.id:
        existing_admin.email = default_email
    existing_admin.password_hash = hash_password(default_password)
    existing_admin.role = Role.admin
    existing_admin.active = True
    logger.info("default admin ensured name=%s email=%s", default_name, default_email)


def seed_data(db: Session) -> None:
    normalize_existing_records(db)
    deduplicate_existing_products(db)
    ensure_default_admin(db)

    store = db.get(StoreSettings, 1)
    if store is None:
        db.add(
            StoreSettings(
                id=1,
                nome_loja=WA_ACAI,
                primary_color="#6F2DBD",
                secondary_color="#A855F7",
                theme_color="#6F2DBD",
            )
        )
    else:
        store.nome_loja = WA_ACAI

    stock_items = {
        ACAI_TRADICIONAL: dict(unit_measure="g", quantity_current=20000, minimum_stock=3000),
        "Morango": dict(unit_measure="g", quantity_current=8000, minimum_stock=1000, available_for_complement=True, complement_extra_price=3.0),
        "Banana": dict(unit_measure="g", quantity_current=9000, minimum_stock=1000, available_for_complement=True, complement_extra_price=2.5),
        LEITE_PO: dict(unit_measure="g", quantity_current=6000, minimum_stock=800, available_for_complement=True, complement_extra_price=2.0),
        "Granola": dict(unit_measure="g", quantity_current=7000, minimum_stock=900, available_for_complement=True, complement_extra_price=2.5),
        PACOCA: dict(unit_measure="g", quantity_current=5000, minimum_stock=700, available_for_complement=True, complement_extra_price=2.5),
        "Amendoim granulado": dict(unit_measure="g", quantity_current=5000, minimum_stock=700, available_for_complement=True, complement_extra_price=2.5),
        "Ovomaltine": dict(unit_measure="g", quantity_current=4500, minimum_stock=700, available_for_complement=True, complement_extra_price=3.5),
        "Leite condensado": dict(unit_measure="g", quantity_current=8000, minimum_stock=1000, available_for_complement=True, complement_extra_price=3.0),
        f"Creme de {AVELA} (Nutella)": dict(unit_measure="g", quantity_current=4000, minimum_stock=500, available_for_complement=True, complement_extra_price=6.5),
        "Creme de Ninho": dict(unit_measure="g", quantity_current=4000, minimum_stock=500, available_for_complement=True, complement_extra_price=5.5),
        f"Creme de {CUPUACU}": dict(unit_measure="g", quantity_current=5000, minimum_stock=700, available_for_complement=True, complement_extra_price=4.5),
        "Bis picado": dict(unit_measure="g", quantity_current=3000, minimum_stock=500, available_for_complement=True, complement_extra_price=4.0),
        "Confete (M&M's)": dict(unit_measure="g", quantity_current=3000, minimum_stock=500, available_for_complement=True, complement_extra_price=4.0),
        "Canudinho de wafer": dict(unit_measure="un", quantity_current=2000, minimum_stock=200, available_for_complement=True, complement_extra_price=1.0),
    }

    existing_stock = {item.name: item for item in db.scalars(select(StockProduct)).all()}
    for name, values in stock_items.items():
        if name not in existing_stock:
            db.add(StockProduct(name=name, **values))
        else:
            stock = existing_stock[name]
            for key, value in values.items():
                setattr(stock, key, value)

    db.flush()

    product_items = {
        ACAI_300: (13.0, {ACAI_TRADICIONAL: 300.0}, "/products/acai-300ml.png"),
        ACAI_500: (17.0, {ACAI_TRADICIONAL: 500.0}, "/products/acai-500ml.png"),
        ACAI_700: (22.0, {ACAI_TRADICIONAL: 700.0}, "/products/acai-700ml.png"),
        "Milk Shake": (18.0, {}, "/products/milk-shake.png"),
        "Combo": (29.0, {ACAI_TRADICIONAL: 1000.0}, "/products/combo.png"),
    }

    existing_products = {item.name: item for item in db.scalars(select(Product).where(Product.active.is_(True))).all()}

    for name, (price, recipes, image_url) in product_items.items():
        product = existing_products.get(name)
        if product is None:
            description = COMBO_DESC if name == "Combo" else f"Produto {name}"
            product = Product(name=name, description=description, price=price, image_url=image_url)
            db.add(product)
            db.flush()
        product.price = price
        product.image_url = image_url
        product.active = True
        product.available = True
        if name == "Combo":
            product.description = COMBO_DESC
        stock_lookup = {item.name: item for item in db.scalars(select(StockProduct)).all()}
        for stock_name, amount in recipes.items():
            stock = stock_lookup[stock_name]
            if not any(r.stock_product_id == stock.id for r in product.recipes):
                db.add(Recipe(product_id=product.id, stock_product_id=stock.id, quantity_consumed=amount))

    complement_map = {
        "Combo": [
            "Morango",
            "Banana",
            LEITE_PO,
            "Granola",
            PACOCA,
            "Amendoim granulado",
            "Ovomaltine",
            "Leite condensado",
            f"Creme de {AVELA} (Nutella)",
            "Creme de Ninho",
            f"Creme de {CUPUACU}",
            "Bis picado",
            "Confete (M&M's)",
            "Canudinho de wafer",
        ],
    }

    for product_name, complements in complement_map.items():
        product = existing_products.get(product_name)
        if product is None:
            continue
        stock_lookup = {item.name: item for item in db.scalars(select(StockProduct)).all()}
        for stock_name in complements:
            stock = stock_lookup[stock_name]
            if not any(c.stock_product_id == stock.id for c in product.complements):
                db.add(
                    ProductComplement(
                        product_id=product.id,
                        stock_product_id=stock.id,
                        extra_price=stock.complement_extra_price,
                        enabled=True,
                    )
                )

    db.commit()
    logger.info("seed data ensured for store, stock, products and complements")
