"use client";

import { useMemo, useState } from "react";
import type { ApiAlgorithm, ProcessInput, SimulateResponseBody } from "@/lib/types";
import { validateProcessInputs } from "@/lib/utils/validation";
import { ProcessInputForm } from "@/components/ProcessInputForm";
import { ResultPanel } from "@/components/ResultPanel";

const defaultSample: ProcessInput[] = [
  { processId: "P1", arrivalTime: 0, burstTime: 7 },
  { processId: "P2", arrivalTime: 2, burstTime: 4 },
  { processId: "P3", arrivalTime: 4, burstTime: 1 },
];

const defaultEmpty: ProcessInput[] = [
  { processId: "", arrivalTime: Number.NaN, burstTime: Number.NaN },
  { processId: "", arrivalTime: Number.NaN, burstTime: Number.NaN },
  { processId: "", arrivalTime: Number.NaN, burstTime: Number.NaN },
];

function ensureCount(list: ProcessInput[], count: number): ProcessInput[] {
  const n = Math.max(1, Math.min(20, Math.floor(count || 1)));
  const next = list.slice(0, n);
  while (next.length < n) {
    const idx = next.length + 1;
    next.push({ processId: "", arrivalTime: Number.NaN, burstTime: Number.NaN });
  }
  return next;
}

type FieldErrors = Record<string, string>;

export default function Home() {
  const [processCount, setProcessCount] = useState<number>(3);
  const [processCountInput, setProcessCountInput] = useState<string>("3");
  const [processData, setProcessData] = useState<ProcessInput[]>(defaultEmpty);
  const [algorithm, setAlgorithm] = useState<ApiAlgorithm>("RECOMMENDED");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<SimulateResponseBody | null>(null);

  const safeProcessData = useMemo(
    () => ensureCount(processData, processCount),
    [processData, processCount],
  );

  function mapErrors(errors: { path: string; message: string }[]): FieldErrors {
    const out: FieldErrors = {};
    for (const e of errors) out[e.path] = e.message;
    return out;
  }

  function validateFrontend(): { ok: true } | { ok: false; errors: FieldErrors } {
    const errors: FieldErrors = {};
    if (processCountInput.trim() === "") {
      errors.processCount = "Please enter the number of processes.";
    } else if (!Number.isFinite(processCount) || processCount < 1) {
      errors.processCount = "Number of processes must be at least 1.";
    }

    const v = validateProcessInputs(safeProcessData);
    for (const e of v) errors[e.path] = e.message;

    if (Object.keys(errors).length) return { ok: false, errors };
    return { ok: true };
  }

  async function runSimulation(overrideAlgorithm?: ApiAlgorithm) {
    setApiError(null);
    const v = validateFrontend();
    if (!v.ok) {
      setFieldErrors(v.errors);
      setResult(null);
      return;
    }

    setFieldErrors({});
    setIsRunning(true);
    try {
      const chosenAlgorithm = overrideAlgorithm ?? algorithm;
      const url = new URL("/api/simulate", window.location.href);
      const res = await fetch(url.toString(), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ processData: safeProcessData, algorithm: chosenAlgorithm }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as
          | { message?: string; errors?: { path: string; message: string }[] }
          | null;
        const serverErrors = payload?.errors ?? [];
        if (serverErrors.length) setFieldErrors(mapErrors(serverErrors));
        setApiError(payload?.message ?? "Simulation failed. Please check your inputs.");
        setResult(null);
        return;
      }

      const data = (await res.json()) as SimulateResponseBody;
      setResult(data);
    } catch (err) {
      // Fetch throws (instead of returning a Response) on connection errors, aborted requests, etc.
      const hint = `Make sure the app URL matches the dev server port (you are on ${window.location.origin}).`;
      const msg = err instanceof Error ? err.message : "Failed to fetch";
      console.error("Simulation request failed:", err);
      setApiError(`Network error (${msg}). ${hint}`);
      setResult(null);
    } finally {
      setIsRunning(false);
    }
  }

  function resetAll() {
    setProcessCount(3);
    setProcessCountInput("3");
    setProcessData(defaultEmpty);
    setAlgorithm("RECOMMENDED");
    setFieldErrors({});
    setApiError(null);
    setResult(null);
    setIsRunning(false);
  }

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 min-w-0">
        <div className="flex justify-center min-w-0">
          <div className="w-full max-w-3xl min-w-0">
            <ProcessInputForm
              processCountInput={processCountInput}
              processData={safeProcessData}
              algorithm={algorithm}
              fieldErrors={fieldErrors}
              isRunning={isRunning}
              onProcessCountInputChange={(value) => {
                setProcessCountInput(value);
                if (value.trim() === "") return;
                const parsed = Number(value);
                if (!Number.isFinite(parsed)) return;
                const nextCount = Math.max(1, Math.min(20, Math.floor(parsed || 1)));
                setProcessCount(nextCount);
                setProcessData((cur) => ensureCount(cur, nextCount));
              }}
              onProcessCountInputBlur={() => {
                if (processCountInput.trim() === "") {
                  setProcessCountInput(String(processCount));
                } else {
                  const parsed = Number(processCountInput);
                  if (Number.isFinite(parsed)) {
                    const nextCount = Math.max(1, Math.min(20, Math.floor(parsed || 1)));
                    setProcessCount(nextCount);
                    setProcessCountInput(String(nextCount));
                    setProcessData((cur) => ensureCount(cur, nextCount));
                  } else {
                    setProcessCountInput(String(processCount));
                  }
                }
              }}
              onProcessChange={(idx, next) => {
                setProcessData((cur) => {
                  const updated = ensureCount(cur, processCount).slice();
                  updated[idx] = { ...updated[idx], ...next };
                  return updated;
                });
              }}
              onAlgorithmChange={(a) => setAlgorithm(a)}
              onRun={runSimulation}
              onReset={resetAll}
              onLoadSample={() => {
                setProcessCount(3);
                setProcessCountInput("3");
                setProcessData(defaultSample);
                setFieldErrors({});
                setApiError(null);
                setResult(null);
              }}
            />
            {apiError ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 break-words">
                {apiError}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {result ? (
        <div className="fixed inset-0 z-50 flex flex-col min-h-0">
          <div
            className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
            onClick={() => setResult(null)}
          />
          <div className="relative flex-1 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y">
            <div className="min-h-full px-3 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-4 sm:py-8 flex items-start justify-center">
              <div className="w-full max-w-6xl min-w-0">
                <div className="flex items-center justify-end mb-2 sm:mb-3 sticky top-0 z-10 -mx-1 px-1 py-2 sm:static sm:mx-0 sm:px-0 sm:py-0 bg-[color:var(--background)]/90 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none rounded-b-xl sm:rounded-none">
                  <button
                    type="button"
                    onClick={() => setResult(null)}
                    className="rounded-xl border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-extrabold text-[color:var(--primary)] hover:border-[color:var(--primary)] transition shadow-sm"
                  >
                    Close
                  </button>
                </div>
                <ResultPanel
                  algorithm={algorithm}
                  onAlgorithmChange={(a) => {
                    setAlgorithm(a);
                    void runSimulation(a);
                  }}
                  isRunning={isRunning}
                  data={result}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
