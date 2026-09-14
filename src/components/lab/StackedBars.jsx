import React from 'react';
import { motion } from 'framer-motion';
import { fmtPct, fmtInt } from '@/lib/format';

export default function StackedBars({ r, labels, reduceMotion }) {
  const dur = reduceMotion ? 0 : 0.45;

  const groups = [
    {
      key: 'exp',
      label: labels.expYes,
      sub: labels.exposureName,
      yes: r.a,
      no: r.b,
      total: r.totals.row1,
    },
    {
      key: 'unexp',
      label: labels.expNo,
      sub: labels.exposureName,
      yes: r.c,
      no: r.d,
      total: r.totals.row2,
    },
  ];

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-foreground mb-1">
        Barras 100% empilhadas
      </h3>
      <p className="text-xs text-muted-foreground italic mb-4">
        Cada grupo representa 100% — dividido entre desfecho sim e não.
      </p>

      <div className="flex items-end justify-center gap-8 sm:gap-16 h-64 px-4">
        {groups.map((g) => {
          const yesPct = g.total > 0 ? (g.yes / g.total) * 100 : 0;
          const noPct = g.total > 0 ? (g.no / g.total) * 100 : 0;
          return (
            <div
              key={g.key}
              className="flex flex-col items-center h-full w-24 sm:w-32"
            >
              <div className="flex flex-col w-full h-full justify-end rounded-md overflow-hidden border border-border">
                <motion.div
                  className="w-full bg-slate-300 flex items-start justify-center pt-1"
                  initial={false}
                  animate={{ height: `${noPct}%` }}
                  transition={{ duration: dur, ease: 'easeOut' }}
                >
                  {noPct > 8 && (
                    <span className="text-[10px] font-medium text-slate-700">
                      {fmtPct(g.no / g.total, 0)}
                    </span>
                  )}
                </motion.div>
                <motion.div
                  className="w-full bg-teal-700 flex items-end justify-center pb-1"
                  initial={false}
                  animate={{ height: `${yesPct}%` }}
                  transition={{ duration: dur, ease: 'easeOut' }}
                >
                  {yesPct > 8 && (
                    <span className="text-[10px] font-medium text-white">
                      {fmtPct(g.yes / g.total, 0)}
                    </span>
                  )}
                </motion.div>
              </div>
              <div className="mt-2 text-center">
                <div className="text-xs font-medium text-foreground">
                  {g.label}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  n = {fmtInt(g.total)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-teal-700" />
          {labels.outYes}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-slate-300" />
          {labels.outNo}
        </span>
      </div>
    </div>
  );
}