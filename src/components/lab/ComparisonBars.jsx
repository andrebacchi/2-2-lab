import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fmtInt, fmtPct } from '@/lib/format';

export default function ComparisonBars({ r, labels, reduceMotion }) {
  const [mode, setMode] = useState('pct'); // 'abs' | 'pct'
  const dur = reduceMotion ? 0 : 0.45;

  const expVal = r.a;
  const unexpVal = r.c;
  const expPct = r.riskExp;
  const unexpPct = r.riskUnexp;

  const maxAbs = Math.max(expVal, unexpVal, 1);

  const bars = [
    {
      key: 'exp',
      label: labels.exposureName ? `${labels.expYes} — ${labels.exposureName}` : 'Expostos',
      sub: `Desfecho: ${labels.outYes}`,
      abs: expVal,
      pct: expPct,
      total: r.totals.row1,
      color: 'bg-teal-700',
    },
    {
      key: 'unexp',
      label: labels.exposureName ? `${labels.expNo} — ${labels.exposureName}` : 'Não expostos',
      sub: `Desfecho: ${labels.outYes}`,
      abs: unexpVal,
      pct: unexpPct,
      total: r.totals.row2,
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

      <div className="flex items-end justify-center gap-8 sm:gap-16 h-64 px-4">
        {bars.map((bar) => {
          const heightPct =
            mode === 'abs' ? (bar.abs / maxAbs) * 100 : (bar.pct ?? 0) * 100;
          return (
            <div
              key={bar.key}
              className="flex flex-col items-center justify-end h-full w-24 sm:w-32"
            >
              <div className="text-sm font-semibold tabular-nums text-foreground mb-1">
                {mode === 'abs' ? fmtInt(bar.abs) : fmtPct(bar.pct, 1)}
              </div>
              <motion.div
                className={`w-full rounded-t-md ${bar.color} relative`}
                initial={false}
                animate={{ height: `${heightPct}%` }}
                transition={{ duration: dur, ease: 'easeOut' }}
                style={{ minHeight: 2 }}
              />
              <div className="mt-2 text-center">
                <div className="text-xs font-medium text-foreground">
                  {bar.label}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {bar.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground italic mt-4 text-center">
        Comparando a frequência do desfecho entre os dois grupos de exposição.
      </p>
    </div>
  );
}