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
      <div className="rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 shadow-sm">
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
    <div className="rounded-2xl border border-[color:var(--border)] bg-white shadow-sm">
      <div className="px-5 py-4 border-b border-[color:var(--border)]">
        <h3 className="text-sm font-bold text-[color:var(--primary)]">{label}</h3>
      </div>
      <div className="p-5 grid gap-3">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={[
                "text-left rounded-xl border px-4 py-3 transition",
                selected
                  ? "border-[color:var(--primary)] bg-[color:color-mix(in_oklab,var(--accent)_18%,white)] ring-2 ring-[color:color-mix(in_oklab,var(--accent)_55%,transparent)] ring-offset-2 ring-offset-white"
                  : "border-[color:var(--border)] bg-white hover:border-[color:color-mix(in_oklab,var(--primary)_45%,transparent)]",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-extrabold tracking-wide text-[color:var(--primary)]">
                    {opt.label}
                  </div>
                  <div className="text-xs text-[color:var(--muted)] mt-0.5">{opt.hint}</div>
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

