# Smart Kitchen

MVP monorepo for a smart kitchen AI system with a Next.js frontend and FastAPI backend.

## Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: FastAPI, Uvicorn

## Apps

- `frontend/` for the web UI
- `backend/` for the API

## Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
