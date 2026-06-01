from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/catalog", tags=["catalog"])


@router.get("")
def catalog(db: Session = Depends(get_db)):
    settings = crud.get_or_create_settings(db)
    products = crud.list_active_products(db)
    stock = crud.list_active_stock(db)
    return {
        "settings": schemas.StoreSettingsRead.model_validate(settings),
        "products": [schemas.ProductRead.model_validate(product) for product in products],
        "stock": [schemas.StockProductRead.model_validate(item) for item in stock],
    }
