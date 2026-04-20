import type { ApiAlgorithm, ProcessInput } from "@/lib/types";
import { AlgorithmSelector } from "@/components/AlgorithmSelector";

type FieldErrors = Record<string, string>;

function inputClass(hasError: boolean) {
  return [
    "w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none transition",
    hasError
      ? "border-red-300 ring-2 ring-red-100"
      : "border-[color:var(--border)] focus:ring-2 focus:ring-[color:color-mix(in_oklab,var(--accent)_50%,transparent)] focus:border-[color:var(--primary)]",
  ].join(" ");
}

export function ProcessInputForm({
  processCountInput,
  processData,
  algorithm,
  fieldErrors,
  isRunning,
  onProcessCountInputChange,
  onProcessCountInputBlur,
  onProcessChange,
  onAlgorithmChange,
  onRun,
  onReset,
  onLoadSample,
}: {
  processCountInput: string;
  processData: ProcessInput[];
  algorithm: ApiAlgorithm;
  fieldErrors: FieldErrors;
  isRunning: boolean;
  onProcessCountInputChange: (value: string) => void;
  onProcessCountInputBlur: () => void;
  onProcessChange: (idx: number, next: Partial<ProcessInput>) => void;
  onAlgorithmChange: (a: ApiAlgorithm) => void;
  onRun: () => void;
  onReset: () => void;
  onLoadSample: () => void;
}) {
  return (
    <div className="grid gap-5">
      <div className="rounded-2xl border border-[color:var(--border)] bg-white shadow-sm">
        <div className="px-5 py-4 border-b border-[color:var(--border)]">
          <h2 className="text-base font-extrabold tracking-tight text-[color:var(--primary)]">
            How many processes do you have?
          </h2>
          <p className="text-xs text-[color:var(--muted)] mt-1">
            Adjust the count to generate rows. Inputs are preserved when switching algorithms.
          </p>
        </div>
        <div className="p-5 grid gap-4">
          <div>
            <label className="text-xs font-bold text-[color:var(--primary)]">Number of Processes</label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={20}
                value={processCountInput}
                onChange={(e) => onProcessCountInputChange(e.target.value)}
                onBlur={onProcessCountInputBlur}
                className={inputClass(Boolean(fieldErrors["processCount"]))}
              />
              <button
                type="button"
                onClick={onLoadSample}
                className="shrink-0 rounded-xl border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-bold text-[color:var(--primary)] hover:border-[color:var(--primary)] transition"
              >
                Load Sample
              </button>
            </div>
            {fieldErrors["processCount"] ? (
              <p className="mt-2 text-xs font-semibold text-red-600">{fieldErrors["processCount"]}</p>
            ) : null}
          </div>

          <div className="rounded-xl border border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--primary)_2%,white)]">
            <div className="px-4 py-3 border-b border-[color:var(--border)]">
              <h3 className="text-sm font-bold text-[color:var(--primary)]">
                Input arrival/burst times for each process
              </h3>
            </div>

            <div className="p-4">
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="grid gap-3 min-w-0 sm:min-w-[520px]">
                <div className="hidden sm:grid grid-cols-12 gap-3 text-xs font-bold text-[color:var(--muted)]">
                  <div className="col-span-4">Process ID</div>
                  <div className="col-span-4">Arrival Time</div>
                  <div className="col-span-4">Burst Time</div>
                </div>

                {processData.map((p, idx) => {
                  const idErr = fieldErrors[`processData[${idx}].processId`];
                  const atErr = fieldErrors[`processData[${idx}].arrivalTime`];
                  const btErr = fieldErrors[`processData[${idx}].burstTime`];
                  return (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                      <div className="sm:col-span-4">
                        <div className="sm:hidden text-xs font-bold text-[color:var(--muted)] mb-1">Process ID</div>
                        <input
                          value={p.processId}
                          onChange={(e) => onProcessChange(idx, { processId: e.target.value })}
                          placeholder={`P${idx + 1}`}
                          className={inputClass(Boolean(idErr))}
                        />
                        {idErr ? <p className="mt-1 text-[11px] font-semibold text-red-600">{idErr}</p> : null}
                      </div>
                      <div className="sm:col-span-4">
                        <div className="sm:hidden text-xs font-bold text-[color:var(--muted)] mb-1">Arrival Time</div>
                        <input
                          type="number"
                          min={0}
                          value={Number.isFinite(p.arrivalTime) ? p.arrivalTime : ""}
                          onChange={(e) =>
                            onProcessChange(idx, {
                              arrivalTime: e.target.value === "" ? Number.NaN : Number(e.target.value),
                            })
                          }
                          className={inputClass(Boolean(atErr))}
                        />
                        {atErr ? <p className="mt-1 text-[11px] font-semibold text-red-600">{atErr}</p> : null}
                      </div>
                      <div className="sm:col-span-4">
                        <div className="sm:hidden text-xs font-bold text-[color:var(--muted)] mb-1">Burst Time</div>
                        <input
                          type="number"
                          min={1}
                          value={Number.isFinite(p.burstTime) ? p.burstTime : ""}
                          onChange={(e) =>
                            onProcessChange(idx, {
                              burstTime: e.target.value === "" ? Number.NaN : Number(e.target.value),
                            })
                          }
                          className={inputClass(Boolean(btErr))}
                        />
                        {btErr ? <p className="mt-1 text-[11px] font-semibold text-red-600">{btErr}</p> : null}
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onRun}
              disabled={isRunning}
              className="flex-1 rounded-xl bg-[color:var(--primary)] px-4 py-3 text-sm font-extrabold text-white shadow-sm hover:opacity-95 disabled:opacity-60 transition"
            >
              {isRunning ? "Running..." : "Run Simulation"}
            </button>
            <button
              type="button"
              onClick={onReset}
              className="rounded-xl border border-[color:var(--border)] bg-white px-4 py-3 text-sm font-extrabold text-[color:var(--primary)] hover:border-[color:var(--primary)] transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <AlgorithmSelector value={algorithm} onChange={onAlgorithmChange} />
    </div>
  );
}

