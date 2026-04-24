import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Kitchen",
  description: "Upload three images and display a fixed English miso soup recipe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6">
          <header className="mb-8 rounded-full border border-[var(--border)] bg-[var(--panel)] px-5 py-3 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="text-lg font-semibold tracking-wide">
                Smart Kitchen
              </Link>
              <nav className="flex items-center gap-4 text-sm">
                <Link href="/">Home</Link>
                <Link href="/upload">Demo</Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
