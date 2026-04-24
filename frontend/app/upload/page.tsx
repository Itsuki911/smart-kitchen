"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";

type UploadSlot = {
  file: File | null;
  previewUrl: string | null;
};

type RecipeResponse = {
  file_count: number;
  filenames: string[];
  message: string;
  recipe: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const SAMPLE_IMAGES = [
  {
    label: "Sample Image 1",
    src: `${API_BASE_URL}/example_image/gettyimages-1224945016-612x612.jpg`,
  },
  {
    label: "Sample Image 2",
    src: `${API_BASE_URL}/example_image/gettyimages-1358353520-612x612.jpg`,
  },
  {
    label: "Sample Image 3",
    src: `${API_BASE_URL}/example_image/gettyimages-1591806940-612x612.jpg`,
  },
];

function createEmptySlots(): UploadSlot[] {
  return Array.from({ length: 3 }, () => ({ file: null, previewUrl: null }));
}

export default function UploadPage() {
  const [slots, setSlots] = useState<UploadSlot[]>(createEmptySlots);
  const [recipe, setRecipe] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCount = useMemo(
    () => slots.filter((slot) => slot.file !== null).length,
    [slots],
  );

  useEffect(() => {
    return () => {
      slots.forEach((slot) => {
        if (slot.previewUrl) {
          URL.revokeObjectURL(slot.previewUrl);
        }
      });
    };
  }, [slots]);

  function handleFileChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;

    setSlots((currentSlots) =>
      currentSlots.map((slot, slotIndex) => {
        if (slotIndex !== index) {
          return slot;
        }

        if (slot.previewUrl) {
          URL.revokeObjectURL(slot.previewUrl);
        }

        return {
          file: nextFile,
          previewUrl: nextFile ? URL.createObjectURL(nextFile) : null,
        };
      }),
    );

    setError("");
    setMessage("");
  }

  async function handleSubmit() {
    if (selectedCount !== 3) {
      setError("Please select exactly 3 images before submitting.");
      setRecipe("");
      return;
    }

    const formData = new FormData();
    slots.forEach((slot) => {
      if (slot.file) {
        formData.append("files", slot.file);
      }
    });

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/recipe`, {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as RecipeResponse | { detail?: string };

      if (!response.ok) {
        setRecipe("");
        setError(data.detail ?? "Failed to get the recipe.");
        return;
      }

      const result = data as RecipeResponse;
      setRecipe(result.recipe);
      setMessage(`${result.message} Uploaded: ${result.filenames.join(", ")}`);
    } catch {
      setRecipe("");
      setError("Could not connect to the backend. Start FastAPI on http://localhost:8000.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-sm backdrop-blur sm:p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">
          Sample Input
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Three-image recipe demo</h1>
        <p className="mt-3 text-sm leading-6 text-black/70">
          The backend serves the bundled sample files from `example_image/`.
          Use these three images to test the first MVP flow.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {SAMPLE_IMAGES.map((image) => (
            <article
              key={image.src}
              className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-white/70"
            >
              <img
                src={image.src}
                alt={image.label}
                className="h-48 w-full object-cover"
              />
              <div className="px-4 py-3">
                <p className="text-sm font-medium">{image.label}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-sm backdrop-blur sm:p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">
          Upload
        </p>
        <h2 className="mt-3 text-3xl font-semibold">Send exactly 3 images</h2>
        <p className="mt-3 text-sm leading-6 text-black/70">
          No AI runs here. The backend only checks that three images were sent,
          then returns a fixed English recipe for miso soup.
        </p>

        <div className="mt-8 grid gap-4">
          {slots.map((slot, index) => (
            <label
              key={`slot-${index}`}
              className="flex cursor-pointer items-center gap-4 rounded-[1.5rem] border border-dashed border-[var(--accent)]/40 bg-white/60 p-4"
            >
              <div className="h-20 w-20 overflow-hidden rounded-2xl bg-[#e5dcc9]">
                {slot.previewUrl ? (
                  <img
                    src={slot.previewUrl}
                    alt={`Selected preview ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-black/45">
                    Empty
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Image {index + 1}</p>
                <p className="truncate text-sm text-black/60">
                  {slot.file?.name ?? "Choose one image file"}
                </p>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleFileChange(index, event)}
                className="hidden"
              />
            </label>
          ))}
        </div>

        <div className="mt-4 text-sm text-black/60">{selectedCount} / 3 selected</div>

        <button
          type="button"
          onClick={handleSubmit}
          className="mt-6 w-full rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Show Fixed Recipe"}
        </button>

        {error ? (
          <p className="mt-4 rounded-2xl border border-[#c96b5a]/30 bg-[#fff4f1] px-4 py-3 text-sm text-[#8d3c30]">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="mt-4 rounded-2xl border border-[var(--border)] bg-white/70 px-4 py-3 text-sm text-black/70">
            {message}
          </p>
        ) : null}

        {recipe ? (
          <div className="mt-6 rounded-[1.5rem] border border-[var(--border)] bg-white/80 p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">
              Output
            </p>
            <pre className="mt-4 whitespace-pre-wrap text-sm leading-7 text-black/80">
              {recipe}
            </pre>
          </div>
        ) : null}
      </div>
    </section>
  );
}
