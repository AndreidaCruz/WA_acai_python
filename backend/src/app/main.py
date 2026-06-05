from __future__ import annotations

import argparse
import logging
import os
import sys
import time
from contextlib import asynccontextmanager
from uuid import uuid4

from fastapi import FastAPI, Request, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

if "--debug" in sys.argv:
    os.environ["WA_ACAI_DEBUG"] = "1"

from . import crud
from .api.admin import router as admin_router
from .api.auth import router as auth_router
from .api.catalog import router as catalog_router
from .api.orders import router as orders_router
from .api.settings import router as settings_router
from .config import get_settings
from .database import Base, SessionLocal, engine
from .logging_config import configure_logging
from .websocket.manager import admin_manager, dashboard_manager, orders_manager

settings = get_settings()
log_file = configure_logging(settings.debug)
logger = logging.getLogger("waacai.app")


def ensure_sqlite_migrations() -> None:
    if not settings.database_url.startswith("sqlite"):
        return
    with engine.begin() as connection:
        columns = {row[1] for row in connection.execute(text("PRAGMA table_info(order_item_complements)"))}
        if "combo_part_index" not in columns:
            logger.info("startup: adding combo_part_index column to order_item_complements")
            connection.execute(text("ALTER TABLE order_item_complements ADD COLUMN combo_part_index INTEGER"))


@asynccontextmanager
async def lifespan(app: FastAPI):
    if log_file is not None:
        logger.info("debug logging enabled: %s", log_file)
    logger.info("booting application %s", settings.app_name)
    logger.info("startup: creating database schema")
    Base.metadata.create_all(bind=engine)
    ensure_sqlite_migrations()
    from .seed import seed_data

    db = SessionLocal()
    try:
        seed_data(db)
        logger.info("startup: seed complete")
    finally:
        db.close()
    yield
    logger.info("shutdown: application stopped")


app = FastAPI(title=settings.app_name, lifespan=lifespan)
app.state.debug = settings.debug
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_http_requests(request: Request, call_next):
    request_id = uuid4().hex[:12]
    start = time.perf_counter()
    client_host = request.client.host if request.client else "unknown"
    logger.info(
        "http start request_id=%s method=%s path=%s client=%s",
        request_id,
        request.method,
        request.url.path,
        client_host,
    )
    try:
        response = await call_next(request)
    except Exception:
        duration_ms = (time.perf_counter() - start) * 1000
        logger.exception(
            "http error request_id=%s method=%s path=%s duration_ms=%.2f",
            request_id,
            request.method,
            request.url.path,
            duration_ms,
        )
        raise
    duration_ms = (time.perf_counter() - start) * 1000
    response.headers["X-Request-ID"] = request_id
    logger.info(
        "http done request_id=%s method=%s path=%s status=%s duration_ms=%.2f",
        request_id,
        request.method,
        request.url.path,
        response.status_code,
        duration_ms,
    )
    return response


@app.get("/api/health")
def health():
    logger.debug("health check requested")
    return {"status": "ok", "app": settings.app_name, "debug": settings.debug}


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


def main() -> None:
    import uvicorn

    parser = argparse.ArgumentParser(description="WA Açaí backend launcher")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--reload", action="store_true")
    parser.add_argument("--debug", action="store_true")
    args = parser.parse_args()

    if args.debug:
        os.environ["WA_ACAI_DEBUG"] = "1"

    uvicorn.run(
        "src.app.main:app",
        host=args.host,
        port=args.port,
        reload=args.reload,
        log_config=None,
    )


if __name__ == "__main__":
    main()
