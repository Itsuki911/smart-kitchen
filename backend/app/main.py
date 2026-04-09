from fastapi import FastAPI, File, UploadFile

app = FastAPI(title="Smart Kitchen API")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/upload")
async def upload_image(file: UploadFile = File(...)) -> dict[str, str | int]:
    content = await file.read()
    return {
        "filename": file.filename or "unknown",
        "content_type": file.content_type or "application/octet-stream",
        "size": len(content),
    }
