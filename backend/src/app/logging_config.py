from __future__ import annotations

import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path


def project_root() -> Path:
    return Path(__file__).resolve().parents[3]


def logs_directory() -> Path:
    return project_root() / "logs"


def configure_logging(debug: bool) -> Path | None:
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.DEBUG if debug else logging.INFO)

    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    for handler in list(root_logger.handlers):
        root_logger.removeHandler(handler)

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    root_logger.addHandler(console_handler)

    log_file: Path | None = None
    if debug:
        logs_dir = logs_directory()
        logs_dir.mkdir(parents=True, exist_ok=True)
        log_file = logs_dir / "wa-acai.log"
        file_handler = RotatingFileHandler(
            log_file,
            maxBytes=1_000_000,
            backupCount=5,
            encoding="utf-8",
        )
        file_handler.setFormatter(formatter)
        root_logger.addHandler(file_handler)

    for logger_name in ("uvicorn", "uvicorn.error", "uvicorn.access", "fastapi"):
        logger = logging.getLogger(logger_name)
        logger.handlers.clear()
        logger.propagate = True
        logger.setLevel(logging.DEBUG if debug else logging.INFO)

    return log_file
