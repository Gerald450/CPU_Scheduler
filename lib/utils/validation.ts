import type { ProcessInput, SimulateRequestBody } from "@/lib/types";

export type ValidationError = {
  path: string;
  message: string;
};

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function validateProcessInputs(processData: ProcessInput[]): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!Array.isArray(processData) || processData.length === 0) {
    return [{ path: "processData", message: "Please provide at least one process." }];
  }

  processData.forEach((p, idx) => {
    const base = `processData[${idx}]`;

    if (!p || typeof p !== "object") {
      errors.push({ path: base, message: "Invalid process row." });
      return;
    }

    if (typeof p.processId !== "string" || p.processId.trim().length === 0) {
      errors.push({ path: `${base}.processId`, message: "Process ID is required." });
    }

    if (!isFiniteNumber(p.arrivalTime) || Number.isNaN(p.arrivalTime)) {
      errors.push({ path: `${base}.arrivalTime`, message: "Arrival time must be a valid number." });
    } else if (p.arrivalTime < 0) {
      errors.push({ path: `${base}.arrivalTime`, message: "Arrival time must be 0 or greater." });
    }

    if (!isFiniteNumber(p.burstTime) || Number.isNaN(p.burstTime)) {
      errors.push({ path: `${base}.burstTime`, message: "Burst time must be a valid number." });
    } else if (p.burstTime <= 0) {
      errors.push({ path: `${base}.burstTime`, message: "Burst time must be greater than 0." });
    }
  });

  // Basic uniqueness check helps avoid confusing tables/labels.
  const seen = new Set<string>();
  processData.forEach((p, idx) => {
    const id = typeof p?.processId === "string" ? p.processId.trim() : "";
    if (!id) return;
    if (seen.has(id)) {
      errors.push({
        path: `processData[${idx}].processId`,
        message: "Process ID must be unique.",
      });
    }
    seen.add(id);
  });

  return errors;
}

export function validateSimulateRequestBody(body: unknown): {
  ok: boolean;
  errors: ValidationError[];
  value?: SimulateRequestBody;
} {
  if (!body || typeof body !== "object") {
    return { ok: false, errors: [{ path: "body", message: "Invalid request body." }] };
  }

  const b = body as Partial<SimulateRequestBody>;
  const errors: ValidationError[] = [];

  const algo = b.algorithm;
  if (algo !== "FCFS" && algo !== "SJF" && algo !== "SRTF" && algo !== "RECOMMENDED") {
    errors.push({
      path: "algorithm",
      message: "Algorithm must be FCFS, SJF, SRTF, or RECOMMENDED.",
    });
  }

  const processData = Array.isArray(b.processData) ? (b.processData as ProcessInput[]) : [];
  errors.push(...validateProcessInputs(processData));

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, errors: [], value: { processData, algorithm: algo! } };
}

