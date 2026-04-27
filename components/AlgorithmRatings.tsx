type Rating = "Fair" | "Very Good" | "Excellent";

function badgeClass(r: Rating) {
  if (r === "Excellent")
    return "border-[color:color-mix(in_oklab,var(--accent)_75%,var(--primary))] bg-[color:color-mix(in_oklab,var(--accent)_22%,white)] text-[color:var(--primary)]";
  if (r === "Very Good")
    return "border-[color:color-mix(in_oklab,var(--primary)_35%,transparent)] bg-[color:color-mix(in_oklab,var(--primary)_6%,white)] text-[color:var(--primary)]";
  return "border-[color:var(--border)] bg-white text-[color:var(--muted)]";
}

export function AlgorithmRatings({
  ratings,
}: {
  ratings: Record<"FCFS" | "SJF" | "SRTF", Rating>;
}) {
  const rows: { algo: "FCFS" | "SJF" | "SRTF"; rating: Rating }[] = [
    { algo: "FCFS", rating: ratings.FCFS },
    { algo: "SJF", rating: ratings.SJF },
    { algo: "SRTF", rating: ratings.SRTF },
  ];

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white shadow-sm min-w-0">
      <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-[color:var(--border)]">
        <h3 className="text-sm font-bold text-[color:var(--primary)]">Algorithm Rating</h3>
      </div>
      <div className="p-4 sm:p-5 grid gap-3 min-w-0">
        {rows.map((r) => (
          <div key={r.algo} className="flex flex-wrap items-center justify-between gap-2 min-w-0">
            <div className="text-sm font-extrabold text-[color:var(--primary)] shrink-0">{r.algo}</div>
            <span
              className={[
                "rounded-full border px-2.5 py-1 sm:px-3 text-[11px] sm:text-xs font-extrabold tracking-wide shrink-0 max-w-full text-center",
                badgeClass(r.rating),
              ].join(" ")}
            >
              {r.rating}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

