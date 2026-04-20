import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CPU Scheduling Simulator",
  description: "Student project CPU Scheduling Simulator (FCFS, SJF, SRTF) with metrics and Gantt chart.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="min-h-dvh flex flex-col">
          <header className="border-b border-[color:var(--border)] bg-white">
            <div className="mx-auto w-full max-w-7xl px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-wide text-[color:var(--muted)]">
                    Academic Dashboard
                  </span>
                  <h1 className="text-2xl font-bold tracking-tight text-[color:var(--primary)]">
                    CPU Scheduling Simulator
                  </h1>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="rounded-full border border-[color:var(--border)] bg-white px-3 py-1 text-xs font-semibold text-[color:var(--primary)]">
                    FCFS
                  </span>
                  <span className="rounded-full border border-[color:var(--border)] bg-white px-3 py-1 text-xs font-semibold text-[color:var(--primary)]">
                    SJF
                  </span>
                  <span className="rounded-full border border-[color:var(--border)] bg-white px-3 py-1 text-xs font-semibold text-[color:var(--primary)]">
                    SRTF
                  </span>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-[color:var(--border)] bg-white">
            <div className="mx-auto w-full max-w-7xl px-6 py-4 text-xs text-[color:var(--muted)]">
              CPU Scheduling Simulator • Built with Next.js, TypeScript, and Tailwind CSS
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
