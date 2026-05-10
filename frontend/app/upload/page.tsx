"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { getApiErrorHint } from "@/lib/api";
import {
  HEALTH_FIELDS,
  HealthFormState,
  RecipeHistoryItem,
  buildHealthCheck,
  validateHealthCheck,
} from "@/lib/recipe";

type UploadSlot = {
  file: File | null;
  previewUrl: string | null;
};

function createEmptySlots(): UploadSlot[] {
  return Array.from({ length: 3 }, () => ({ file: null, previewUrl: null }));
}

export default function UploadPage() {
  const [healthForm, setHealthForm] = useState<HealthFormState>({
    currentCondition: "",
    dietaryNotes: "",
    craving: "",
  });
  const [slots, setSlots] = useState<UploadSlot[]>(createEmptySlots);
  const [recipeResult, setRecipeResult] = useState<RecipeHistoryItem | null>(null);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCount = useMemo(
    () => slots.filter((slot) => slot.file !== null).length,
    [slots],
  );

  function handleFieldChange(key: keyof typeof healthForm, value: string) {
    setHealthForm((current) => ({ ...current, [key]: value }));
    setError("");
  }

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
  }

  function validateBeforeSubmit() {
    const validationError = validateHealthCheck(buildHealthCheck(healthForm));

    if (validationError) {
      return `Cannot run the recipe demo yet. ${validationError}`;
    }

    if (selectedCount !== 3) {
      return "Cannot run the recipe demo yet. Please upload exactly 3 images.";
    }

    return "";
  }

  async function handleSubmit() {
    const validationError = validateBeforeSubmit();

    if (validationError) {
      setError(validationError);
      setRecipeResult(null);
      setStatusMessage("");
      return;
    }

    const formData = new FormData();
    formData.append("current_condition", healthForm.currentCondition.trim());
    formData.append("dietary_notes", healthForm.dietaryNotes.trim());
    formData.append("craving", healthForm.craving.trim());

    slots.forEach((slot) => {
      if (slot.file) {
        formData.append("files", slot.file);
      }
    });

    setIsSubmitting(true);
    setError("");
    setStatusMessage("");

    try {
      const response = await fetch("/api/recipe", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as
        | RecipeHistoryItem
        | {
            detail?: string;
          };

      if (!response.ok) {
        const errorResponse = data as { detail?: string };
        setRecipeResult(null);
        setError(errorResponse.detail ?? "Failed to create the recipe result.");
        return;
      }

      const result = data as RecipeHistoryItem;
      setRecipeResult(result);
      setStatusMessage(`${result.message} Saved as history item ${result.id.slice(0, 8)}.`);
    } catch {
      setRecipeResult(null);
      setError(getApiErrorHint());
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-4xl rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_24px_80px_rgba(255,122,24,0.12)] sm:p-8">
      <div className="border-b border-[var(--border)] pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
          Recipe Demo
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
          Health-aware image upload recipe flow
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">
          Fill in the health check, upload three images, and run the demo. The
          recipe result and image metadata are saved through Supabase-backed API
          routes so the history can persist across deployments. For testing, you
          can use the image files in `example_image/`.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Health check</h2>
        <div className="mt-4 grid gap-4">
          {HEALTH_FIELDS.map((field) => (
            <label
              key={field.key}
              className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-4"
            >
              <div className="text-sm font-semibold text-[var(--accent-strong)]">
                {field.label}
              </div>
              <textarea
                value={healthForm[field.key]}
                onChange={(event) => handleFieldChange(field.key, event.target.value)}
                placeholder={field.placeholder}
                rows={3}
                className="mt-3 w-full resize-none rounded-[1rem] border border-[var(--border)] bg-[#fffaf5] px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition focus:border-[var(--border-strong)]"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Upload three images</h2>
        <div className="mt-4 grid gap-4">
          {slots.map((slot, index) => (
            <label
              key={`image-slot-${index}`}
              className="flex cursor-pointer flex-col gap-4 rounded-[1.5rem] border border-dashed border-[var(--border-strong)] bg-white/78 p-4 transition hover:bg-white sm:flex-row sm:items-center"
            >
              <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-[1.25rem] bg-[#ffe1c0] sm:h-20 sm:w-20">
                {slot.previewUrl ? (
                  <img
                    src={slot.previewUrl}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                    Image {index + 1}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-[var(--foreground)]">
                  Upload slot {index + 1}
                </div>
                <div className="break-all text-sm text-[var(--muted)]">
                  {slot.file?.name ?? "Choose one image file"}
                </div>
              </div>
              <div className="w-full rounded-full bg-[#fff1df] px-4 py-3 text-center text-sm font-semibold text-[var(--accent-strong)] sm:w-auto sm:py-2">
                Select File
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
        <p className="mt-3 text-sm text-[var(--muted)]">{selectedCount} / 3 images selected</p>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#ff9936_0%,#ff7a18_100%)] px-5 py-4 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(255,122,24,0.24)] disabled:opacity-60"
        >
          {isSubmitting ? "Running Demo..." : "Run Recipe Demo"}
        </button>

        {error ? (
          <p className="mt-4 text-sm leading-6 text-[var(--error)] sm:text-base">{error}</p>
        ) : null}

        {statusMessage ? (
          <p className="mt-4 rounded-[1.25rem] border border-[var(--border)] bg-white/78 px-4 py-3 text-sm text-[var(--muted)]">
            {statusMessage}
          </p>
        ) : null}

        {recipeResult ? (
          <div className="mt-6 rounded-[1.75rem] border border-[var(--border)] bg-white/82 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]">
              Recipe Output
            </p>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Generated at {new Date(recipeResult.created_at).toLocaleString()}
            </p>
            <p className="mt-2 break-all text-sm text-[var(--muted)]">
              Files: {recipeResult.filenames.join(", ")}
            </p>
            <pre className="mt-5 whitespace-pre-wrap text-sm leading-7 text-[var(--foreground)]">
              {recipeResult.recipe}
            </pre>
          </div>
        ) : null}
      </div>
    </section>
  );
}
