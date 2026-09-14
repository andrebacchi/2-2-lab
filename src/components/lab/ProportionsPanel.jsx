import React, { useState } from 'react';
import { ArrowLeftRight, Info } from 'lucide-react';
import { fmtPct, fmtInt } from '@/lib/format';

const PERSPECTIVES = [
  { key: 'row', label: 'Por linha', hint: 'denominador = total da linha (exposição)' },
  { key: 'col', label: 'Por coluna', hint: 'denominador = total da coluna (desfecho)' },
  { key: 'total', label: 'Total', hint: 'denominador = n' },
];

const CELL_LABELS = {
  a: 'a — Expostos com desfecho',
  b: 'b — Expostos sem desfecho',
  c: 'c — Não expostos com desfecho',
  d: 'd — Não expostos sem desfecho',
};

export default function ProportionsPanel({ r, labels }) {
  const [perspective, setPerspective] = useState('row');
  const [showDenom, setShowDenom] = useState(true);

  const cells = ['a', 'b', 'c', 'd'];
  const denomMap = {
    row: { a: r.totals.row1, b: r.totals.row1, c: r.totals.row2, d: r.totals.row2 },
    col: { a: r.totals.col1, b: r.totals.col2, c: r.totals.col1, d: r.totals.col2 },
    total: { a: r.totals.n, b: r.totals.n, c: r.totals.n, d: r.totals.n },
  };

  return (
    <section className="rounded-xl border border-border bg-background p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Proporções
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDenom((s) => !s)}
            className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
              showDenom
                ? 'bg-foreground text-background border-foreground'
                : 'text-muted-foreground border-border hover:bg-muted'
            }`}
          >
            Mostrar denominadores
          </button>
        </div>
      </div>

      {/* Trocar perspectiva */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <ArrowLeftRight className="w-3.5 h-3.5" />
          Trocar perspectiva:
        </span>
        {PERSPECTIVES.map((p) => (
          <button
            key={p.key}
            onClick={() => setPerspective(p.key)}
            className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
              perspective === p.key
                ? 'bg-foreground text-background border-foreground'
                : 'text-muted-foreground border-border hover:bg-accent'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground italic mb-4">
        {PERSPECTIVES.find((p) => p.key === perspective).hint}. A mesma célula
        responde perguntas diferentes conforme o denominador.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {cells.map((k) => {
          const val = r.proportions[perspective][k];
          const num = r[k];
          const den = denomMap[perspective][k];
          return (
            <div
              key={k}
              className="rounded-lg border border-border bg-card px-3 py-2.5"
            >
              <div className="text-[11px] text-muted-foreground mb-1">
                {CELL_LABELS[k]}
              </div>
              {showDenom ? (
                <div className="flex items-center gap-2">
                  <div className="font-mono text-sm text-foreground tabular-nums">
                    <span className="font-semibold">{fmtInt(num)}</span>
                    <span className="text-muted-foreground"> / </span>
                    <span>{fmtInt(den)}</span>
                  </div>
                  <div className="ml-auto text-lg font-semibold tabular-nums text-teal-700">
                    {fmtPct(val, 1)}
                  </div>
                </div>
              ) : (
                <div className="text-lg font-semibold tabular-nums text-teal-700">
                  {fmtPct(val, 1)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 40% de quem? */}
      <div className="mt-4 flex items-start gap-2 rounded-lg bg-teal-50/50 border border-teal-100 px-3 py-2.5">
        <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <p className="text-xs text-foreground/80">
          <span className="font-semibold">40% de quem?</span> O numerador sozinho
          não define o significado da porcentagem — o denominador define.{' '}
          {fmtPct(r.proportions.row.a, 0)} pode ser “{fmtInt(r.a)} de{' '}
          {fmtInt(r.totals.row1)} expostos” ou “{fmtInt(r.a)} de{' '}
          {fmtInt(r.totals.n)} indivíduos”.
        </p>
      </div>
    </section>
  );
}