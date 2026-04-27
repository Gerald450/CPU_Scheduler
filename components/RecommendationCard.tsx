export function RecommendationCard({
  title = "Recommendation Reason",
  reason,
}: {
  title?: string;
  reason: string;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white shadow-sm min-w-0">
      <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-[color:var(--border)]">
        <h3 className="text-sm font-bold text-[color:var(--primary)]">{title}</h3>
      </div>
      <div className="p-4 sm:p-5 min-w-0">
        <div className="rounded-xl border border-[color:color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[color:color-mix(in_oklab,var(--accent)_14%,white)] px-3 py-3 sm:px-4 text-sm font-semibold text-[color:var(--primary)] break-words">
          {reason}
        </div>
      </div>
    </div>
  );
}

