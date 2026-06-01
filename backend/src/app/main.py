from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload

from . import crud
from .api.admin import router as admin_router
from .api.auth import router as auth_router
from .api.catalog import router as catalog_router
from .api.deps import current_user
from .api.orders import router as orders_router
from .api.settings import router as settings_router
from .config import get_settings
from .database import Base, SessionLocal, engine
from .models import Order
from .websocket.manager import admin_manager, dashboard_manager, orders_manager

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    from .seed import seed_data

    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok", "app": settings.app_name}


app.include_router(auth_router)
app.include_router(catalog_router)
app.include_router(orders_router)
app.include_router(admin_router)
app.include_router(settings_router)


@app.websocket("/ws/admin")
async def ws_admin(websocket: WebSocket):
    await admin_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except Exception:
        admin_manager.disconnect(websocket)


@app.websocket("/ws/pedidos")
async def ws_orders(websocket: WebSocket):
    await orders_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except Exception:
        orders_manager.disconnect(websocket)


@app.websocket("/ws/dashboard")
async def ws_dashboard(websocket: WebSocket):
    await dashboard_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except Exception:
        dashboard_manager.disconnect(websocket)
