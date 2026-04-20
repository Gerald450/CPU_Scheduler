import { formatNumber } from "@/lib/utils/format";

export function SummaryCards({
  averages,
}: {
  averages: {
    averageWaitingTime: number;
    averageTurnaroundTime: number;
    averageResponseTime: number;
  };
}) {
  const items = [
    { label: "Average WT", value: formatNumber(averages.averageWaitingTime) },
    { label: "Average TAT", value: formatNumber(averages.averageTurnaroundTime) },
    { label: "Average RT", value: formatNumber(averages.averageResponseTime) },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-2xl border border-[color:var(--border)] bg-white shadow-sm px-5 py-4"
        >
          <div className="text-xs font-bold text-[color:var(--muted)]">{it.label}</div>
          <div className="mt-2 text-2xl font-extrabold tracking-tight text-[color:var(--primary)]">
            {it.value}
          </div>
        </div>
      ))}
    </div>
  );
}

