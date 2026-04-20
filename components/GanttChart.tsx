import type { GanttSegment } from "@/lib/types";
import { IDLE_PROCESS_ID } from "@/lib/algorithms/_shared";

const palette = [
  "#032A64",
  "#36E9FD",
  "#0EA5E9",
  "#6366F1",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#14B8A6",
];

function colorForProcess(processId: string) {
  if (processId === IDLE_PROCESS_ID) return "rgba(3,42,100,0.10)";
  let hash = 0;
  for (let i = 0; i < processId.length; i++) hash = (hash * 31 + processId.charCodeAt(i)) >>> 0;
  return palette[hash % palette.length];
}

export function GanttChart({
  segments,
}: {
  segments: GanttSegment[];
}) {
  const endTime = segments.length ? Math.max(...segments.map((s) => s.end)) : 0;
  const total = Math.max(1, endTime);

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[color:var(--border)]">
        <h3 className="text-sm font-bold text-[color:var(--primary)]">Gantt Chart</h3>
        <p className="text-xs text-[color:var(--muted)] mt-1">
          Visual execution timeline (supports SRTF preemption)
        </p>
      </div>

      <div className="p-5">
        {segments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--primary)_2%,white)] p-6 text-sm text-[color:var(--muted)]">
            Run a simulation to generate the Gantt chart.
          </div>
        ) : (
          <div className="grid gap-3">
            <div className="relative w-full overflow-x-auto">
              <div className="min-w-[720px]">
                <div className="flex h-14 rounded-xl overflow-hidden border border-[color:var(--border)] bg-white">
                  {segments.map((s, idx) => {
                    const width = ((s.end - s.start) / total) * 100;
                    const bg = colorForProcess(s.processId);
                    const isIdle = s.processId === IDLE_PROCESS_ID;
                    return (
                      <div
                        key={`${s.processId}-${s.start}-${s.end}-${idx}`}
                        className={[
                          "h-full flex items-center justify-center border-r last:border-r-0",
                          isIdle ? "border-[color:rgba(3,42,100,0.10)]" : "border-[color:rgba(255,255,255,0.55)]",
                        ].join(" ")}
                        style={{
                          width: `${width}%`,
                          background: bg,
                        }}
                        title={`${s.processId} (${s.start} → ${s.end})`}
                      >
                        <span
                          className={[
                            "px-2 text-xs font-extrabold tracking-wide",
                            isIdle ? "text-[color:var(--muted)]" : "text-white",
                          ].join(" ")}
                        >
                          {isIdle ? "IDLE" : s.processId}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-2 flex justify-between text-[11px] font-bold text-[color:var(--muted)]">
                  <span>0</span>
                  <span>{Math.floor(total / 4)}</span>
                  <span>{Math.floor(total / 2)}</span>
                  <span>{Math.floor((3 * total) / 4)}</span>
                  <span>{total}</span>
                </div>

                <div className="mt-1 flex justify-between text-[11px] text-[color:var(--muted)]">
                  <span>Time</span>
                  <span>units</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--primary)_2%,white)] px-4 py-3 text-xs text-[color:var(--muted)]">
              <span className="font-bold text-[color:var(--primary)]">Execution order:</span>{" "}
              {segments
                .filter((s) => s.processId !== IDLE_PROCESS_ID)
                .map((s) => s.processId)
                .filter((pid, i, arr) => i === 0 || arr[i - 1] !== pid)
                .join(" → ")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

