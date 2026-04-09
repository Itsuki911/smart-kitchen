# Smart Kitchen

MVP monorepo for a smart kitchen AI system with a Next.js frontend and FastAPI backend.

## Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: FastAPI, Uvicorn

## Apps

- `frontend/` for the web UI
- `backend/` for the API

## Quick Start

### 1. Move into the project

```bash
cd "/Users/adachiitsuki/Desktop/Smart Kitchen /smart-kitchen"
```

### 2. Start the frontend

Open a new terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at:

```text
http://localhost:3000
```

### 3. Start the backend

Open another terminal and run:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend will be available at:

```text
http://localhost:8000
```

### 4. Check the API

Run this in a third terminal:

```bash
curl http://127.0.0.1:8000/health
```

Expected response:

```json
{"status":"ok"}
```

### 5. Test file upload

```bash
curl -X POST -F "file=@/etc/hosts" http://127.0.0.1:8000/upload
```

Expected response format:

```json
{
  "filename": "hosts",
  "content_type": "application/octet-stream",
  "size": 123
}
```

## Development Notes

- Use two terminals during development: one for `frontend`, one for `backend`.
- If `npm run dev` fails on macOS under `Desktop`, move the project to a simpler path such as `~/Developer/smart-kitchen`.
- If `code .` does not work, enable the VS Code shell command from the Command Palette with `Shell Command: Install 'code' command in PATH`.
