import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mx-auto grid max-w-4xl gap-8">
      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-8 shadow-[0_24px_80px_rgba(255,122,24,0.12)] sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
          Smart Kitchen
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-[var(--foreground)] sm:text-5xl">
          Turn uploaded food images into a recipe demo with a bright, simple workflow.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">
          This MVP accepts three uploaded images, collects a small health check,
          and shows a predefined English miso soup recipe. It is designed as the
          first step before adding AI-based recipe generation.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <article className="rounded-[1.75rem] border border-[var(--border)] bg-white/85 p-6 shadow-[0_18px_45px_rgba(255,122,24,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            1. App Overview
          </p>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            Upload three images, fill in three health-check fields, and receive
            the current fixed recipe result from the backend.
          </p>
        </article>

        <article className="rounded-[1.75rem] border border-[var(--border)] bg-[linear-gradient(180deg,#ff9b45_0%,#ff7a18_100%)] p-6 text-white shadow-[0_20px_55px_rgba(255,122,24,0.24)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/75">
            2. Recipe Demo
          </p>
          <p className="mt-4 text-sm leading-7 text-white/90">
            Move to the recipe page and test the upload flow.
          </p>
          <Link
            href="/upload"
            className="mt-8 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#c95500]"
          >
            Go To Upload Page
          </Link>
        </article>

        <article className="rounded-[1.75rem] border border-[var(--border)] bg-white/85 p-6 shadow-[0_18px_45px_rgba(255,122,24,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            3. History
          </p>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            Open the history page to review previously generated recipe results.
          </p>
          <Link
            href="/history"
            className="mt-8 inline-flex rounded-full border border-[var(--border-strong)] px-5 py-3 text-sm font-semibold text-[var(--accent-strong)]"
          >
            Open History
          </Link>
        </article>
      </div>
    </section>
  );
}
