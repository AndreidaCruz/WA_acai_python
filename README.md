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
python -m src.app.main --debug --host 127.0.0.1 --port 8000
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Windows launcher:

```bat
start-wa-acai.bat
```

The launcher will create `.venv` if needed, install dependencies, start backend and frontend, and open the browser automatically.

When started with `--debug`, backend logs are written to `logs/wa-acai.log` in addition to the console.

## Admin access

The first admin is created through the one-time setup screen in the admin area.

## Convention

- `project.overview.md` is the agent entry point;
- `project.update.md` defines the current update flow;
- `agent/` contains the durable convention workspace;
- `docs/` contains the human-facing layer.

## Status

The implementation base is rebuilt and smoke-tested against the new product concept described in `agent/specs/wa-acai.spec.md`.
