# CPU Scheduling Simulator — Structure, API, and Calculations

This document captures the **file structure**, the **final backend API** contract, and the **exact calculation logic** used by this project (FCFS, SJF, SRTF, and Recommended).

---

## File structure (core project files)

> Note: `node_modules/` is omitted (dependency contents).

```text
cpu_scheduler/
  app/
    api/simulate/route.ts          # POST /api/simulate (runs simulations)
    globals.css                    # theme variables + global styles
    layout.tsx                     # root layout
    page.tsx                       # main client UI (form + results modal)
  components/
    AlgorithmRatings.tsx           # ratings panel (Excellent/Very Good/Fair)
    AlgorithmSelector.tsx          # algorithm picker (cards/select)
    GanttChart.tsx                 # gantt segments visualization + execution order
    MetricsTable.tsx               # per-process table (AT/BT/CT/WT/TAT/RT)
    PowerBIDashboard.tsx           # placeholder embed panel
    ProcessInputForm.tsx           # input form + validation display
    RecommendationCard.tsx         # recommendation reason panel
    ResultPanel.tsx                # results dashboard (summary, tables, gantt, etc.)
    SummaryCards.tsx               # averages cards (Average WT/TAT/RT)
  lib/
    algorithms/
      _shared.ts                   # shared helpers + metric formulas
      fcfs.ts                      # FCFS simulation
      sjf.ts                       # SJF simulation
      srtf.ts                      # SRTF simulation (preemptive)
      recommend.ts                 # "Recommended" selector (runs all + picks best)
    utils/
      format.ts                    # rounding/format helpers
      validation.ts                # frontend/backend input validation
    types.ts                       # shared request/response + simulation types
  README.md
  package.json
```

---

## “Final API” (backend)

### Endpoint

- **Method**: `POST`
- **Path**: `/api/simulate`
- **File**: `app/api/simulate/route.ts`
- **Content-Type**: `application/json`

### Request body (`SimulateRequestBody`)

Defined in `lib/types.ts`.

```ts
type ApiAlgorithm = "FCFS" | "SJF" | "SRTF" | "RECOMMENDED";

type ProcessInput = {
  processId: string;
  arrivalTime: number;
  burstTime: number;
};

type SimulateRequestBody = {
  processData: ProcessInput[];
  algorithm: ApiAlgorithm;
};
```

### Validation rules

Validated by `lib/utils/validation.ts` on the server (and similarly on the client).

- **processData**
  - Must be an array with **at least 1 process**
- **processId**
  - Required, non-empty after trimming
  - Must be **unique** across all rows
- **arrivalTime (AT)**
  - Must be a finite number
  - Must be **\(\ge 0\)**
- **burstTime (BT)**
  - Must be a finite number
  - Must be **\(> 0\)**
- **algorithm**
  - Must be one of: `FCFS`, `SJF`, `SRTF`, `RECOMMENDED`

### Responses

#### Success (`SimulateResponseBody`)

Defined in `lib/types.ts`.

```ts
type GanttSegment = { processId: string; start: number; end: number };

type ProcessMetrics = {
  processId: string;
  arrivalTime: number;
  burstTime: number;
  completionTime: number;
  waitingTime: number;
  turnaroundTime: number;
  responseTime: number;
};

type SimulationResult = {
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

type ComparedAlgorithms = Record<"FCFS" | "SJF" | "SRTF", SimulationResult>;

type SimulateResponseBody = {
  selectedAlgorithm: "FCFS" | "SJF" | "SRTF";
  recommendationReason: string;
  comparedAlgorithms?: ComparedAlgorithms; // only when algorithm=RECOMMENDED
  result: SimulationResult;
};
```

#### Error responses

- **400 Invalid JSON**
  - `{ "message": "Invalid JSON body." }`
- **400 Validation failed**
  - `{ "message": "Validation failed.", "errors": [{ "path": "...", "message": "..." }] }`

The `errors[].path` values match the input fields, e.g.:
- `algorithm`
- `processData`
- `processData[0].processId`
- `processData[1].arrivalTime`
- `processData[2].burstTime`

---

## Simulation output model (what the UI renders)

The UI (`app/page.tsx` + `components/ResultPanel.tsx`) displays:

- **Selected/Recommended algorithm**: `selectedAlgorithm`
- **Recommendation text**: `recommendationReason`
- **Summary cards**: `result.averages` (Average WT/TAT/RT)
- **Metrics table**: `result.metrics` with per-process CT/WT/TAT/RT
- **Gantt chart**: `result.ganttChartSegments`
- **Execution order**: derived from `ganttChartSegments` by collapsing consecutive duplicates (ignoring IDLE)
- **Comparison sentence**: shown only when `comparedAlgorithms` is present (Recommended mode)

---

## Core calculations (metrics + averages)

All metric math is centralized in `lib/algorithms/_shared.ts` in `computeMetricsFromSegments(...)`.

### Gantt segments

All algorithms produce a timeline as an array of segments:

```ts
type GanttSegment = { processId: string; start: number; end: number };
```

There is a special process id used to represent gaps:

- **IDLE**: `"IDLE"` (defined as `IDLE_PROCESS_ID`)

Consecutive adjacent segments for the same `processId` are merged (“compressed”) before returning to the UI.

### Per-process times

