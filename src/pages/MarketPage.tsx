import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { useBoard, type BoardRow, type BoardSide } from "../lib/board";
import { formatIst, formatIstTime, formatNumber, formatPct, isStale } from "../lib/format";

type Filter = "ALL" | BoardSide;

const filters: { value: Filter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "BULL", label: "Bull" },
  { value: "BEAR", label: "Bear" },
  { value: "NEUTRAL", label: "Neutral" },
];

function sideTone(side: BoardSide) {
  if (side === "BULL") return "text-emerald-400 border-emerald-400/30 bg-emerald-400/10";
  if (side === "BEAR") return "text-rose-400 border-rose-400/30 bg-rose-400/10";
  return "text-slate-300 border-slate-400/30 bg-slate-400/10";
}

function sideLabel(side: BoardSide) {
  if (side === "BULL") return "Bullish";
  if (side === "BEAR") return "Bearish";
  return "Neutral";
}

function deltaText(delta: number | null) {
  if (delta === null || !Number.isFinite(delta) || delta === 0) return "—";
  return delta > 0 ? `▲ ${delta}` : `▼ ${Math.abs(delta)}`;
}

function deltaTone(delta: number | null) {
  if (delta === null || !Number.isFinite(delta) || delta === 0) return "text-muted-foreground";
  return delta > 0 ? "text-emerald-400" : "text-rose-400";
}

function countBy(rows: BoardRow[], side: BoardSide) {
  return rows.filter((r) => r.side === side).length;
}

export function MarketPage() {
  const { data, loading, error } = useBoard();
  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => data?.rows ?? [], [data?.rows]);
  const stale = isStale(data?.ts, 15);

  const visibleRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "ALL" && r.side !== filter) return false;
      if (q && !r.symbol.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, filter, query]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary/80">RupeeFarm Board</p>
            <h1 className="mt-1 font-heading text-3xl font-semibold text-foreground">Market</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Live bullish, bearish and neutral stocks.{" "}
              <span className="text-foreground/80">Data as of:</span>{" "}
              <span className="text-primary">{formatIst(data?.ts)}</span>
              {" · "}
              <span className="text-foreground/80">Synced:</span>{" "}
              {formatIst(data?.updated_at)}
              {data?.session_date ? (
                <>
                  {" · "}
                  <span className="text-foreground/80">Session:</span> {data.session_date}
                </>
              ) : null}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {loading ? (
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
                Connecting…
              </span>
            ) : error ? (
              <span className="rounded-full border border-rose-400/30 bg-rose-400/10 px-3 py-1 text-xs text-rose-300">
                Error
              </span>
            ) : stale ? (
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
                Stale · {formatIstTime(data?.ts)}
              </span>
            ) : (
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                Live · {formatIstTime(data?.ts)}
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-emerald-400/20 bg-card/60 p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Bullish</div>
            <div className="mt-1 font-heading text-2xl font-semibold text-emerald-400">{countBy(rows, "BULL")}</div>
          </div>
          <div className="rounded-xl border border-rose-400/20 bg-card/60 p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Bearish</div>
            <div className="mt-1 font-heading text-2xl font-semibold text-rose-400">{countBy(rows, "BEAR")}</div>
          </div>
          <div className="rounded-xl border border-slate-400/20 bg-card/60 p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Neutral</div>
            <div className="mt-1 font-heading text-2xl font-semibold text-slate-300">{countBy(rows, "NEUTRAL")}</div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={`rounded-md border px-3 py-1.5 text-sm transition-all ${
                  filter === f.value
                    ? "border-primary/60 bg-primary/10 text-primary shadow-[0_0_10px_hsl(var(--primary)/0.15)]"
                    : "border-border bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol…"
            className="w-full rounded-md border border-border bg-card/60 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/60 focus:ring-1 focus:ring-primary/40 md:w-64"
            aria-label="Search symbol"
          />
        </div>

        <div className="mt-4 rounded-xl border border-border bg-card/50 shadow-[0_0_24px_hsl(var(--primary)/0.05)]">
          {loading ? (
            <div className="p-10 text-center text-muted-foreground">Loading live board…</div>
          ) : error ? (
            <div className="p-10 text-center">
              <p className="text-rose-300">Couldn’t load the board.</p>
              <p className="mt-2 text-sm text-muted-foreground">{error}</p>
              <p className="mt-2 text-xs text-muted-foreground">Check Firestore rules and Firebase config.</p>
            </div>
          ) : !data || rows.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              No board data yet. Waiting for the next update…
            </div>
          ) : visibleRows.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">No stocks match your filters.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Symbol</th>
                    <th className="px-4 py-3">Side</th>
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Δ Rank</th>
                    <th className="px-4 py-3">Score %</th>
                    <th className="px-4 py-3">Move %</th>
                    <th className="px-4 py-3">Sector</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row) => (
                    <tr key={`${row.side}-${row.symbol}-${row.rank ?? "na"}`} className="border-b border-border/60 last:border-0 hover:bg-white/[0.02]">
                      <td className="px-4 py-3 font-medium text-foreground">{row.symbol}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${sideTone(row.side)}`}>
                          {sideLabel(row.side)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground/90">{row.rank ?? "—"}</td>
                      <td className={`px-4 py-3 ${deltaTone(row.rank_delta)}`}>{deltaText(row.rank_delta)}</td>
                      <td className="px-4 py-3 text-foreground/90">{formatNumber(row.score_pct, 2)}</td>
                      <td className={`px-4 py-3 ${row.move_pct != null && row.move_pct > 0 ? "text-emerald-400" : row.move_pct != null && row.move_pct < 0 ? "text-rose-400" : "text-foreground/90"}`}>
                        {formatPct(row.move_pct)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{row.sector || "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {row.event_risk ? (
                            <span className="rounded border border-amber-400/30 bg-amber-400/10 px-1.5 py-0.5 text-[11px] text-amber-300">Event</span>
                          ) : null}
                          {!row.eligible ? (
                            <span className="rounded border border-slate-400/30 bg-slate-400/10 px-1.5 py-0.5 text-[11px] text-slate-300">Ineligible</span>
                          ) : null}
                          {!row.event_risk && row.eligible ? (
                            <span className="text-xs text-muted-foreground">OK</span>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {data?.integration_check ? (
          <p className="mt-3 text-xs text-amber-300">
            Showing a connectivity check snapshot (0 rows). This will be replaced by the next live board update.
          </p>
        ) : null}
      </motion.div>
    </div>
  );
}
