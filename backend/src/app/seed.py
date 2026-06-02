from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Product, ProductComplement, Recipe, StockProduct, StoreSettings


def seed_data(db: Session) -> None:
    store = db.get(StoreSettings, 1)
    if store is None:
        db.add(
            StoreSettings(
                id=1,
                nome_loja="WA Açaí",
                primary_color="#6F2DBD",
                secondary_color="#A855F7",
                theme_color="#6F2DBD",
            )
        )

    stock_items = {
        "Açaí Tradicional": dict(unit_measure="g", quantity_current=20000, minimum_stock=3000),
        "Morango": dict(unit_measure="g", quantity_current=8000, minimum_stock=1000, available_for_complement=True, complement_extra_price=3.0),
        "Banana": dict(unit_measure="g", quantity_current=9000, minimum_stock=1000, available_for_complement=True, complement_extra_price=2.5),
        "Leite em pó": dict(unit_measure="g", quantity_current=6000, minimum_stock=800, available_for_complement=True, complement_extra_price=2.0),
        "Granola": dict(unit_measure="g", quantity_current=7000, minimum_stock=900, available_for_complement=True, complement_extra_price=2.5),
        "Paçoca": dict(unit_measure="g", quantity_current=5000, minimum_stock=700, available_for_complement=True, complement_extra_price=2.5),
        "Amendoim granulado": dict(unit_measure="g", quantity_current=5000, minimum_stock=700, available_for_complement=True, complement_extra_price=2.5),
        "Ovomaltine": dict(unit_measure="g", quantity_current=4500, minimum_stock=700, available_for_complement=True, complement_extra_price=3.5),
        "Leite condensado": dict(unit_measure="g", quantity_current=8000, minimum_stock=1000, available_for_complement=True, complement_extra_price=3.0),
        "Creme de avelã (Nutella)": dict(unit_measure="g", quantity_current=4000, minimum_stock=500, available_for_complement=True, complement_extra_price=6.5),
        "Creme de Ninho": dict(unit_measure="g", quantity_current=4000, minimum_stock=500, available_for_complement=True, complement_extra_price=5.5),
        "Creme de Cupuaçu": dict(unit_measure="g", quantity_current=5000, minimum_stock=700, available_for_complement=True, complement_extra_price=4.5),
        "Bis picado": dict(unit_measure="g", quantity_current=3000, minimum_stock=500, available_for_complement=True, complement_extra_price=4.0),
        "Confete (M&M's)": dict(unit_measure="g", quantity_current=3000, minimum_stock=500, available_for_complement=True, complement_extra_price=4.0),
        "Canudinho de wafer": dict(unit_measure="un", quantity_current=2000, minimum_stock=200, available_for_complement=True, complement_extra_price=1.0),
    }
    existing_stock = {item.name: item for item in db.scalars(select(StockProduct)).all()}
    for name, values in stock_items.items():
        if name not in existing_stock:
            db.add(StockProduct(name=name, **values))
    db.flush()

    product_items = {
        "Açaí 300ml": (13.0, {"Açaí Tradicional": 300.0}, "/products/acai-300ml.png"),
        "Açaí 500ml": (17.0, {"Açaí Tradicional": 500.0}, "/products/acai-500ml.png"),
        "Açaí 700ml": (22.0, {"Açaí Tradicional": 700.0}, "/products/acai-700ml.png"),
        "Milk Shake": (18.0, {}, "/products/milk-shake.png"),
        "Combo": (29.0, {}, "/products/combo.png"),
    }
    existing_products = {item.name: item for item in db.scalars(select(Product)).all()}
    for name, (price, recipes, image_url) in product_items.items():
        product = existing_products.get(name)
        if product is None:
            product = Product(name=name, description=f"Produto {name}", price=price, image_url=image_url)
            db.add(product)
            db.flush()
        product.price = price
        product.image_url = image_url
        stock_lookup = {item.name: item for item in db.scalars(select(StockProduct)).all()}
        for stock_name, amount in recipes.items():
            stock = stock_lookup[stock_name]
            if not any(r.stock_product_id == stock.id for r in product.recipes):
                db.add(Recipe(product_id=product.id, stock_product_id=stock.id, quantity_consumed=amount))

    complement_map = {
        "Açaí 300ml": ["Morango", "Banana", "Leite em pó", "Granola", "Paçoca", "Amendoim granulado", "Ovomaltine", "Leite condensado", "Creme de avelã (Nutella)", "Creme de Ninho", "Creme de Cupuaçu", "Bis picado", "Confete (M&M's)", "Canudinho de wafer"],
        "Açaí 500ml": ["Morango", "Banana", "Leite em pó", "Granola", "Paçoca", "Amendoim granulado", "Ovomaltine", "Leite condensado", "Creme de avelã (Nutella)", "Creme de Ninho", "Creme de Cupuaçu", "Bis picado", "Confete (M&M's)", "Canudinho de wafer"],
        "Açaí 700ml": ["Morango", "Banana", "Leite em pó", "Granola", "Paçoca", "Amendoim granulado", "Ovomaltine", "Leite condensado", "Creme de avelã (Nutella)", "Creme de Ninho", "Creme de Cupuaçu", "Bis picado", "Confete (M&M's)", "Canudinho de wafer"],
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
