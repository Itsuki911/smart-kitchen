import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Kitchen",
  description: "Orange-themed Smart Kitchen demo for health-aware image upload and recipe history.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <header className="mb-8 rounded-[1.75rem] border border-[var(--border)] bg-[var(--panel)] px-5 py-4 shadow-[0_18px_50px_rgba(255,122,24,0.12)] backdrop-blur">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/" className="text-xl font-semibold tracking-[0.02em] text-[var(--accent-strong)]">
                Smart Kitchen
              </Link>
              <nav className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
                <Link href="/" className="rounded-full px-4 py-2 transition hover:bg-white/70">
                  Home
                </Link>
                <Link href="/upload" className="rounded-full px-4 py-2 transition hover:bg-white/70">
                  Recipe Demo
                </Link>
                <Link href="/history" className="rounded-full px-4 py-2 transition hover:bg-white/70">
                  History
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
