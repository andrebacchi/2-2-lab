import React from 'react';
import { fmt, ciText } from '@/lib/format';

export default function ForestPlot({ r }) {
  const measures = [
    { key: 'RR', label: 'RR / RP', est: r.RR, ci: r.RRCI, color: '#7a284b' },
    { key: 'OR', label: 'OR', est: r.OR, ci: r.ORCI, color: '#93335b' },
  ].filter((m) => m.est !== null);

  if (measures.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-8 text-center">
        Não estimável para esta tabela.
      </div>
    );
  }

  const vals = [1];
  measures.forEach((m) => {
    if (m.ci?.low) vals.push(m.ci.low);
    if (m.ci?.high) vals.push(m.ci.high);
    if (m.est) vals.push(m.est);
  });
  let min = Math.min(...vals);
  let max = Math.max(...vals);
  min = Math.max(0.01, min * 0.8);
  max = max * 1.2;
  const lmin = Math.log(min);
  const lmax = Math.log(max);
  const pos = (v) => ((Math.log(v) - lmin) / (lmax - lmin)) * 100;

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-foreground mb-1">
        Forest plot
      </h3>
      <p className="text-xs text-muted-foreground italic mb-4">
        Estimativa pontual e IC 95% em escala logarítmica. Linha vertical no
        nulo (1).
      </p>
      <div className="relative pl-2">
        <div
          className="absolute top-4 bottom-7 w-px bg-foreground/40"
          style={{ left: `${pos(1)}%` }}
        />
        <div
          className="absolute text-[10px] text-muted-foreground -translate-x-1/2"
          style={{ left: `${pos(1)}%`, top: 0 }}
        >
          1 (nulo)
        </div>
        <div className="space-y-5 pt-5">
          {measures.map((m) => {
            const hi = m.ci?.high;
            const lo = m.ci?.low;
            const crosses1 = lo !== null && hi !== null && lo <= 1 && hi >= 1;
            return (
              <div key={m.key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-foreground">{m.label}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {fmt(m.est, 2)} [{ciText(m.ci)}]
                    {crosses1 ? ' · cruza 1' : ''}
                  </span>
                </div>
                <div className="relative h-5 bg-muted/30 rounded">
                  {lo !== null && hi !== null && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-1 rounded"
                      style={{
                        left: `${pos(lo)}%`,
                        width: `${pos(hi) - pos(lo)}%`,
                        background: crosses1 ? '#f59e0b' : m.color,
                      }}
                    />
                  )}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-background"
                    style={{
                      left: `calc(${pos(m.est)}% - 6px)`,
                      background: crosses1 ? '#f59e0b' : m.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-4 px-2">
        <span>{fmt(min, 2)}</span>
        <span>{fmt(max, 2)}</span>
      </div>
    </div>
  );
}