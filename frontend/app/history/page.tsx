"use client";

import { useEffect, useState } from "react";
import { getApiBaseUrl, getBackendConnectionHint } from "@/lib/api";

type RecipeHistoryItem = {
  created_at: string;
  filenames: string[];
  health_check: Record<string, string>;
  id: string;
  message: string;
  recipe: string;
  title: string;
};

type HistoryResponse = {
  count: number;
  items: RecipeHistoryItem[];
};

export default function HistoryPage() {
  const apiBaseUrl = getApiBaseUrl();
  const [items, setItems] = useState<RecipeHistoryItem[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await fetch(`${apiBaseUrl}/history`);
        const data = (await response.json()) as HistoryResponse | { detail?: string };

        if (!response.ok) {
          setError(data.detail ?? "Failed to load history.");
          return;
        }

        setItems((data as HistoryResponse).items);
      } catch {
        setError(getBackendConnectionHint());
      } finally {
        setIsLoading(false);
      }
    }

    void loadHistory();
  }, [apiBaseUrl]);

  return (
    <section className="mx-auto max-w-5xl rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_24px_80px_rgba(255,122,24,0.12)] sm:p-8">
      <div className="border-b border-[var(--border)] pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
          History
        </p>
        <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Previous recipe runs</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">
          This page shows the recipe results previously generated from the upload
          page. History is stored in backend memory, so it resets when the FastAPI
          server restarts.
        </p>
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-[var(--muted)]">Loading history...</p>
      ) : null}

      {error ? (
        <p className="mt-6 text-sm leading-6 text-[var(--error)] sm:text-base">{error}</p>
      ) : null}

      {!isLoading && !error && items.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--muted)]">
          No history yet. Run the recipe demo first.
        </p>
      ) : null}

      <div className="mt-8 grid gap-5">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-[1.75rem] border border-[var(--border)] bg-white/82 p-5 shadow-[0_16px_40px_rgba(255,122,24,0.08)]"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-[var(--foreground)]">{item.title}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{item.message}</p>
              </div>
              <p className="text-sm text-[var(--muted)]">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.25rem] bg-[#fff5ea] p-4">
                <p className="text-sm font-semibold text-[var(--accent-strong)]">Health check</p>
                <div className="mt-3 grid gap-3 text-sm text-[var(--foreground)]">
                  {Object.entries(item.health_check).map(([label, value]) => (
                    <div key={label}>
                      <p className="font-semibold">{label}</p>
                      <p className="mt-1 leading-6 text-[var(--muted)]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.25rem] bg-[#fff5ea] p-4">
                <p className="text-sm font-semibold text-[var(--accent-strong)]">Uploaded files</p>
                <ul className="mt-3 grid gap-2 text-sm text-[var(--muted)]">
                  {item.filenames.map((filename) => (
                    <li key={filename}>{filename}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 rounded-[1.25rem] border border-[var(--border)] bg-white p-4">
              <p className="text-sm font-semibold text-[var(--accent-strong)]">Recipe</p>
              <pre className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--foreground)]">
                {item.recipe}
              </pre>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
