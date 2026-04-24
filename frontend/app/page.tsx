import Link from "next/link";

export default function HomePage() {
  return (
    <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-8 shadow-sm backdrop-blur">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[var(--accent)]">
          Smart Kitchen MVP
        </p>
        <h1 className="mb-4 text-4xl font-semibold leading-tight sm:text-5xl">
          Upload three food images and return a fixed miso soup recipe.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-black/70">
          This first version does not run AI inference. It accepts three images,
          sends them to the FastAPI backend, and displays a predefined recipe in
          English.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/upload"
            className="rounded-full bg-[var(--accent-strong)] px-5 py-3 text-center text-sm font-medium text-white"
          >
            Open Demo
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
          Current Scope
        </p>
        <ul className="mt-5 space-y-4 text-sm leading-6 text-white/85">
          <li>Preview the three bundled sample images from `example_image/`.</li>
          <li>Upload exactly three images from the browser.</li>
          <li>Display a fixed English miso soup recipe from the backend.</li>
        </ul>
      </div>
    </section>
  );
}
