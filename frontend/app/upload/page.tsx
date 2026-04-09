"use client";

import { ChangeEvent, useState } from "react";

export default function UploadPage() {
  const [fileName, setFileName] = useState("No image selected");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setFileName(file?.name ?? "No image selected");
  }

  return (
    <section className="mx-auto max-w-2xl rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-sm backdrop-blur sm:p-8">
      <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">
        Upload
      </p>
      <h1 className="mt-3 text-3xl font-semibold">Send a food image</h1>
      <p className="mt-3 text-sm leading-6 text-black/70">
        This is a simple UI placeholder for the image upload workflow. The next
        step is wiring the form to the FastAPI `/upload` endpoint.
      </p>

      <label className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-[var(--accent)]/40 bg-white/60 px-6 py-12 text-center">
        <span className="text-base font-medium">Choose an image</span>
        <span className="mt-2 text-sm text-black/60">{fileName}</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      <button
        type="button"
        className="mt-6 w-full rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
        disabled={fileName === "No image selected"}
      >
        Upload Image
      </button>
    </section>
  );
}