For each process \(p\):

- **Completion Time (CT)**: the **end time** of the last segment for \(p\)
- **First Start Time (FST)**: the **start time** of the first segment for \(p\)

Then the standard CPU scheduling metrics are computed:

\[
\text{TAT} = \text{CT} - \text{AT}
\]

\[
\text{WT} = \text{TAT} - \text{BT}
\]

\[
\text{RT} = \text{FST} - \text{AT}
\]

Where:
- \(AT\) = arrival time
- \(BT\) = burst time

### Averages

Given \(n\) processes:

\[
\text{Average WT} = \frac{1}{n}\sum \text{WT}
\quad
\text{Average TAT} = \frac{1}{n}\sum \text{TAT}
\quad
\text{Average RT} = \frac{1}{n}\sum \text{RT}
\]

### Rounding behavior

In `lib/utils/format.ts`:

- `round2(x)` rounds to **2 decimal places** using `Math.round(x*100)/100`
- The averages returned by the backend are rounded with `round2`

The summary cards format values for display using:

- `formatNumber(value, digits=2)`: prints `-` if not finite, otherwise fixed decimals with `.00` stripped

---

## Algorithm logic (exact behavior)

All algorithms start by normalizing inputs (in `_shared.ts`):

- `processId` is trimmed (`String(p.processId).trim()`)
- `arrivalTime` and `burstTime` are coerced with `Number(...)`

Then they build Gantt segments and pass them through `computeMetricsFromSegments(...)`.

### FCFS (First Come First Serve) — non-preemptive

**File**: `lib/algorithms/fcfs.ts`

Implementation details:

- Sort processes by:
  - ascending `arrivalTime`
  - tie-breaker: lexicographic `processId`
- Maintain a time pointer `t` starting at `0`
- For each process in sorted order:
  - If `t < arrivalTime`, add an `IDLE` segment from `t` to `arrivalTime` and set `t = arrivalTime`
  - Run the process for its full burst:
    - segment: `[t, t + burstTime)`
    - update `t`

### SJF (Shortest Job First) — non-preemptive

**File**: `lib/algorithms/sjf.ts`

Implementation details:

- Sort processes by arrival time (same tie-breaker as FCFS)
- Keep a `remaining` set of processIds that are not yet completed
- Maintain time `t` starting at `0`
- While processes remain:
  - Compute `available`: processes not done with `arrivalTime <= t`
  - Choose the one with:
    - smallest `burstTime`
    - tie-breaker: earlier arrival, then `processId`
  - If none are available:
    - “jump” time forward to the next arrival among remaining processes
    - add an `IDLE` segment from `t` to that `nextArrival`
    - set `t = nextArrival`
  - Otherwise, run the chosen process **to completion** (one segment)

### SRTF (Shortest Remaining Time First) — preemptive

**File**: `lib/algorithms/srtf.ts`

Implementation details:

- Start time `t` is the **minimum arrival time** (or `0` if not finite)
- Each process has a runtime `remaining` initialized to `burstTime`
- While not all are done:
  - Compute `available`: arrived (`arrivalTime <= t`), not done, `remaining > 0`
  - Choose the one with:
    - smallest `remaining`
    - tie-breaker: earlier arrival, then `processId`
  - If none are available:
    - find the next future arrival
    - add an `IDLE` segment `[t, nextArrival)`
    - set `t = nextArrival`
  - Otherwise:
    - run **exactly 1 time unit**:
      - add segment `[t, t+1)` for chosen process
      - decrement `remaining`
      - increment `t`
    - when `remaining <= 0`, mark done

This “1-unit stepping” is what creates preemptive behavior (process can change every time unit).

---

## Recommended mode (algorithm selector)

**File**: `lib/algorithms/recommend.ts`

When the API receives `algorithm: "RECOMMENDED"`:

- It runs **all three**: FCFS, SJF, SRTF on the same `processData`
- It ranks them by the tuple:

\[
(\text{Average WT}, \text{Average TAT}, \text{Average RT})
\]

Lexicographic order (lowest WT wins; if tie, lowest TAT; if tie, lowest RT).

The response then includes:

- `selectedAlgorithm`: best-ranked algorithm
- `recommendationReason`: sentence explaining which averages it minimized
- `comparedAlgorithms`: results for FCFS/SJF/SRTF (so the UI can compare)
- `result`: the selected algorithm’s full `SimulationResult`

---

## Frontend flow (how the API is used)

**Entry point**: `app/page.tsx`

- User edits process rows and chooses an algorithm
- Clicking **Run Simulation** sends:

```json
{
  "processData": [
    { "processId": "P1", "arrivalTime": 0, "burstTime": 7 }
  ],
  "algorithm": "RECOMMENDED"
}
```

- The UI displays validation errors either:
  - **client-side** (before request), and/or
  - **server-side** using `errors[].path` mapping to fields

---

## Notes / conventions used in this codebase

- **Stable ordering**:
  - Process input list is normalized and generally sorted by arrival-time + processId for simulation
  - Returned `metrics` are sorted by `processId` for consistent table display
- **IDLE segments**:
  - Used to keep the Gantt chart visually accurate when the CPU is idle (no available process)
- **Execution order**:
  - Computed from compressed segments while skipping `IDLE` and collapsing adjacent duplicates

