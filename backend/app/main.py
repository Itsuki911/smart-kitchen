from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Smart Kitchen API")

PROJECT_ROOT = Path(__file__).resolve().parents[2]
EXAMPLE_IMAGE_DIR = PROJECT_ROOT / "example_image"
RECIPE_HISTORY: list[dict[str, object]] = []
MISO_SOUP_RECIPE = """Classic Miso Soup

Ingredients:
- 4 cups dashi stock
- 3 tablespoons miso paste
- 150 g soft tofu, cut into small cubes
- 2 tablespoons dried wakame seaweed
- 2 green onions, thinly sliced

Instructions:
1. Heat the dashi stock in a pot over medium heat until hot, but do not let it boil.
2. Soak the wakame in water for 5 minutes, then drain it.
3. Add the tofu and wakame to the pot and warm them gently for 2 minutes.
4. Put the miso paste in a small bowl, add a ladle of hot dashi, and stir until smooth.
5. Return the dissolved miso to the pot and mix gently.
6. Turn off the heat before the soup starts to boil, then finish with sliced green onions.
"""

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if EXAMPLE_IMAGE_DIR.exists():
    app.mount(
        "/example_image",
        StaticFiles(directory=EXAMPLE_IMAGE_DIR),
        name="example_image",
    )


def validate_health_answers(answers: dict[str, str]) -> None:
    missing_labels = [label for label, value in answers.items() if not value.strip()]
    if missing_labels:
        missing = ", ".join(missing_labels)
        raise HTTPException(
            status_code=400,
            detail=f"Please complete all health check fields before running the recipe demo: {missing}.",
        )


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/history")
async def get_history() -> dict[str, object]:
    return {
        "count": len(RECIPE_HISTORY),
        "items": list(reversed(RECIPE_HISTORY)),
    }


@app.post("/upload")
async def upload_image(file: UploadFile = File(...)) -> dict[str, str | int]:
    content = await file.read()
    return {
        "filename": file.filename or "unknown",
        "content_type": file.content_type or "application/octet-stream",
        "size": len(content),
    }


@app.post("/recipe")
async def create_recipe(
    current_condition: str = Form(...),
    dietary_notes: str = Form(...),
    craving: str = Form(...),
    files: list[UploadFile] = File(...),
) -> dict[str, object]:
    health_check = {
        "Current condition": current_condition,
        "Dietary notes": dietary_notes,
        "Today's craving": craving,
    }
    validate_health_answers(health_check)

    if len(files) != 3:
        raise HTTPException(status_code=400, detail="Please upload exactly 3 images.")

    filenames: list[str] = []
    for file in files:
        await file.read()
        filenames.append(file.filename or "unknown")

    history_item = {
        "id": str(uuid4()),
        "created_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "title": "Miso Soup Recipe",
        "message": "Fixed recipe generated without AI inference.",
        "filenames": filenames,
        "health_check": health_check,
        "recipe": MISO_SOUP_RECIPE,
    }
    RECIPE_HISTORY.append(history_item)

    return history_item
