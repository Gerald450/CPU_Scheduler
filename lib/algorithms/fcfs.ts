import type { ProcessInput, SimulationResult } from "@/lib/types";
import {
  computeMetricsFromSegments,
  IDLE_PROCESS_ID,
  normalizeInputs,
  pushSegment,
  tieBreakProcess,
} from "@/lib/algorithms/_shared";

export function simulateFCFS(processData: ProcessInput[]): SimulationResult {
  const processes = normalizeInputs(processData).slice().sort(tieBreakProcess);
  const segments: { processId: string; start: number; end: number }[] = [];

  let t = 0;
  for (const p of processes) {
    if (t < p.arrivalTime) {
      pushSegment(segments, IDLE_PROCESS_ID, t, p.arrivalTime);
      t = p.arrivalTime;
    }
    const start = t;
    const end = t + p.burstTime;
    pushSegment(segments, p.processId, start, end);
    t = end;
  }

  return computeMetricsFromSegments("FCFS", processes, segments);
}

