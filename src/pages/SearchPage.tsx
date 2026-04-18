import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, ArrowRight } from "lucide-react";
import { fetchSearch } from "../lib/api";
import type { IncidentSummary, SecurityAlert, Severity } from "../types/soc";
import { SeverityBadge } from "../components/soc/Badges";

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [incidents, setIncidents] = useState<IncidentSummary[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!q.trim()) {
      setAlerts([]);
      setIncidents([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setErr(null);
    void (async () => {
      try {
        const data = await fetchSearch(q);
        if (!cancelled) {
          setAlerts(data.alerts);
          setIncidents(data.incidents);
        }
      } catch (e) {
        if (!cancelled) setErr(String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [q]);

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 md:px-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-500/80">Global search</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-white">Results</h1>
        <p className="mt-1 font-mono text-sm text-slate-500">
          Query: <span className="text-cyan-200/90">{q || "(empty)"}</span>
        </p>
      </div>

      {err ? <p className="text-sm text-red-400">{err}</p> : null}
      {loading ? (
        <div className="flex items-center gap-2 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          Searching…
        </div>
      ) : null}

      {!loading && q.trim() && !err ? (
        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-xl border border-white/10 bg-black/25 p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Alerts ({alerts.length})</h2>
            <ul className="mt-3 space-y-2">
              {alerts.length === 0 ? (
                <li className="text-sm text-slate-500">No matching alerts</li>
              ) : (
                alerts.map((a) => (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => navigate("/", { state: { openAlertId: a.id } })}
                      className="flex w-full items-start justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 text-left transition hover:border-cyan-500/25 hover:bg-white/[0.06]"
                    >
                      <div className="min-w-0">
                        <p className="font-mono text-xs text-cyan-200/90">{a.id}</p>
                        <p className="truncate text-sm text-slate-200">{a.eventType}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <SeverityBadge severity={a.severity as Severity} />
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-600" />
                    </button>
                  </li>
                ))
              )}
            </ul>
          </section>

          <section className="rounded-xl border border-white/10 bg-black/25 p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Incidents ({incidents.length})
            </h2>
            <ul className="mt-3 space-y-2">
              {incidents.length === 0 ? (
                <li className="text-sm text-slate-500">No matching incidents</li>
              ) : (
                incidents.map((i) => (
                  <li key={i.id}>
                    <button
                      type="button"
                      onClick={() => navigate(`/incidents?focus=${encodeURIComponent(i.id)}`)}
                      className="flex w-full items-start justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 text-left transition hover:border-cyan-500/25 hover:bg-white/[0.06]"
                    >
                      <div className="min-w-0">
                        <p className="font-mono text-xs text-cyan-200/90">{i.id}</p>
                        <p className="truncate text-sm text-slate-200">{i.title}</p>
                        <p className="text-[11px] text-slate-500">
                          {i.status} · {i.severity}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-600" />
                    </button>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      ) : null}
    </div>
  );
}
