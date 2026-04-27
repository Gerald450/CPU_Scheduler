import type { GanttSegment, ProcessInput, ProcessMetrics, SimulationResult } from "@/lib/types";
import { round2 } from "@/lib/utils/format";

export const IDLE_PROCESS_ID = "IDLE";

export function normalizeInputs(processData: ProcessInput[]): ProcessInput[] {
  return processData.map((p) => ({
    processId: String(p.processId).trim(),
    arrivalTime: Number(p.arrivalTime),
    burstTime: Number(p.burstTime),
  }));
}

export function buildExecutionOrder(segments: GanttSegment[]): string[] {
  const order: string[] = [];
  for (const s of segments) {
    if (s.processId === IDLE_PROCESS_ID) continue;
    if (order.length === 0 || order[order.length - 1] !== s.processId) order.push(s.processId);
  }
  return order;
}

export function compressSegments(raw: GanttSegment[]): GanttSegment[] {
  const segments: GanttSegment[] = [];
  for (const seg of raw) {
    if (seg.end <= seg.start) continue;
    const last = segments[segments.length - 1];
    if (last && last.processId === seg.processId && last.end === seg.start) {
      last.end = seg.end;
    } else {
      segments.push({ ...seg });
    }
  }
  return segments;
}

export function computeMetricsFromSegments(
  algorithm: SimulationResult["algorithm"],
  processData: ProcessInput[],
  segments: GanttSegment[],
): SimulationResult {
  const completionTime = new Map<string, number>();
  const firstStart = new Map<string, number>();

  for (const s of segments) {
    if (s.processId === IDLE_PROCESS_ID) continue;
    completionTime.set(s.processId, s.end);
    if (!firstStart.has(s.processId)) firstStart.set(s.processId, s.start);
  }

  const metrics: ProcessMetrics[] = processData.map((p) => {
    const ct = completionTime.get(p.processId) ?? p.arrivalTime;
    const fst = firstStart.get(p.processId) ?? p.arrivalTime;
    const tat = ct - p.arrivalTime;
    const wt = tat - p.burstTime;
    const rt = fst - p.arrivalTime;
    return {
      processId: p.processId,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      completionTime: ct,
      waitingTime: wt,
      turnaroundTime: tat,
      responseTime: rt,
    };
  });

  const n = Math.max(1, metrics.length);
  const avgWT = metrics.reduce((s, m) => s + m.waitingTime, 0) / n;
  const avgTAT = metrics.reduce((s, m) => s + m.turnaroundTime, 0) / n;
  const avgRT = metrics.reduce((s, m) => s + m.responseTime, 0) / n;

  const ganttChartSegments = compressSegments(segments);
  const startTime = Math.min(...processData.map((p) => p.arrivalTime));
  const endTime = getLastEnd(ganttChartSegments);
  const totalTime = Math.max(1, endTime - startTime);
  const throughput = n / totalTime;

  return {
    algorithm,
    metrics: metrics.sort((a, b) => a.processId.localeCompare(b.processId)),
    ganttChartSegments,
    executionOrder: buildExecutionOrder(ganttChartSegments),
    averages: {
      averageWaitingTime: round2(avgWT),
      averageTurnaroundTime: round2(avgTAT),
      averageResponseTime: round2(avgRT),
      throughput: round2(throughput),
    },
  };
}

export function tieBreakProcess(a: ProcessInput, b: ProcessInput): number {
  if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
  return a.processId.localeCompare(b.processId);
}

export function getLastEnd(segments: GanttSegment[]): number {
  return segments.length ? segments[segments.length - 1].end : 0;
}

export function pushSegment(segments: GanttSegment[], processId: string, start: number, end: number) {
  if (end <= start) return;
  const last = segments[segments.length - 1];
  if (last && last.processId === processId && last.end === start) {
    last.end = end;
  } else {
    segments.push({ processId, start, end });
  }
}

