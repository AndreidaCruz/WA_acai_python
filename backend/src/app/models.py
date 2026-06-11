from __future__ import annotations

import enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class Role(str, enum.Enum):
    guest = "guest"
    user = "user"
    admin = "admin"


class OrderStatus(str, enum.Enum):
    ABERTO = "ABERTO"
    ACEITO = "ACEITO"
    EM_PREPARACAO = "EM_PREPARACAO"
    PRONTO = "PRONTO"
    SAINDO_PARA_ENTREGA = "SAINDO_PARA_ENTREGA"
    FINALIZADO = "FINALIZADO"
    CANCELADO = "CANCELADO"


class MovementType(str, enum.Enum):
    entrada = "entrada"
    saida = "saida"
    ajuste = "ajuste"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False, index=True)
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[Role] = mapped_column(Enum(Role), default=Role.user, nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class StoreSettings(Base):
    __tablename__ = "store_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nome_loja: Mapped[str] = mapped_column(String(120), default="WA Açaí")
    slogan: Mapped[str | None] = mapped_column(String(180), nullable=True)
    descricao_loja: Mapped[str | None] = mapped_column(Text, nullable=True)
    telefone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    whatsapp: Mapped[str | None] = mapped_column(String(30), nullable=True)
    instagram: Mapped[str | None] = mapped_column(String(120), nullable=True)
    facebook: Mapped[str | None] = mapped_column(String(120), nullable=True)
    endereco: Mapped[str | None] = mapped_column(String(200), nullable=True)
    taxa_entrega: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    tempo_medio_entrega: Mapped[str | None] = mapped_column(String(50), nullable=True)
    loja_aberta: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    mensagem_loja_fechada: Mapped[str | None] = mapped_column(String(200), nullable=True)
    logo_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    banner_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    favicon_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    pwa_icon_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    primary_color: Mapped[str | None] = mapped_column(String(20), nullable=True)
    secondary_color: Mapped[str | None] = mapped_column(String(20), nullable=True)
    theme_color: Mapped[str | None] = mapped_column(String(20), nullable=True)
    meta_title: Mapped[str | None] = mapped_column(String(120), nullable=True)
    meta_description: Mapped[str | None] = mapped_column(String(255), nullable=True)
    pwa_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    pwa_short_name: Mapped[str | None] = mapped_column(String(60), nullable=True)
    pwa_description: Mapped[str | None] = mapped_column(String(255), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    price: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    available: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    recipes: Mapped[list["Recipe"]] = relationship(back_populates="product", cascade="all, delete-orphan")
    complements: Mapped[list["ProductComplement"]] = relationship(back_populates="product", cascade="all, delete-orphan")


class StockProduct(Base):
    __tablename__ = "stock_products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    unit_measure: Mapped[str] = mapped_column(String(10), default="un", nullable=False)
    quantity_current: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    minimum_stock: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    available_for_complement: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    complement_extra_price: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    recipe_links: Mapped[list["Recipe"]] = relationship(back_populates="stock_product", cascade="all, delete-orphan")
    complement_links: Mapped[list["ProductComplement"]] = relationship(back_populates="stock_product", cascade="all, delete-orphan")


class Recipe(Base):
    __tablename__ = "recipes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), nullable=False)
    stock_product_id: Mapped[int] = mapped_column(ForeignKey("stock_products.id"), nullable=False)
    quantity_consumed: Mapped[float] = mapped_column(Float, nullable=False)

    product: Mapped[Product] = relationship(back_populates="recipes")
    stock_product: Mapped[StockProduct] = relationship(back_populates="recipe_links")


class ProductComplement(Base):
    __tablename__ = "product_complements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), nullable=False)
    stock_product_id: Mapped[int] = mapped_column(ForeignKey("stock_products.id"), nullable=False)
    extra_price: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    product: Mapped[Product] = relationship(back_populates="complements")
    stock_product: Mapped[StockProduct] = relationship(back_populates="complement_links")


class MediaAsset(Base):
    __tablename__ = "media_assets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    entity_type: Mapped[str] = mapped_column(String(40), nullable=False)
    entity_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    kind: Mapped[str] = mapped_column(String(40), nullable=False)
    path: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    number: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    customer_name: Mapped[str] = mapped_column(String(120), nullable=False)
    phone: Mapped[str] = mapped_column(String(30), nullable=False)
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    observations: Mapped[str | None] = mapped_column(Text, nullable=True)
    payment_method: Mapped[str] = mapped_column(String(40), default="Pix", nullable=False)
    status: Mapped[OrderStatus] = mapped_column(Enum(OrderStatus), default=OrderStatus.ABERTO, nullable=False)
    subtotal: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    delivery_fee: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    total: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    stock_deducted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    accepted_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    prepared_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    ready_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    dispatch_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    finalization_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    items: Mapped[list["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"), nullable=False)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), nullable=False)
    product_name: Mapped[str] = mapped_column(String(120), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    unit_price: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    total_price: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    order: Mapped[Order] = relationship(back_populates="items")
    complements: Mapped[list["OrderItemComplement"]] = relationship(back_populates="order_item", cascade="all, delete-orphan")


class OrderItemComplement(Base):
    __tablename__ = "order_item_complements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_item_id: Mapped[int] = mapped_column(ForeignKey("order_items.id"), nullable=False)
    stock_product_id: Mapped[int] = mapped_column(ForeignKey("stock_products.id"), nullable=False)
    stock_product_name: Mapped[str] = mapped_column(String(120), nullable=False)
    quantity_consumed: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)
    extra_price: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    combo_part_index: Mapped[int | None] = mapped_column(Integer, nullable=True)

    order_item: Mapped[OrderItem] = relationship(back_populates="complements")


class StockMovement(Base):
    __tablename__ = "stock_movements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    stock_product_id: Mapped[int] = mapped_column(ForeignKey("stock_products.id"), nullable=False)
    quantity: Mapped[float] = mapped_column(Float, nullable=False)
    movement_type: Mapped[MovementType] = mapped_column(Enum(MovementType), nullable=False)
    reason: Mapped[str] = mapped_column(String(255), nullable=False)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    order_id: Mapped[int | None] = mapped_column(ForeignKey("orders.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
