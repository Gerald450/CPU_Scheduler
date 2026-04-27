import type { ApiAlgorithm, ComparedAlgorithms, SimulateResponseBody } from "@/lib/types";
import { AlgorithmSelector } from "@/components/AlgorithmSelector";
import { RecommendationCard } from "@/components/RecommendationCard";
import { MetricsTable } from "@/components/MetricsTable";
import { SummaryCards } from "@/components/SummaryCards";
import { GanttChart } from "@/components/GanttChart";

export function ResultPanel({
  algorithm,
  onAlgorithmChange,
  isRunning,
  data,
}: {
  algorithm: ApiAlgorithm;
  onAlgorithmChange: (a: ApiAlgorithm) => void;
  isRunning: boolean;
  data: SimulateResponseBody | null;
}) {
  const selectedAlgo = data?.selectedAlgorithm ?? null;
  const result = data?.result ?? null;

  return (
    <div className="grid gap-4 sm:gap-5 min-w-0">
      <div className="rounded-2xl border border-[color:var(--border)] bg-white shadow-sm min-w-0">
        <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-[color:var(--border)]">
          <div className="text-xs sm:text-sm font-bold text-[color:var(--muted)]">Recommended/Selected Process:</div>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[color:var(--primary)] break-words">
                {selectedAlgo ?? "—"}
              </div>
              <div className="mt-1 text-xs font-semibold text-[color:var(--muted)]">
                {isRunning ? "Running simulation..." : "Results update when you run the simulation."}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 grid gap-4 sm:gap-5 min-w-0">
          <div className="grid grid-cols-1 gap-4 sm:gap-5 min-w-0">
            <RecommendationCard reason={data?.recommendationReason ?? "Run a simulation to see the recommendation."} />
          </div>

          {result ? (
            <>
              <SummaryCards averages={result.averages} />

              {data?.comparedAlgorithms ? (
                <div className="rounded-2xl border border-[color:var(--border)] bg-white shadow-sm px-4 py-3 sm:px-5 sm:py-4 min-w-0">
                  <div className="text-sm font-bold text-[color:var(--primary)]">Comparison Sentence</div>
                  <div className="mt-2 text-sm font-semibold text-[color:var(--primary)] break-words">
                    {(() => {
                      const others = (["FCFS", "SJF", "SRTF"] as const).filter((x) => x !== data.selectedAlgorithm);
                      return `Compared with ${others[0]} and ${others[1]}, ${data.selectedAlgorithm} produced the best overall averages for this dataset.`;
                    })()}
                  </div>
                </div>
              ) : null}

              <MetricsTable metrics={result.metrics} />
              <GanttChart segments={result.ganttChartSegments} />

              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--primary)_2%,white)] px-4 py-3 sm:px-5 sm:py-4 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 min-w-0">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[color:var(--muted)]">Change Algorithm</div>
                    <div className="text-sm font-extrabold text-[color:var(--primary)] break-words">
                      Change the algorithm without re-entering process data.
                    </div>
                  </div>
                  <div className="w-full min-w-0 sm:max-w-[340px] sm:shrink-0">
                    <AlgorithmSelector
                      value={algorithm}
                      onChange={onAlgorithmChange}
                      label="Algorithm"
                      variant="select"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--primary)_2%,white)] p-5 sm:p-8">
              <div className="text-sm font-extrabold text-[color:var(--primary)]">
                Results Dashboard
              </div>
              <p className="mt-2 text-sm text-[color:var(--muted)] leading-6 break-words">
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

