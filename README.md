## CPU Scheduling Simulator

Student project web application for simulating CPU scheduling algorithms with a dashboard-style UI.

### Features

- **Process input panel**: dynamic process rows (Process ID, Arrival Time, Burst Time) with validation
- **Algorithms**: FCFS (non-preemptive), SJF (non-preemptive), SRTF (preemptive), and **Recommended**
- **Outputs**: execution order, Gantt chart, per-process metrics, average metrics
- **Recommended mode**: runs FCFS/SJF/SRTF on the same dataset and selects the best algorithm by lowest averages

### Tech stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS

### Getting started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Project structure

- `app/page.tsx`: main two-panel UI (left inputs, right dashboard)
- `app/api/simulate/route.ts`: backend API route (`POST /api/simulate`)
- `lib/types.ts`: shared TypeScript types used across frontend + backend
- `lib/algorithms/`: scheduling logic
  - `fcfs.ts`
  - `sjf.ts`
  - `srtf.ts`
  - `recommend.ts`
- `lib/utils/validation.ts`: validation for both frontend and backend
- `components/`: modular UI building blocks (Gantt, tables, etc.)

### Where algorithm logic lives

All scheduling logic is in `lib/algorithms/`.

- **Add a new algorithm**: create a new simulator file (e.g. `lib/algorithms/rr.ts`) that returns a `SimulationResult`, then update `app/api/simulate/route.ts` and (optionally) `components/AlgorithmSelector.tsx`.

### How to change theme colors

Theme variables live in `app/globals.css`:

- `--primary`: `#032A64`
- `--accent`: `#36E9FD`

# CPU_Scheduler
