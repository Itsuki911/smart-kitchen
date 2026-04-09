import Link from "next/link";

export default function HomePage() {
  return (
    <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-8 shadow-sm backdrop-blur">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[var(--accent)]">
          Smart Kitchen AI
        </p>
        <h1 className="mb-4 text-4xl font-semibold leading-tight sm:text-5xl">
          A minimal control panel for recipe and ingredient vision.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-black/70">
          Start with an MVP that accepts food images, checks backend health, and
          gives you a clean base for future AI workflows.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/upload"
            className="rounded-full bg-[var(--accent-strong)] px-5 py-3 text-center text-sm font-medium text-white"
          >
            Open Upload
          </Link>
          <a
            href="http://localhost:8000/health"
            className="rounded-full border border-[var(--border)] px-5 py-3 text-center text-sm font-medium"
          >
            Check API Health
          </a>
        </div>
      </div>

      <div className="rounded-[2rem] border border-[var(--border)] bg-[#243119] p-8 text-white shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">
          MVP Scope
        </p>
        <ul className="mt-5 space-y-4 text-sm leading-6 text-white/85">
          <li>Next.js frontend with App Router and Tailwind styling.</li>
          <li>FastAPI backend with health and upload endpoints.</li>
          <li>Simple structure that is easy to extend with AI features.</li>
        </ul>
      </div>
    </section>
  );
}
