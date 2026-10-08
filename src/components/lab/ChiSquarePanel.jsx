import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fmt, fmtP } from '@/lib/format';
import { Play } from 'lucide-react';
import StatLabLink from './StatLabLink';

export default function ChiSquarePanel({ r, labels, reduceMotion }) {
  const [playKey, setPlayKey] = useState(0);
  const cells = ['a', 'b', 'c', 'd'];
  const contribs = cells.map((k) => ({ k, v: r.contributions[k] }));
  const total = r.chi2;
  const dur = reduceMotion ? 0 : 0.5;
  const colors = ['bg-teal-700', 'bg-teal-600', 'bg-teal-500', 'bg-teal-400'];

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display text-base font-semibold text-foreground">
          Qui-quadrado de Pearson
        </h3>
        <button
          onClick={() => setPlayKey((k) => k + 1)}
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:bg-accent"
        >
          <Play className="w-3 h-3" /> Reproduzir
        </button>
      </div>
      <p className="text-xs text-muted-foreground italic mb-4">
        χ² = Σ (O−E)²/E. Cada célula contribui; a soma é o χ² total.
      </p>
      <div className="flex items-baseline gap-6 mb-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            χ²
          </span>
          <div className="text-2xl font-semibold tabular-nums">
            {fmt(total, 3)}
          </div>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            gl
          </span>
          <div className="text-2xl font-semibold">1</div>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            p
          </span>
          <div className="text-2xl font-semibold tabular-nums text-teal-700">
            {fmtP(r.pPearson)}
          </div>
        </div>
      </div>

      <div className="flex h-6 rounded-md overflow-hidden border border-border" key={playKey}>
        {contribs.map((c, i) => (
          <motion.div
            key={c.k}
            initial={{ width: 0 }}
            animate={{ width: `${(c.v / total) * 100}%` }}
            transition={{ duration: dur, delay: i * 0.15 }}
            className={`${colors[i]} flex items-center justify-center`}
            title={`${c.k}: ${fmt(c.v, 3)}`}
          >
            {(c.v / total) * 100 > 12 && (
              <span className="text-[10px] font-medium text-white">{c.k}</span>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 mt-3">
        {contribs.map((c) => (
          <div
            key={c.k}
            className="rounded-md border border-border bg-card px-2 py-2 text-center"
          >
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {c.k}
            </div>
            <div
              className="text-sm font-semibold tabular-nums"
              style={{ color: '#7a284b' }}
            >
              {fmt(c.v, 3)}
            </div>
          </div>
        ))}
      </div>
      <StatLabLink r={r} labels={labels} test="chi">
        Fazer este qui-quadrado no STAT LAB: distribuição de referência, frase
        para relatar e simulação de mil estudos
      </StatLabLink>
    </div>
  );
}
