# Smart Kitchen

Initial MVP for the Smart Kitchen application.

This version implements a basic frontend and backend flow:

- The frontend shows the three sample images stored in `example_image/`.
- The user uploads exactly three images from the browser.
- The backend does not run AI inference.
- The backend returns a fixed English miso soup recipe and the frontend displays it.

## Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: FastAPI, Uvicorn

## Project Structure

- `frontend/`: web application
- `backend/`: API server
- `example_image/`: three sample images used for the first demo

## Local URLs

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Backend health check: `http://localhost:8000/health`
- Sample image hosting: `http://localhost:8000/example_image/...`

## Quick Start

### 1. Move into the project

```bash
cd "/Users/adachiitsuki/Desktop/Smart Kitchen /smart-kitchen"
```

### 2. Start the backend

Open a terminal and run:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

When the backend is running, open:

```text
http://localhost:8000/health
```

Expected response:

```json
{"status":"ok"}
```

### 3. Start the frontend

Open another terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Demo Flow

1. Open `http://localhost:3000/upload`.
2. Confirm that the three sample images are displayed on the page.
3. Upload any three image files. For the first test, use the files inside `example_image/`.
4. Click `Show Fixed Recipe`.
5. The page displays a predefined English miso soup recipe returned by the FastAPI backend.

## API Endpoints

### `GET /health`

Returns the backend status.

Example:

```bash
curl http://localhost:8000/health
```

### `POST /upload`

Simple single-file upload test endpoint.

Example:

```bash
curl -X POST -F "file=@/etc/hosts" http://localhost:8000/upload
```

### `POST /recipe`

Accepts exactly three uploaded files and returns a fixed recipe response without AI.

Example:

```bash
curl -X POST \
  -F "files=@example_image/gettyimages-1224945016-612x612.jpg" \
  -F "files=@example_image/gettyimages-1358353520-612x612.jpg" \
  -F "files=@example_image/gettyimages-1591806940-612x612.jpg" \
  http://localhost:8000/recipe
```

Response shape:

```json
{
  "message": "Fixed recipe generated without AI inference.",
  "file_count": 3,
  "filenames": [
    "gettyimages-1224945016-612x612.jpg",
    "gettyimages-1358353520-612x612.jpg",
    "gettyimages-1591806940-612x612.jpg"
  ],
  "recipe": "Classic Miso Soup\n..."
}
```

## Notes

- Start the backend before the frontend if you want the sample images and recipe request to work immediately.
- The current implementation is intentionally fixed-output and is the base step before adding AI processing.
