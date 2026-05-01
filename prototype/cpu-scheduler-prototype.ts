/**
 * CPU Scheduling Simulator — SDLC implementation-phase prototype
 *
 * This file is an early, simplified integration surface for the product: it wires
 * together validation, FCFS / SJF / SRTF simulations, and the “Recommended”
 * selector the same way `app/api/simulate/route.ts` does, without the HTTP layer.
 *
 * The full Next.js UI lives under `app/` and `components/`; use this module when
 * you need a single file that demonstrates core behavior for review or submission.
 */

import type { ApiAlgorithm, ProcessInput, SimulateResponseBody } from "@/lib/types";
import type { ValidationError } from "@/lib/utils/validation";
import { validateSimulateRequestBody } from "@/lib/utils/validation";
import { simulateFCFS } from "@/lib/algorithms/fcfs";
import { simulateSJF } from "@/lib/algorithms/sjf";
import { simulateSRTF } from "@/lib/algorithms/srtf";
import { recommendAlgorithm } from "@/lib/algorithms/recommend";

/** Default demo workload (matches the “Load sample” set in the web UI). */
export const PROTOTYPE_SAMPLE_PROCESSES: ProcessInput[] = [
  { processId: "P1", arrivalTime: 0, burstTime: 7 },
  { processId: "P2", arrivalTime: 2, burstTime: 4 },
  { processId: "P3", arrivalTime: 4, burstTime: 1 },
];

export type PrototypeRunSuccess = { ok: true; data: SimulateResponseBody };
export type PrototypeRunFailure = { ok: false; errors: ValidationError[] };

/**
 * Runs one scheduling scenario synchronously (prototype / offline use).
 * Behavior matches POST `/api/simulate` for valid inputs.
 */
export function runCpuSchedulerPrototype(
  processData: ProcessInput[],
  algorithm: ApiAlgorithm,
): PrototypeRunSuccess | PrototypeRunFailure {
  const validated = validateSimulateRequestBody({ processData, algorithm });
  if (!validated.ok || !validated.value) {
    return { ok: false, errors: validated.errors };
  }

  const { processData: rows, algorithm: algo } = validated.value;

  if (algo === "RECOMMENDED") {
    const rec = recommendAlgorithm(rows);
    const data: SimulateResponseBody = {
      selectedAlgorithm: rec.selectedAlgorithm,
      recommendationReason: rec.reason,
      comparedAlgorithms: rec.comparedAlgorithms,
      result: rec.comparedAlgorithms[rec.selectedAlgorithm],
    };
    return { ok: true, data };
  }

  const result =
    algo === "FCFS" ? simulateFCFS(rows) : algo === "SJF" ? simulateSJF(rows) : simulateSRTF(rows);

  const data: SimulateResponseBody = {
    selectedAlgorithm: algo,
    recommendationReason: `${algo} was selected by the user.`,
    result,
  };
  return { ok: true, data };
}

/** Compact text summary for logs, demos, or assignment screenshots. */
export function formatPrototypeSummary(body: SimulateResponseBody): string {
  const { selectedAlgorithm, recommendationReason, result } = body;
  const { averages, executionOrder } = result;
  const lines = [
    `Algorithm: ${selectedAlgorithm}`,
    `Reason: ${recommendationReason}`,
    `Execution order: ${executionOrder.join(" → ")}`,
    `Avg waiting: ${averages.averageWaitingTime.toFixed(2)} | Avg turnaround: ${averages.averageTurnaroundTime.toFixed(2)} | Avg response: ${averages.averageResponseTime.toFixed(2)}`,
    `Throughput: ${averages.throughput.toFixed(4)} processes / time unit`,
  ];
  return lines.join("\n");
}

/** Example end-to-end path using the sample processes and “Recommended”. */
export function runDefaultPrototypeDemo(): string {
  const out = runCpuSchedulerPrototype(PROTOTYPE_SAMPLE_PROCESSES, "RECOMMENDED");
  if (!out.ok) return `Validation failed: ${JSON.stringify(out.errors)}`;
  return formatPrototypeSummary(out.data);
}
