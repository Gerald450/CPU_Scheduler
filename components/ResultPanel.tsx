import type { ApiAlgorithm, ComparedAlgorithms, SimulateResponseBody } from "@/lib/types";
import { AlgorithmSelector } from "@/components/AlgorithmSelector";
import { RecommendationCard } from "@/components/RecommendationCard";
import { AlgorithmRatings } from "@/components/AlgorithmRatings";
import { MetricsTable } from "@/components/MetricsTable";
import { SummaryCards } from "@/components/SummaryCards";
import { GanttChart } from "@/components/GanttChart";
import { PowerBIDashboard } from "@/components/PowerBIDashboard";

const fallbackRatings: Record<"FCFS" | "SJF" | "SRTF", "Fair" | "Very Good" | "Excellent"> = {
  FCFS: "Fair",
  SJF: "Very Good",
  SRTF: "Excellent",
};

function deriveRatings(compared?: ComparedAlgorithms) {
  if (!compared) return fallbackRatings;
  const keys: ("FCFS" | "SJF" | "SRTF")[] = ["FCFS", "SJF", "SRTF"];
  const ranked = keys
    .slice()
    .sort(
      (a, b) =>
        compared[a].averages.averageWaitingTime - compared[b].averages.averageWaitingTime ||
        compared[a].averages.averageTurnaroundTime - compared[b].averages.averageTurnaroundTime ||
        compared[a].averages.averageResponseTime - compared[b].averages.averageResponseTime,
    );
  return {
    [ranked[0]]: "Excellent",
    [ranked[1]]: "Very Good",
    [ranked[2]]: "Fair",
  } as typeof fallbackRatings;
}

export function ResultPanel({
  algorithm,
  onAlgorithmChange,
  onReset,
  isRunning,
  data,
}: {
  algorithm: ApiAlgorithm;
  onAlgorithmChange: (a: ApiAlgorithm) => void;
  onReset: () => void;
  isRunning: boolean;
  data: SimulateResponseBody | null;
}) {
  const selectedAlgo = data?.selectedAlgorithm ?? null;
  const result = data?.result ?? null;
  const ratings = deriveRatings(data?.comparedAlgorithms);

  return (
    <div className="grid gap-5">
      <div className="rounded-2xl border border-[color:var(--border)] bg-white shadow-sm">
        <div className="px-6 py-5 border-b border-[color:var(--border)]">
          <div className="text-sm font-bold text-[color:var(--muted)]">Recommended/Selected Process:</div>
          <div className="mt-2 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="text-4xl font-extrabold tracking-tight text-[color:var(--primary)]">
                {selectedAlgo ?? "—"}
              </div>
              <div className="mt-1 text-xs font-semibold text-[color:var(--muted)]">
                {isRunning ? "Running simulation..." : "Results update when you run the simulation."}
              </div>
            </div>
            <button
              type="button"
              onClick={onReset}
              className="rounded-xl border border-[color:var(--border)] bg-white px-4 py-2.5 text-sm font-extrabold text-[color:var(--primary)] hover:border-[color:var(--primary)] transition"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="p-6 grid gap-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <RecommendationCard reason={data?.recommendationReason ?? "Run a simulation to see the recommendation."} />
            <AlgorithmRatings ratings={ratings} />
          </div>

          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--primary)_2%,white)] px-5 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-[color:var(--muted)]">Change Algorithm Control</div>
                <div className="text-sm font-extrabold text-[color:var(--primary)]">
                  Change the algorithm without re-entering process data.
                </div>
              </div>
              <div className="w-full sm:w-[340px] shrink-0">
                <AlgorithmSelector
                  value={algorithm}
                  onChange={onAlgorithmChange}
                  label="Algorithm"
                  variant="select"
                />
              </div>
            </div>
          </div>

          {result ? (
            <>
              <SummaryCards averages={result.averages} />

              {data?.comparedAlgorithms ? (
                <div className="rounded-2xl border border-[color:var(--border)] bg-white shadow-sm px-5 py-4">
                  <div className="text-sm font-bold text-[color:var(--primary)]">Comparison Sentence</div>
                  <div className="mt-2 text-sm font-semibold text-[color:var(--primary)]">
                    {(() => {
                      const others = (["FCFS", "SJF", "SRTF"] as const).filter((x) => x !== data.selectedAlgorithm);
                      return `Compared with ${others[0]} and ${others[1]}, ${data.selectedAlgorithm} produced the best overall averages for this dataset.`;
                    })()}
                  </div>
                </div>
              ) : null}

              <MetricsTable metrics={result.metrics} />
              <GanttChart segments={result.ganttChartSegments} />
              <PowerBIDashboard />
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--primary)_2%,white)] p-8">
              <div className="text-sm font-extrabold text-[color:var(--primary)]">
                Results Dashboard
              </div>
              <p className="mt-2 text-sm text-[color:var(--muted)] leading-6">
                Enter process data on the left, choose an algorithm, then click <span className="font-bold">Run Simulation</span>.
                You’ll see execution order, a Gantt chart, per-process metrics, averages, a recommendation, and an algorithm comparison summary.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

