import type { ProcessInput, SimulationResult } from "@/lib/types";
import {
  computeMetricsFromSegments,
  IDLE_PROCESS_ID,
  normalizeInputs,
  pushSegment,
  tieBreakProcess,
} from "@/lib/algorithms/_shared";

export function simulateSJF(processData: ProcessInput[]): SimulationResult {
  const processes = normalizeInputs(processData).slice().sort(tieBreakProcess);
  const remaining = new Set(processes.map((p) => p.processId));
  const byId = new Map(processes.map((p) => [p.processId, p]));

  const segments: { processId: string; start: number; end: number }[] = [];

  let t = 0;
  while (remaining.size > 0) {
    const available = processes
      .filter((p) => remaining.has(p.processId) && p.arrivalTime <= t)
      .sort((a, b) => {
        if (a.burstTime !== b.burstTime) return a.burstTime - b.burstTime;
        return tieBreakProcess(a, b);
      });

    if (available.length === 0) {
      // Jump to next arrival
      const nextArrival = Math.min(
        ...processes.filter((p) => remaining.has(p.processId)).map((p) => p.arrivalTime),
      );
      pushSegment(segments, IDLE_PROCESS_ID, t, nextArrival);
      t = nextArrival;
      continue;
    }

    const chosen = available[0];
    const p = byId.get(chosen.processId)!;
    const start = t;
    const end = t + p.burstTime;
    pushSegment(segments, p.processId, start, end);
    t = end;
    remaining.delete(p.processId);
  }

  return computeMetricsFromSegments("SJF", processes, segments);
}

