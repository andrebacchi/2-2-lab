import React from 'react';
import { fmt, fmtPct, ciText } from '@/lib/format';

function interpret(k) {
  if (k === null) return '—';
  if (k < 0) return 'Pior que o acaso';
  if (k <= 0.2) return 'Discreta';
  if (k <= 0.4) return 'Razoável';
  if (k <= 0.6) return 'Moderada';
  if (k <= 0.8) return 'Substancial';
  return 'Quase perfeita';
}

export default function KappaPanel({ r }) {
  const { a, b, c, d } = r;
  const n = a + b + c + d;
  const Po = n > 0 ? (a + d) / n : null;
  const Pe =
    n > 0
      ? ((a + b) * (a + c) + (c + d) * (b + d)) / (n * n)
      : null;
  const kappa =
    Po !== null && Pe !== null && Pe < 1 ? (Po - Pe) / (1 - Pe) : null;
  const SE =
    kappa !== null && Po !== null && Pe !== null && n > 0
      ? Math.sqrt((Po * (1 - Po)) / (n * (1 - Pe) ** 2))
      : null;
  const CI =
    SE !== null ? { low: kappa - 1.96 * SE, high: kappa + 1.96 * SE } : null;

  const metrics = [
    { label: 'Concordância observada (Po)', val: Po !== null ? fmtPct(Po, 1) : '—', sub: '(a+d)/n' },
    { label: 'Concordância esperada (Pe)', val: Pe !== null ? fmtPct(Pe, 1) : '—', sub: 'acaso' },
  ];

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-foreground mb-1">
        Kappa de Cohen (concordância)
      </h3>
      <p className="text-xs text-muted-foreground italic mb-4">
        Mede a concordância entre dois avaliadores, descontando o que já seria
        esperado só pelo acaso. a e d = concordância; b e c = discordância.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-lg border border-border bg-card px-3 py-2.5"
          >
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {m.label}
            </div>
            <div className="text-xl font-semibold tabular-nums text-foreground">
              {m.val}
            </div>
            <div className="text-[10px] text-muted-foreground/70 font-mono">
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-teal-200 bg-teal-50/50 px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-teal-700">
              κ
            </div>
            <div className="text-2xl font-semibold tabular-nums text-foreground">
              {kappa !== null ? fmt(kappa, 3) : '—'}
              {CI && (
                <span className="text-sm font-normal text-muted-foreground">
                  {' '}
                  [{ciText(CI, 3)}]
                </span>
              )}
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-teal-700 text-white font-medium">
            {interpret(kappa)}
          </span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground italic mt-4">
        κ = 0 é o esperado pelo acaso; κ = 1 é concordância perfeita. A escala de
        Landis &amp; Koch classifica a força da concordância.
      </p>
    </div>
  );
}