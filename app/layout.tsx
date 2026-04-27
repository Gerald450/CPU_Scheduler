import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <div className="min-h-dvh flex flex-col min-w-0">
          <header className="border-b border-[color:var(--border)] bg-white">
            <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4 min-w-0">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs sm:text-sm font-semibold tracking-wide text-[color:var(--muted)]">
                    Academic Dashboard
                  </span>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[color:var(--primary)] break-words">
                    CPU Scheduling Simulator
                  </h1>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 min-w-0">{children}</main>
          <footer className="border-t border-[color:var(--border)] bg-white">
            <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 sm:py-4 text-xs text-[color:var(--muted)] leading-relaxed">
              CPU Scheduling Simulator • Built with Next.js, TypeScript, and Tailwind CSS
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
