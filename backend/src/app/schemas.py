from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from .models import MovementType, OrderStatus, Role


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    password: str = Field(min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenData(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_at: datetime


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    phone: str | None
    role: Role


class ProductBase(BaseModel):
    name: str
    description: str | None = None
    image_url: str | None = None
    price: float = 0.0
    active: bool = True
    available: bool = True


class ProductRead(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class StockProductBase(BaseModel):
    name: str
    description: str | None = None
    image_url: str | None = None
    unit_measure: str = "un"
    quantity_current: float = 0.0
    minimum_stock: float = 0.0
    active: bool = True
    available_for_complement: bool = False
    complement_extra_price: float = 0.0


class StockProductRead(StockProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class RecipeRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    stock_product_id: int
    quantity_consumed: float


class StoreSettingsRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nome_loja: str
    slogan: str | None
    descricao_loja: str | None
    telefone: str | None
    whatsapp: str | None
    instagram: str | None
    facebook: str | None
    endereco: str | None
    taxa_entrega: float
    tempo_medio_entrega: str | None
    loja_aberta: bool
    mensagem_loja_fechada: str | None
    logo_url: str | None
    banner_url: str | None
    favicon_url: str | None
    pwa_icon_url: str | None
    primary_color: str | None
    secondary_color: str | None
    theme_color: str | None
    meta_title: str | None
    meta_description: str | None
    pwa_name: str | None
    pwa_short_name: str | None
    pwa_description: str | None


class ComplementRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    stock_product_id: int
    extra_price: float
    enabled: bool


class OrderItemComplementCreate(BaseModel):
    stock_product_id: int
    quantity_consumed: float = 1.0


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(ge=1)
    complements: list[OrderItemComplementCreate] = Field(default_factory=list)


class OrderCreate(BaseModel):
    user_id: int | None = None
    customer_name: str
    phone: str
    address: str
    observations: str | None = None
    delivery_fee: float = 0.0
    items: list[OrderItemCreate] = Field(default_factory=list)


class OrderItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    product_name: str
    quantity: int
    unit_price: float
    total_price: float


class OrderRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    number: str
    customer_name: str
    phone: str
    address: str
    observations: str | None
    status: OrderStatus
    subtotal: float
    delivery_fee: float
    total: float
    stock_deducted: bool
    created_at: datetime
    items: list[OrderItemRead] = Field(default_factory=list)


class StatusUpdate(BaseModel):
    status: OrderStatus


class StockMovementRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    stock_product_id: int
    quantity: float
    movement_type: MovementType
    reason: str
    user_id: int | None
    order_id: int | None
    created_at: datetime
