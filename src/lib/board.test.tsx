import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MarketPage } from "../pages/MarketPage";

vi.mock("./board", () => ({
  useBoard: () => ({
    loading: false,
    error: null,
    data: {
      session_date: "2026-11-15",
      ts: "2026-11-15T10:05:00+00:00",
      updated_at: new Date("2026-11-15T10:05:05+00:00"),
      rows: [
        {
          symbol: "RELIANCE",
          side: "BULL",
          rank: 1,
          rank_delta: 2,
          score_raw: 1.23,
          score_pct: 98.4,
          move_pct: 0.85,
          event_risk: false,
          eligible: true,
          reason_code: null,
          sector: "Energy",
        },
        {
          symbol: "INFY",
          side: "BEAR",
          rank: 1,
          rank_delta: -1,
          score_raw: -0.8,
          score_pct: 90.1,
          move_pct: -0.5,
          event_risk: false,
          eligible: true,
          reason_code: null,
          sector: "IT",
        },
      ],
    },
  }),
}));

describe("MarketPage", () => {
  it("renders board rows and summary", () => {
    render(<MarketPage />);
    expect(screen.getByText("RELIANCE")).toBeInTheDocument();
    expect(screen.getByText("INFY")).toBeInTheDocument();
    expect(screen.getAllByText(/Bullish/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Bearish/i).length).toBeGreaterThan(0);
  });
});
