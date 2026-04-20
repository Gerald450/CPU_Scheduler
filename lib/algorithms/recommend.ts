import type { ComparedAlgorithms, SimulationResult } from "@/lib/types";
import { simulateFCFS } from "@/lib/algorithms/fcfs";
import { simulateSJF } from "@/lib/algorithms/sjf";
import { simulateSRTF } from "@/lib/algorithms/srtf";

export type Recommendation = {
  selectedAlgorithm: "FCFS" | "SJF" | "SRTF";
  reason: string;
  comparedAlgorithms: ComparedAlgorithms;
  ratings: Record<"FCFS" | "SJF" | "SRTF", "Fair" | "Very Good" | "Excellent">;
  comparisonSentence: string;
};

type AlgoKey = "FCFS" | "SJF" | "SRTF";

function keyTuple(r: SimulationResult): [number, number, number] {
  return [
    r.averages.averageWaitingTime,
    r.averages.averageTurnaroundTime,
    r.averages.averageResponseTime,
  ];
}

function compareTuple(a: [number, number, number], b: [number, number, number]): number {
  if (a[0] !== b[0]) return a[0] - b[0];
  if (a[1] !== b[1]) return a[1] - b[1];
  return a[2] - b[2];
}

export function recommendAlgorithm(processData: Parameters<typeof simulateFCFS>[0]): Recommendation {
  const comparedAlgorithms: ComparedAlgorithms = {
    FCFS: simulateFCFS(processData),
    SJF: simulateSJF(processData),
    SRTF: simulateSRTF(processData),
  };

  const keys: AlgoKey[] = ["FCFS", "SJF", "SRTF"];
  const ranked = keys
    .slice()
    .sort((a, b) => compareTuple(keyTuple(comparedAlgorithms[a]), keyTuple(comparedAlgorithms[b])));

  const selectedAlgorithm = ranked[0];
  const selected = comparedAlgorithms[selectedAlgorithm];

  const winners: string[] = [];
  const bestWT = Math.min(...keys.map((k) => comparedAlgorithms[k].averages.averageWaitingTime));
  const bestTAT = Math.min(...keys.map((k) => comparedAlgorithms[k].averages.averageTurnaroundTime));
  const bestRT = Math.min(...keys.map((k) => comparedAlgorithms[k].averages.averageResponseTime));

  if (selected.averages.averageWaitingTime === bestWT) winners.push("average waiting time");
  if (selected.averages.averageTurnaroundTime === bestTAT) winners.push("average turnaround time");
  if (selected.averages.averageResponseTime === bestRT) winners.push("average response time");

  const reason =
    winners.length > 0
      ? `${selectedAlgorithm} was recommended because it produced the lowest ${winners.join(
          " and ",
        )} for the given dataset.`
      : `${selectedAlgorithm} was recommended because it produced the best overall average performance for the given dataset.`;

  const ratings: Recommendation["ratings"] = {
    [ranked[0]]: "Excellent",
    [ranked[1]]: "Very Good",
    [ranked[2]]: "Fair",
  } as Recommendation["ratings"];

  const others = keys.filter((k) => k !== selectedAlgorithm);
  const comparisonSentence = `Compared with ${others[0]} and ${others[1]}, ${selectedAlgorithm} produced the best overall averages for this dataset.`;

  return { selectedAlgorithm, reason, comparedAlgorithms, ratings, comparisonSentence };
}

