import { formatNumber } from "@/lib/utils/format";

export function SummaryCards({
  averages,
}: {
  averages: {
    averageWaitingTime: number;
    averageTurnaroundTime: number;
    averageResponseTime: number;
    throughput: number;
  };
}) {
  const items = [
    { label: "Average WT", value: formatNumber(averages.averageWaitingTime) },
    { label: "Average TAT", value: formatNumber(averages.averageTurnaroundTime) },
    { label: "Average RT", value: formatNumber(averages.averageResponseTime) },
    { label: "Throughput", value: formatNumber(averages.throughput) },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0">
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-2xl border border-[color:var(--border)] bg-white shadow-sm px-4 py-3 sm:px-5 sm:py-4 min-w-0"
        >
          <div className="text-xs font-bold text-[color:var(--muted)]">{it.label}</div>
          <div className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-[color:var(--primary)] tabular-nums break-all sm:break-normal">
            {it.value}
          </div>
        </div>
      ))}
    </div>
  );
}

