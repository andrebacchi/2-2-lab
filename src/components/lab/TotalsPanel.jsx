import React from 'react';
import { fmtInt } from '@/lib/format';

function TotalItem({ label, value, sub }) {
  return (
    <div
      key={value}
      className="tot-flash rounded-lg border border-border bg-card px-3 py-3 text-center"
    >
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="text-2xl font-semibold tabular-nums text-foreground mt-0.5">
        {fmtInt(value)}
      </div>
      {sub && (
        <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>
      )}
    </div>
  );
}

export default function TotalsPanel({ r }) {
  const { totals: t } = r;
  return (
    <section className="rounded-xl border border-border bg-background p-4 sm:p-5 shadow-sm">
      <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Totais
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <TotalItem label="Expostos" value={t.exposed} sub="a + b" />
        <TotalItem label="Não expostos" value={t.unexposed} sub="c + d" />
        <TotalItem label="Com desfecho" value={t.withOutcome} sub="a + c" />
        <TotalItem label="Sem desfecho" value={t.withoutOutcome} sub="b + d" />
        <TotalItem label="Total" value={t.n} sub="n" />
      </div>
    </section>
  );
}