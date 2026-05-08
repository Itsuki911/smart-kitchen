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

### 2. Start the backend

Open a terminal and run:

```bash
cd ~/Developer/smart-kitchen/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Check the backend:

```bash
curl http://localhost:8000/health
```

Expected response:

```json
{"status":"ok"}
```

### 3. Start the frontend

Open another terminal and run:

```bash
cd ~/Developer/smart-kitchen/frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

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
