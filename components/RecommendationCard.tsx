export function RecommendationCard({
  title = "Recommendation Reason",
  reason,
}: {
  title?: string;
  reason: string;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white shadow-sm">
      <div className="px-5 py-4 border-b border-[color:var(--border)]">
        <h3 className="text-sm font-bold text-[color:var(--primary)]">{title}</h3>
      </div>
      <div className="p-5">
        <div className="rounded-xl border border-[color:color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[color:color-mix(in_oklab,var(--accent)_14%,white)] px-4 py-3 text-sm font-semibold text-[color:var(--primary)]">
          {reason}
        </div>
      </div>
    </div>
  );
}

