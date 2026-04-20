import { NextResponse } from "next/server";
import type { SimulateResponseBody } from "@/lib/types";
import { validateSimulateRequestBody } from "@/lib/utils/validation";
import { simulateFCFS } from "@/lib/algorithms/fcfs";
import { simulateSJF } from "@/lib/algorithms/sjf";
import { simulateSRTF } from "@/lib/algorithms/srtf";
import { recommendAlgorithm } from "@/lib/algorithms/recommend";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body." },
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  const validated = validateSimulateRequestBody(body);
  if (!validated.ok || !validated.value) {
    return NextResponse.json(
      { message: "Validation failed.", errors: validated.errors },
      { status: 400 },
    );
  }

  const { processData, algorithm } = validated.value;

  if (algorithm === "RECOMMENDED") {
    const rec = recommendAlgorithm(processData);
    const response: SimulateResponseBody = {
      selectedAlgorithm: rec.selectedAlgorithm,
      recommendationReason: rec.reason,
      comparedAlgorithms: rec.comparedAlgorithms,
      result: rec.comparedAlgorithms[rec.selectedAlgorithm],
    };
    return NextResponse.json(response);
  }

  const result =
    algorithm === "FCFS"
      ? simulateFCFS(processData)
      : algorithm === "SJF"
        ? simulateSJF(processData)
        : simulateSRTF(processData);

  const response: SimulateResponseBody = {
    selectedAlgorithm: algorithm,
    recommendationReason: `${algorithm} was selected by the user.`,
    result,
  };
  return NextResponse.json(response);
}

