import type { ApiAlgorithm } from "@/lib/types";

const options: { value: ApiAlgorithm; label: string; hint: string }[] = [
  { value: "RECOMMENDED", label: "Recommended", hint: "Auto-chooses best algorithm for this dataset" },
  { value: "FCFS", label: "FCFS", hint: "First Come First Serve (Non-Preemptive)" },
  { value: "SJF", label: "SJF", hint: "Shortest Job First (Non-Preemptive)" },
  { value: "SRTF", label: "SRTF", hint: "Shortest Remaining Time First (Preemptive)" },
];

export function AlgorithmSelector({
  value,
  onChange,
  label = "Algorithm Selection",
  variant = "cards",
}: {
  value: ApiAlgorithm;
  onChange: (next: ApiAlgorithm) => void;
  label?: string;
  variant?: "cards" | "select";
}) {
  if (variant === "select") {
    return (
      <div className="rounded-2xl border border-[color:var(--border)] bg-white px-3 py-3 sm:px-4 shadow-sm min-w-0">
        <div className="grid gap-2">
          <label className="text-xs font-bold text-[color:var(--primary)]">{label}</label>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value as ApiAlgorithm)}
            className="w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm font-semibold text-[color:var(--primary)] outline-none transition focus:ring-2 focus:ring-[color:color-mix(in_oklab,var(--accent)_50%,transparent)] focus:border-[color:var(--primary)]"
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <div className="text-[11px] text-[color:var(--muted)]">
            {options.find((o) => o.value === value)?.hint}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white shadow-sm min-w-0">
      <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-[color:var(--border)]">
        <h3 className="text-sm font-bold text-[color:var(--primary)]">{label}</h3>
      </div>
      <div className="p-4 sm:p-5 grid gap-3 min-w-0">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={[
                "text-left rounded-xl border px-3 py-3 sm:px-4 transition min-w-0",
                selected
                  ? "border-[color:var(--primary)] bg-[color:color-mix(in_oklab,var(--accent)_18%,white)] ring-2 ring-[color:color-mix(in_oklab,var(--accent)_55%,transparent)] ring-offset-0 sm:ring-offset-2 sm:ring-offset-white"
                  : "border-[color:var(--border)] bg-white hover:border-[color:color-mix(in_oklab,var(--primary)_45%,transparent)]",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-2 sm:gap-3 min-w-0">
                <div className="min-w-0">
                  <div className="text-sm font-extrabold tracking-wide text-[color:var(--primary)] break-words">
                    {opt.label}
                  </div>
                  <div className="text-xs text-[color:var(--muted)] mt-0.5 break-words">{opt.hint}</div>
                </div>
                <div
                  className={[
                    "h-5 w-5 rounded-full border flex items-center justify-center",
                    selected ? "border-[color:var(--primary)]" : "border-[color:var(--border)]",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "h-2.5 w-2.5 rounded-full transition",
                      selected ? "bg-[color:var(--primary)]" : "bg-transparent",
                    ].join(" ")}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

