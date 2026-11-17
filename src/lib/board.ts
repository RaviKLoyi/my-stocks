import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebase";

export type BoardSide = "BULL" | "BEAR" | "NEUTRAL";

export interface BoardRow {
  symbol: string;
  side: BoardSide;
  rank: number | null;
  rank_delta: number | null;
  score_raw: number | null;
  score_pct: number | null;
  move_pct: number | null;
  event_risk: boolean;
  eligible: boolean;
  reason_code: string | null;
  sector?: string | null;
}

export interface BoardSnapshot {
  session_date: string | null;
  ts: string | null;
  updated_at: Date | null;
  rows: BoardRow[];
  integration_check?: boolean;
}

export interface UseBoardResult {
  data: BoardSnapshot | null;
  loading: boolean;
  error: string | null;
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function toBool(value: unknown): boolean {
  return value === true;
}

function toSide(value: unknown): BoardSide {
  if (value === "BULL" || value === "BEAR" || value === "NEUTRAL") return value;
  return "NEUTRAL";
}

function parseRow(raw: unknown): BoardRow | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const symbol = typeof r.symbol === "string" ? r.symbol : "";
  if (!symbol) return null;
  return {
    symbol,
    side: toSide(r.side),
    rank: toNumber(r.rank),
    rank_delta: toNumber(r.rank_delta),
    score_raw: toNumber(r.score_raw),
    score_pct: toNumber(r.score_pct),
    move_pct: toNumber(r.move_pct),
    event_risk: toBool(r.event_risk),
    eligible: r.eligible !== false,
    reason_code: typeof r.reason_code === "string" ? r.reason_code : null,
    sector: typeof r.sector === "string" ? r.sector : null,
  };
}

function parseSnapshot(raw: Record<string, unknown>): BoardSnapshot {
  const updated = raw.updated_at;
  let updated_at: Date | null = null;
  if (updated instanceof Timestamp) updated_at = updated.toDate();
  else if (updated && typeof (updated as { toDate?: unknown }).toDate === "function") {
    updated_at = (updated as { toDate: () => Date }).toDate();
  }

  const rowsRaw = Array.isArray(raw.rows) ? raw.rows : [];
  const rows = rowsRaw.map(parseRow).filter((r): r is BoardRow => r !== null);

  return {
    session_date: typeof raw.session_date === "string" ? raw.session_date : null,
    ts: typeof raw.ts === "string" ? raw.ts : null,
    updated_at,
    rows,
    integration_check: raw.integration_check === true,
  };
}

export function useBoard(): UseBoardResult {
  const [data, setData] = useState<BoardSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ref = doc(db, "rupeefarm", "board_latest");
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setLoading(false);
        if (!snap.exists()) {
          setData(null);
          setError(null);
          return;
        }
        setError(null);
        setData(parseSnapshot(snap.data() as Record<string, unknown>));
      },
      (err) => {
        setLoading(false);
        setError(err.message || "Failed to load board");
      },
    );
    return () => unsub();
  }, []);

  return { data, loading, error };
}
