export type ProcessInput = {
  processId: string;
  arrivalTime: number;
  burstTime: number;
};

export type ProcessMetrics = {
  processId: string;
  arrivalTime: number;
  burstTime: number;
  completionTime: number;
  waitingTime: number;
  turnaroundTime: number;
  responseTime: number;
};

export type GanttSegment = {
  processId: string;
  start: number;
  end: number;
};

export type SimulationResult = {
  algorithm: "FCFS" | "SJF" | "SRTF";
  metrics: ProcessMetrics[];
  ganttChartSegments: GanttSegment[];
  executionOrder: string[];
  averages: {
    averageWaitingTime: number;
    averageTurnaroundTime: number;
    averageResponseTime: number;
  };
};

export type ApiAlgorithm = "FCFS" | "SJF" | "SRTF" | "RECOMMENDED";

export type SimulateRequestBody = {
  processData: ProcessInput[];
  algorithm: ApiAlgorithm;
};

export type ComparedAlgorithms = Record<"FCFS" | "SJF" | "SRTF", SimulationResult>;

export type SimulateResponseBody = {
  selectedAlgorithm: "FCFS" | "SJF" | "SRTF";
  recommendationReason: string;
  comparedAlgorithms?: ComparedAlgorithms;
  result: SimulationResult;
};

