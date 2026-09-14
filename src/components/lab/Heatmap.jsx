import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fmt, fmtInt } from '@/lib/format';

const METRICS = [
  { key: 'freq', label: 'Frequência' },
  { key: 'contrib', label: 'Contribuição para χ²' },
  { key: 'resid', label: 'Resíduo padronizado' },
];

// escala divergente: negativo (vermelho) -> neutro -> positivo (teal)
function residColor(v) {
  if (v === null || !Number.isFinite(v)) return '#f1f5f9';
  const clamped = Math.max(-4, Math.min(4, v));
  const t = Math.abs(clamped) / 4;
  if (clamped >= 0) {
    // teal
    const l = 95 - t * 50;
    return `hsl(173 60% ${l}%)`;
  }
  const l = 95 - t * 45;
  return `hsl(0 70% ${l}%)`;
}

function freqColor(v, max) {
  if (v === null || max === 0) return '#f1f5f9';
  const t = v / max;
  const l = 96 - t * 45;
  return `hsl(173 55% ${l}%)`;
}

function contribColor(v, max) {
  if (v === null || max === 0) return '#f1f5f9';
  const t = v / max;
  const l = 96 - t * 50;
  return `hsl(173 60% ${l}%)`;
}

export default function Heatmap({ r, labels, reduceMotion }) {
  const [metric, setMetric] = useState('freq');
  const dur = reduceMotion ? 0 : 0.4;

  const cells = ['a', 'b', 'c', 'd'];
  const freqs = [r.a, r.b, r.c, r.d];
  const maxFreq = Math.max(...freqs, 1);
  const contribs = cells.map((k) => r.contributions[k]);
  const maxContrib = Math.max(...contribs.filter((v) => v !== null), 0.0001);
  const resids = cells.map((k) => r.stdResiduals[k]);

  const getValue = (k) => {
    if (metric === 'freq') return r[k];
    if (metric === 'contrib') return r.contributions[k];
    return r.stdResiduals[k];
  };

  const getColor = (k) => {
    if (metric === 'freq') return freqColor(r[k], maxFreq);
    if (metric === 'contrib') return contribColor(r.contributions[k], maxContrib);
    return residColor(r.stdResiduals[k]);
  };

  const formatVal = (k) => {
    const v = getValue(k);
    if (v === null || !Number.isFinite(v)) return '—';
    if (metric === 'freq') return fmtInt(v);
    return fmt(v, 2);
  };

  const grid = [
    { k: 'a', rowLabel: labels.expYes, colLabel: labels.outYes },
    { k: 'b', rowLabel: labels.expYes, colLabel: labels.outNo },
    { k: 'c', rowLabel: labels.expNo, colLabel: labels.outYes },
    { k: 'd', rowLabel: labels.expNo, colLabel: labels.outNo },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="font-display text-base font-semibold text-foreground">
          Heatmap
        </h3>
        <div className="flex items-center gap-1 text-xs rounded-full border border-border p-0.5">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                metric === m.key
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[auto_1fr_1fr] gap-1.5 text-xs">
        <div />
        <div className="text-center font-medium text-muted-foreground pb-1">
          {labels.outYes}
        </div>
        <div className="text-center font-medium text-muted-foreground pb-1">
          {labels.outNo}
        </div>

        <div className="flex items-center pr-2 font-medium text-muted-foreground">
          {labels.expYes}
        </div>
        {grid.slice(0, 2).map((c) => (
          <motion.div
            key={c.k}
            initial={false}
            animate={{ backgroundColor: getColor(c.k) }}
            transition={{ duration: dur }}
            className="rounded-md h-24 flex flex-col items-center justify-center border border-border"
          >
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {c.k}
            </span>
            <span className="text-lg font-semibold tabular-nums text-foreground">
              {formatVal(c.k)}
            </span>
          </motion.div>
        ))}

        <div className="flex items-center pr-2 font-medium text-muted-foreground">
          {labels.expNo}
        </div>
        {grid.slice(2, 4).map((c) => (
          <motion.div
            key={c.k}
            initial={false}
            animate={{ backgroundColor: getColor(c.k) }}
            transition={{ duration: dur }}
            className="rounded-md h-24 flex flex-col items-center justify-center border border-border"
          >
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {c.k}
            </span>
            <span className="text-lg font-semibold tabular-nums text-foreground">
              {formatVal(c.k)}
            </span>
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground italic mt-3">
        {metric === 'freq' &&
          'Intensidade proporcional à frequência observada em cada célula.'}
        {metric === 'contrib' &&
          'Células mais escuras contribuem mais para o χ² total.'}
        {metric === 'resid' &&
          'Teal = acima do esperado; vermelho = abaixo do esperado; neutro = próximo do esperado.'}
      </p>
    </div>
  );
}