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

function ensureCount(list: ProcessInput[], count: number): ProcessInput[] {
  const n = Math.max(1, Math.min(20, Math.floor(count || 1)));
  const next = list.slice(0, n);
  while (next.length < n) {
    const idx = next.length + 1;
    next.push({ processId: `P${idx}`, arrivalTime: 0, burstTime: 1 });
  }
  return next;
}

type FieldErrors = Record<string, string>;

export default function Home() {
  const [processCount, setProcessCount] = useState<number>(3);
  const [processData, setProcessData] = useState<ProcessInput[]>(defaultSample);
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
    if (!Number.isFinite(processCount) || processCount < 1) {
      errors.processCount = "Number of processes must be at least 1.";
    }

    const v = validateProcessInputs(safeProcessData);
    for (const e of v) errors[e.path] = e.message;

    if (Object.keys(errors).length) return { ok: false, errors };
    return { ok: true };
  }

  async function runSimulation() {
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
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ processData: safeProcessData, algorithm }),
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
    } catch {
      setApiError("Network error. Please try again.");
      setResult(null);
    } finally {
      setIsRunning(false);
    }
  }

  function resetAll() {
    setProcessCount(3);
    setProcessData(defaultSample);
    setAlgorithm("RECOMMENDED");
    setFieldErrors({});
    setApiError(null);
    setResult(null);
    setIsRunning(false);
  }

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-6 py-10">
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <ProcessInputForm
              processCount={processCount}
              processData={safeProcessData}
              algorithm={algorithm}
              fieldErrors={fieldErrors}
              isRunning={isRunning}
              onProcessCountChange={(n) => {
                const nextCount = Math.max(1, Math.min(20, Math.floor(Number(n) || 1)));
                setProcessCount(nextCount);
                setProcessData((cur) => ensureCount(cur, nextCount));
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
                setProcessData(defaultSample);
                setFieldErrors({});
                setApiError(null);
                setResult(null);
              }}
            />
            {apiError ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {apiError}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {result ? (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
            onClick={() => setResult(null)}
          />
          <div className="absolute inset-0 overflow-y-auto">
            <div className="min-h-full px-4 py-10 flex items-start justify-center">
              <div className="w-full max-w-6xl">
                <div className="flex items-center justify-end mb-3">
                  <button
                    type="button"
                    onClick={() => setResult(null)}
                    className="rounded-xl border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-extrabold text-[color:var(--primary)] hover:border-[color:var(--primary)] transition"
                  >
                    Close
                  </button>
                </div>
                <ResultPanel
                  algorithm={algorithm}
                  onAlgorithmChange={(a) => setAlgorithm(a)}
                  onReset={resetAll}
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
