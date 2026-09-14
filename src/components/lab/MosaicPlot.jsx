import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fmtInt, fmtPct } from '@/lib/format';

export default function MosaicPlot({ r, labels, reduceMotion }) {
  const [hover, setHover] = useState(null);
  const dur = reduceMotion ? 0 : 0.5;
  const n = r.totals.n;

  const row1 = r.totals.row1;
  const row2 = r.totals.row2;
  const wExp = n > 0 ? (row1 / n) * 100 : 0;
  const wUnexp = n > 0 ? (row2 / n) * 100 : 0;

  // dentro de cada banda, sim (desfecho) embaixo, não em cima
  const expYes = row1 > 0 ? (r.a / row1) * 100 : 0;
  const expNo = row1 > 0 ? (r.b / row1) * 100 : 0;
  const unexpYes = row2 > 0 ? (r.c / row2) * 100 : 0;
  const unexpNo = row2 > 0 ? (r.d / row2) * 100 : 0;

  const cells = [
    { key: 'a', label: 'a', val: r.a, pct: n > 0 ? r.a / n : 0, x: 0, w: wExp, y: 100 - expYes, h: expYes, color: 'bg-teal-700', text: 'text-white' },
    { key: 'b', label: 'b', val: r.b, pct: n > 0 ? r.b / n : 0, x: 0, w: wExp, y: 0, h: expNo, color: 'bg-slate-300', text: 'text-slate-700' },
    { key: 'c', label: 'c', val: r.c, pct: n > 0 ? r.c / n : 0, x: wExp, w: wUnexp, y: 100 - unexpYes, h: unexpYes, color: 'bg-teal-700', text: 'text-white' },
    { key: 'd', label: 'd', val: r.d, pct: n > 0 ? r.d / n : 0, x: wExp, w: wUnexp, y: 0, h: unexpNo, color: 'bg-slate-300', text: 'text-slate-700' },
  ];

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-foreground mb-1">
        Mosaic plot
      </h3>
      <p className="text-xs text-muted-foreground italic mb-4">
        A área de cada região representa a frequência da célula. Largura =
        exposição; altura = desfecho.
      </p>

      <div className="relative w-full h-64 rounded-lg border border-border bg-card overflow-hidden">
        {n === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            Tabela vazia — construa a tabela para ver o mosaic.
          </div>
        ) : (
          cells.map((c) => (
            <motion.div
              key={c.key}
              initial={false}
              animate={{
                left: `${c.x}%`,
                width: `${c.w}%`,
                top: `${c.y}%`,
                height: `${c.h}%`,
              }}
              transition={{ duration: dur, ease: 'easeOut' }}
              onMouseEnter={() => setHover(c.key)}
              onMouseLeave={() => setHover(null)}
              className={`absolute ${c.color} ${c.text} flex items-center justify-center cursor-pointer border border-background/40`}
              style={{ boxSizing: 'border-box' }}
            >
              {c.h > 12 && c.w > 8 && (
                <span className="text-xs font-medium tabular-nums">
                  {fmtInt(c.val)}
                </span>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* tooltip / legenda */}
      <div className="mt-3 min-h-[20px] text-xs text-muted-foreground">
        {hover ? (
          <span>
            Célula <span className="font-semibold text-foreground">{hover}</span> —{' '}
            n = {fmtInt(r[hover])} ({fmtPct(r[hover] / (n || 1), 1)} do total)
          </span>
        ) : (
          <span className="italic">Passe o cursor sobre uma região.</span>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 mt-2 text-xs">
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