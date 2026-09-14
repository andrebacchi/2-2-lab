import React from 'react';
import { fmt, fmtInt } from '@/lib/format';

function MiniTable({ title, vals, isInt }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 text-center">
        {title}
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {vals.map((v, i) => (
          <div
            key={i}
            className="rounded-md border border-border bg-card py-3 text-center"
          >
            <div className="text-[10px] text-muted-foreground">
              {['a', 'b', 'c', 'd'][i]}
            </div>
            <div className="text-lg font-semibold tabular-nums text-foreground">
              {v === null ? '—' : isInt ? fmtInt(v) : fmt(v, 2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ExpectedFrequencies({ r }) {
  const obs = [r.a, r.b, r.c, r.d];
  const exp = [r.expected.a, r.expected.b, r.expected.c, r.expected.d];
  const diff = obs.map((o, i) => (exp[i] !== null ? o - exp[i] : null));
  return (
    <div>
      <h3 className="font-display text-base font-semibold text-foreground mb-1">
        Frequências esperadas
      </h3>
      <p className="text-xs text-muted-foreground italic mb-4">
        E = (total da linha × total da coluna) / n — o esperado sob H0 (sem
        associação).
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MiniTable title="Observado" vals={obs} isInt />
        <MiniTable title="Esperado" vals={exp} />
        <MiniTable title="O − E" vals={diff} />
      </div>
    </div>
  );
}