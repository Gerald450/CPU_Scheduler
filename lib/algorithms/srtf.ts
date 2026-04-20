import type { GanttSegment, ProcessInput, SimulationResult } from "@/lib/types";
import {
  computeMetricsFromSegments,
  IDLE_PROCESS_ID,
  normalizeInputs,
  pushSegment,
  tieBreakProcess,
} from "@/lib/algorithms/_shared";

type RuntimeProc = ProcessInput & {
  remaining: number;
};

export function simulateSRTF(processData: ProcessInput[]): SimulationResult {
  const processes = normalizeInputs(processData).slice().sort(tieBreakProcess);
  const runtime: RuntimeProc[] = processes.map((p) => ({ ...p, remaining: p.burstTime }));

  const segments: GanttSegment[] = [];
  const done = new Set<string>();

  let t = Math.min(...runtime.map((p) => p.arrivalTime));
  if (!Number.isFinite(t)) t = 0;

  while (done.size < runtime.length) {
    const available = runtime
      .filter((p) => !done.has(p.processId) && p.arrivalTime <= t && p.remaining > 0)
      .sort((a, b) => {
        if (a.remaining !== b.remaining) return a.remaining - b.remaining;
        return tieBreakProcess(a, b);
      });

    if (available.length === 0) {
      const futureArrivals = runtime
        .filter((p) => !done.has(p.processId) && p.remaining > 0 && p.arrivalTime > t)
        .map((p) => p.arrivalTime);
      const nextArrival = futureArrivals.length ? Math.min(...futureArrivals) : t + 1;
      pushSegment(segments, IDLE_PROCESS_ID, t, nextArrival);
      t = nextArrival;
      continue;
    }

    const current = available[0];
    // Execute 1 time unit.
    pushSegment(segments, current.processId, t, t + 1);
    current.remaining -= 1;
    t += 1;

    if (current.remaining <= 0) done.add(current.processId);
  }

  return computeMetricsFromSegments("SRTF", processes, segments);
}

