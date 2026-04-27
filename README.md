# Smart Kitchen

Smart Kitchen is an orange-themed MVP web application with a Next.js frontend and a FastAPI backend.

This version focuses on a simple connected flow:

- The home page is simplified to three main functions:
  - app description
  - button to the recipe demo page
  - button to the history page
- The recipe demo page includes:
  - a page title
  - three health check input items
  - three image upload fields
  - a run button
  - an error message when execution is not allowed
  - a fixed English miso soup recipe shown under the button after success
- The backend stores recipe run history in memory and exposes it to the history page.

## Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: FastAPI, Uvicorn

## Project Structure

- `frontend/`: web application
- `backend/`: API server
- `example_image/`: sample images for local testing

## Local URLs

- Frontend top page: `http://localhost:3000`
- Recipe demo page: `http://localhost:3000/upload`
- History page: `http://localhost:3000/history`
- Backend API: `http://localhost:8000`
- Backend health check: `http://localhost:8000/health`
- Backend history API: `http://localhost:8000/history`

## Quick Start

### 1. Move into the project

```bash
cd ~/Developer/smart-kitchen
```

### 2. First-time backend setup

Run this only the first time, or when `backend/.venv` is broken and needs to be recreated.

```bash
cd ~/Developer/smart-kitchen/backend
python3 -m venv .venv
source .venv/bin/activate
python -m ensurepip --upgrade
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Important:

- Create and use the virtual environment inside `backend/.venv`.
- Use `python -m pip ...` instead of calling `pip` directly if `pip` behaves unexpectedly.
- You do not need to run `python3 -m venv .venv` every time you start the backend.

### 3. Start the backend

Open a terminal and run:

```bash
cd ~/Developer/smart-kitchen/backend
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0
```

Check the backend:

```bash
curl http://localhost:8000/health
```

If you open the frontend from a network URL such as `http://172.x.x.x:3000`, the
`--host 0.0.0.0` flag is required so the browser can reach the backend on your
local network address.

Expected response:

```json
{"status":"ok"}
```

### 4. First-time frontend setup

Run this only the first time, or after dependency changes such as `package.json` updates.

```bash
cd ~/Developer/smart-kitchen/frontend
npm install
```

You usually do not need to run `npm install` for every frontend code change.

### 5. Start the frontend

Open another terminal and run:

```bash
cd ~/Developer/smart-kitchen/frontend
npm run dev
```

Then open:

```text
http://localhost:3000
```

Then open:

```text
http://localhost:3000/upload
```

When Next.js shows:

```text
Ready in ...
```

the frontend server is started and waiting for requests. Page-specific compiling can still happen when you open a route for the first time.

## UI Flow

### Home page 

The top page has three main functions:

1. app explanation
2. button to move to the recipe demo page
3. button to move to the history page

### Recipe demo page

Open:

```text
http://localhost:3000/upload
```

Page structure:

1. page title
2. three health check items
3. three image upload fields
4. run button
5. error message when the form is incomplete
6. fixed miso soup recipe displayed under the button after a successful request

Validation rules:

- The run button sends no request until all three health check fields contain text.
- Exactly three images must be selected.
- If execution is blocked, a red error message explains why.

For testing, you can use the files inside `example_image/`.

### History page

Open:

```text
http://localhost:3000/history
```

This page shows previous recipe runs stored in backend memory.

## API Endpoints

### `GET /health`

Backend status check.

Example:

```bash
curl http://localhost:8000/health
```

### `GET /history`

Returns the recipe history currently stored in memory.

Example:

```bash
curl http://localhost:8000/history
```

### `POST /upload`

Simple single-file upload test endpoint.

Example:

```bash
curl -X POST -F "file=@/etc/hosts" http://localhost:8000/upload
```

### `POST /recipe`

Accepts:

- `current_condition`
- `dietary_notes`
- `craving`
- exactly three uploaded files in `files`

Example:

```bash
curl -X POST \
  -F "current_condition=I want something warm and light." \
  -F "dietary_notes=Please keep it gentle and not spicy." \
  -F "craving=I want a comforting Japanese-style soup." \
  -F "files=@example_image/gettyimages-1224945016-612x612.jpg" \
  -F "files=@example_image/gettyimages-1358353520-612x612.jpg" \
  -F "files=@example_image/gettyimages-1591806940-612x612.jpg" \
  http://localhost:8000/recipe
```

Response shape:

```json
{
  "id": "history-item-id",
  "created_at": "2026-04-24T00:00:00+00:00",
  "title": "Miso Soup Recipe",
  "message": "Fixed recipe generated without AI inference.",
  "filenames": [
    "gettyimages-1224945016-612x612.jpg",
    "gettyimages-1358353520-612x612.jpg",
    "gettyimages-1591806940-612x612.jpg"
  ],
  "health_check": {
    "Current condition": "I want something warm and light.",
    "Dietary notes": "Please keep it gentle and not spicy.",
    "Today's craving": "I want a comforting Japanese-style soup."
  },
  "recipe": "Classic Miso Soup\n..."
}
```

## Notes

- The recipe is currently fixed and does not use AI inference yet.
- History is stored in memory only, so it resets when the backend restarts.
- Start the backend before using the recipe demo page or history page.

## Troubleshooting

### Frontend says it cannot connect to the backend

Symptoms:

- `Could not connect to the backend. Start FastAPI on http://localhost:8000.`
- `GET /health` works in the browser, but `Run Recipe Demo` fails

Checks:

- Make sure FastAPI is running
- Prefer opening the frontend at `http://localhost:3000`
- If you open the frontend from a network URL such as `http://172.x.x.x:3000`, keep using:

```bash
uvicorn app.main:app --reload --host 0.0.0.0
```

The frontend is configured to call the backend on the same host name as the page you opened.

### `RuntimeError: Form data requires "python-multipart" to be installed`

This means the backend dependencies are not installed in the virtual environment you are actually using.

Fix:

```bash
cd ~/Developer/smart-kitchen/backend
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m pip show python-multipart
```

### `ModuleNotFoundError: No module named 'pip._internal'`

This means the current virtual environment is broken.

Fix:

```bash
cd ~/Developer/smart-kitchen/backend
rm -rf .venv
python3 -m venv .venv
source .venv/bin/activate
python -m ensurepip --upgrade
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

### `ERROR: [Errno 48] Address already in use`

Port `8000` is already used by another process, often an older `uvicorn` instance.

Check and stop it:

```bash
lsof -nP -iTCP:8000 -sTCP:LISTEN
kill <PID>
```

If needed:

```bash
kill -9 <PID>
```

Then start the backend again.

### `npm run dev` is very slow

On this project, long delays are usually caused by the local environment rather than the app size.

Recommended actions:

- Use `npm run dev` without running `npm install` every time
- Remove the frontend cache if compiling becomes unusually slow:

```bash
cd ~/Developer/smart-kitchen/frontend
rm -rf .next
npm run dev
```

- If `node_modules` looks broken, reinstall:

```bash
cd ~/Developer/smart-kitchen/frontend
rm -rf node_modules .next
npm install
npm run dev
```

- Prefer Node.js `22 LTS` if you see environment-specific package errors with newer Node versions

### `ERR_INVALID_PACKAGE_CONFIG` inside `node_modules/next/...`

This usually indicates a broken frontend install or a Node.js compatibility issue.

Try:

```bash
cd ~/Developer/smart-kitchen/frontend
rm -rf node_modules .next
npm install
npm run dev
```

If the error continues, switch to Node.js `22 LTS` and reinstall again.
