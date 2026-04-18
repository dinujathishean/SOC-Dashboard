import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { postSimulation } from "../lib/api";
import { canMutate } from "../lib/roles";
import { useAuth } from "../context/AuthContext";

const SCENARIOS = [
  { id: "all", label: "Full mix" },
  { id: "failed_logins", label: "Failed logins" },
  { id: "sql_injection", label: "SQL injection probes" },
  { id: "brute_force", label: "Brute force burst" },
  { id: "suspicious_ip", label: "Suspicious IP (admin + after-hours)" },
] as const;

export function SimulationPage() {
  const { user } = useAuth();
  const editable = canMutate(user?.role);
  const [scenario, setScenario] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ logsInserted: number; summary: string[] } | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const r = await postSimulation(scenario);
      setResult({ logsInserted: r.logsInserted, summary: r.summary });
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-[960px] space-y-6 px-4 py-6 md:px-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-500/80">Simulator</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-white">Mock SOC traffic</h1>
        <p className="mt-1 text-sm text-slate-400">
          Generate synthetic web authentication and WAF-style logs for demos. Run detection afterward to surface
          alerts.
        </p>
      </div>

      {!editable ? (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Viewer role: simulation is disabled.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          disabled={!editable || loading}
          className="rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/40"
        >
          {SCENARIOS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={!editable || loading}
          onClick={() => void run()}
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Generate traffic
        </button>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      {result ? (
        <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-slate-300">
          <p>
            Logs inserted: <span className="font-mono text-white">{result.logsInserted}</span>
          </p>
          <ul className="mt-2 list-inside list-disc text-xs text-slate-400">
            {result.summary.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
