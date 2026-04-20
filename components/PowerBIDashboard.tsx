export function PowerBIDashboard({
  embedUrl,
}: {
  embedUrl?: string;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[color:var(--border)]">
        <h3 className="text-sm font-bold text-[color:var(--primary)]">Power BI Dashboard</h3>
        <p className="text-xs text-[color:var(--muted)] mt-1">
          Embedded dashboard placeholder for advanced analytics and reporting
        </p>
      </div>

      <div className="p-5">
        {embedUrl ? (
          <div className="rounded-xl overflow-hidden border border-[color:var(--border)]">
            <iframe
              title="Power BI Embedded Dashboard"
              src={embedUrl}
              className="w-full h-[420px]"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--primary)_2%,white)] p-6">
            <div className="text-sm font-extrabold text-[color:var(--primary)]">
              Power BI Dashboard Placeholder
            </div>
            <p className="mt-2 text-sm text-[color:var(--muted)] leading-6">
              This section supports Power BI integration for advanced scheduling analytics including algorithm comparison,
              performance visualization, average waiting/turnaround/response time trends, recommended algorithm summary, and
              performance ranking.
            </p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {[
                "Algorithm comparison & ranking",
                "Average metrics visualization",
                "Recommendation summary",
                "Export-ready reporting layout",
              ].map((x) => (
                <div
                  key={x}
                  className="rounded-xl border border-[color:color-mix(in_oklab,var(--accent)_35%,transparent)] bg-white px-4 py-3 text-xs font-bold text-[color:var(--primary)]"
                >
                  {x}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-[color:var(--muted)]">
              To embed a real dashboard later, pass a Power BI embed URL into this component.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

