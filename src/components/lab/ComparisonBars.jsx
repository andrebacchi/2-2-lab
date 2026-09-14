import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fmtInt, fmtPct } from '@/lib/format';

export default function ComparisonBars({ r, labels, reduceMotion }) {
  const [mode, setMode] = useState('pct'); // 'abs' | 'pct'
  const dur = reduceMotion ? 0 : 0.45;

  const maxAbs = Math.max(r.a, r.c, 1);

  const bars = [
    {
      key: 'exp',
      label: labels.exposureName ? `${labels.expYes} — ${labels.exposureName}` : 'Expostos',
      sub: `Desfecho: ${labels.outYes}`,
      abs: r.a,
      pct: r.riskExp,
      total: r.totals.row1,
      ci: r.riskExpCI,
      color: 'bg-teal-700',
    },
    {
      key: 'unexp',
      label: labels.exposureName ? `${labels.expNo} — ${labels.exposureName}` : 'Não expostos',
      sub: `Desfecho: ${labels.outYes}`,
      abs: r.c,
      pct: r.riskUnexp,
      total: r.totals.row2,
      ci: r.riskUnexpCI,
      color: 'bg-teal-400',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base font-semibold text-foreground">
          Desfecho entre expostos vs. não expostos
        </h3>
        <div className="flex items-center gap-1 text-xs rounded-full border border-border p-0.5">
          {[
            { k: 'abs', l: 'Absoluto' },
            { k: 'pct', l: 'Porcentagem' },
          ].map((m) => (
            <button
              key={m.k}
              onClick={() => setMode(m.k)}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                mode === m.k
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              {m.l}
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full h-64">
        {/* linha de base 0% */}
        <div className="absolute inset-x-0 bottom-0 border-t border-border" />
        {mode === 'pct' && (
          <>
            <div className="absolute inset-x-0 top-0 border-t border-dashed border-border/60" />
            <span className="absolute -left-1 top-0 -translate-y-1/2 text-[9px] text-muted-foreground">100%</span>
            <span className="absolute -left-1 bottom-0 translate-y-1/2 text-[9px] text-muted-foreground">0%</span>
          </>
        )}

        {bars.map((bar, i) => {
          const center = i === 0 ? 27 : 73;
          const heightPct =
            mode === 'abs' ? (bar.abs / maxAbs) * 100 : (bar.pct ?? 0) * 100;
          const ci = bar.ci;
          const showWhisker =
            mode === 'pct' && ci && ci.low !== null && ci.high !== null;
          return (
            <React.Fragment key={bar.key}>
              <motion.div
                className="absolute bottom-0"
                style={{ left: `${center}%`, transform: 'translateX(-50%)' }}
                initial={false}
                animate={{ height: `${heightPct}%` }}
                transition={{ duration: dur, ease: 'easeOut' }}
              >
                <div
                  className={`w-16 sm:w-20 h-full rounded-t-md ${bar.color} relative`}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-semibold tabular-nums text-foreground whitespace-nowrap">
                    {mode === 'abs' ? fmtInt(bar.abs) : fmtPct(bar.pct, 1)}
                  </span>
                </div>
              </motion.div>

              {showWhisker && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: `${center}%`,
                    transform: 'translateX(-50%)',
                    bottom: `${ci.low * 100}%`,
                    height: `${(ci.high - ci.low) * 100}%`,
                  }}
                >
                  <div className="relative w-0.5 h-full bg-foreground/80 mx-auto">
                    <div className="absolute -left-[7px] top-0 w-4 h-0.5 bg-foreground/80" />
                    <div className="absolute -left-[7px] bottom-0 w-4 h-0.5 bg-foreground/80" />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* rótulos dos grupos */}
      <div className="flex justify-around mt-3">
        {bars.map((bar) => (
          <div key={bar.key} className="text-center w-32">
            <div className="text-xs font-medium text-foreground">{bar.label}</div>
            <div className="text-[10px] text-muted-foreground">{bar.sub}</div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground italic mt-4 text-center">
        {mode === 'pct'
          ? 'Barras = proporção do desfecho; whiskers = IC 95% (intervalo de Wilson).'
          : 'Comparando a frequência absoluta do desfecho entre os dois grupos.'}
      </p>
    </div>
  );
}