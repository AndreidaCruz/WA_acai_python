# WA Açaí

WA Açaí is being rebuilt as a delivery-style PWA for catalog browsing, guest ordering, authenticated accounts, and admin stock control.

## Current direction

- React + Vite frontend;
- FastAPI backend under `backend/src`;
- SQLite persistence;
- JWT authentication;
- realtime order and inventory updates;
- stock and recipe-based consumption.

## Run locally

Backend:

```bash
cd backend
python -m uvicorn src.app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Admin access

The first admin is created through the one-time setup screen in the admin area.

## Convention

- `project.overview.md` is the agent entry point;
- `project.update.md` defines the current update flow;
- `agent/` contains the durable convention workspace;
- `docs/` contains the human-facing layer.

## Status

The implementation base is rebuilt and smoke-tested against the new product concept described in `agent/specs/wa-acai.spec.md`.
