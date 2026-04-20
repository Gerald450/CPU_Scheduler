import type { ProcessMetrics } from "@/lib/types";

export function MetricsTable({ metrics }: { metrics: ProcessMetrics[] }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[color:var(--border)]">
        <h3 className="text-sm font-bold text-[color:var(--primary)]">Metrics Table</h3>
        <p className="text-xs text-[color:var(--muted)] mt-1">
          Completion Time (CT), Waiting Time (WT), Turnaround Time (TAT), Response Time (RT)
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[860px] w-full text-sm">
          <thead className="bg-[color:color-mix(in_oklab,var(--primary)_4%,white)]">
            <tr className="text-left text-xs font-bold text-[color:var(--primary)]">
              <th className="px-4 py-3">Process</th>
              <th className="px-4 py-3">AT</th>
              <th className="px-4 py-3">BT</th>
              <th className="px-4 py-3">CT</th>
              <th className="px-4 py-3">WT</th>
              <th className="px-4 py-3">TAT</th>
              <th className="px-4 py-3">RT</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.processId} className="border-t border-[color:var(--border)]">
                <td className="px-4 py-3 font-extrabold text-[color:var(--primary)]">{m.processId}</td>
                <td className="px-4 py-3 text-[color:var(--foreground)]">{m.arrivalTime}</td>
                <td className="px-4 py-3 text-[color:var(--foreground)]">{m.burstTime}</td>
                <td className="px-4 py-3 text-[color:var(--foreground)]">{m.completionTime}</td>
                <td className="px-4 py-3 text-[color:var(--foreground)]">{m.waitingTime}</td>
                <td className="px-4 py-3 text-[color:var(--foreground)]">{m.turnaroundTime}</td>
                <td className="px-4 py-3 text-[color:var(--foreground)]">{m.responseTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

