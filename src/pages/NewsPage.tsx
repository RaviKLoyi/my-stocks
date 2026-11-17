export function NewsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="rounded-xl border border-border bg-card/60 p-8 shadow-[0_0_24px_hsl(var(--primary)/0.06)]">
        <h1 className="font-heading text-3xl font-semibold text-foreground">News</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          News and updates will appear here. For now, check the{" "}
          <span className="text-primary">Market</span> tab for the live board.
        </p>
      </div>
    </div>
  );
}
