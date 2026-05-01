/**
 * Terminal entry: prints the default Recommended demo and each algorithm on the sample set.
 * Run from repo root: npm run prototype
 */
import {
  formatPrototypeSummary,
  PROTOTYPE_SAMPLE_PROCESSES,
  runCpuSchedulerPrototype,
  runDefaultPrototypeDemo,
} from "./cpu-scheduler-prototype";

console.log("=== Default (Recommended on sample) ===\n");
console.log(runDefaultPrototypeDemo());
console.log("\n=== Each algorithm (sample processes) ===\n");
for (const algo of ["FCFS", "SJF", "SRTF"] as const) {
  const out = runCpuSchedulerPrototype(PROTOTYPE_SAMPLE_PROCESSES, algo);
  if (out.ok) {
    console.log(formatPrototypeSummary(out.data));
  } else {
    console.log(`${algo}:`, out.errors);
  }
  console.log("");
}
