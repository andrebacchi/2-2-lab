import React from 'react';
import { fmtInt, fmtPct, fmtMeasure, fmtP, ciText } from '@/lib/format';

const LEFT_BORDERS = {
  'teal-700': 'border-l-4 border-l-teal-700',
  'teal-600': 'border-l-4 border-l-teal-600',
};

function Card({ label, value, sub, accent }) {
  return (
    <button
      className={`text-left rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-foreground/25 ${
        accent ? LEFT_BORDERS[accent] || '' : ''
      }`}
    >
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="text-2xl font-semibold tabular-nums text-foreground mt-0.5">
        {value}
      </div>
      {sub && <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>}
    </button>
  );
}

export default function SummaryCards({ r }) {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
      <Card label="N" value={fmtInt(r.totals.n)} sub="total de indivíduos" accent="teal-700" />
      <Card
        label="P(desfecho | expostos)"
        value={fmtPct(r.riskExp, 1)}
        sub={`a / (a+b) = ${fmtInt(r.a)} / ${fmtInt(r.totals.row1)}`}
      />
      <Card
        label="P(desfecho | não expostos)"
        value={fmtPct(r.riskUnexp, 1)}
        sub={`c / (c+d) = ${fmtInt(r.c)} / ${fmtInt(r.totals.row2)}`}
      />
      <Card
        label="RR / RP"
        value={fmtMeasure(r.RR)}
        sub={`IC 95%: ${ciText(r.RRCI)}${r.RR !== null ? ' · RP = mesmo cálculo (transversal)' : ''}`}
        accent="teal-600"
      />
      <Card
        label="OR"
        value={fmtMeasure(r.OR)}
        sub={`IC 95%: ${ciText(r.ORCI)}`}
        accent="teal-600"
      />
    </section>
  );
}