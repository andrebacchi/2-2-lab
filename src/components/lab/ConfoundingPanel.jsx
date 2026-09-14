import React, { useState } from 'react';
import { ArrowRightLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { fmt } from '@/lib/format';

export default function ConfoundingPanel({ r }) {
  const crude = r.OR;
  const [adj, setAdj] = useState(crude !== null ? +crude.toFixed(2) : 1);

  const pctChange =
    crude !== null && crude !== 0 ? ((crude - adj) / crude) * 100 : null;
  const confounding = pctChange !== null && Math.abs(pctChange) >= 10;

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-foreground mb-1">
        Confundimento
      </h3>
      <p className="text-xs text-muted-foreground italic mb-4">
        Um confundidor distorce a associação entre exposição e desfecho. Compara
        a medida <b>bruta</b> com a <b>ajustada</b>: se mudam ≥ 10%, há evidência
        de confundimento.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch">
        <div className="rounded-lg border border-border bg-card px-3 py-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            OR bruta (desta tabela)
          </div>
          <div className="text-2xl font-semibold tabular-nums text-foreground">
            {crude !== null ? fmt(crude, 2) : 'Não estimável'}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card px-3 py-3 flex flex-col">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            OR ajustada (hipotética)
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.05"
              min="0"
              value={adj}
              onChange={(e) => setAdj(Number(e.target.value))}
              className="w-24 text-2xl font-semibold tabular-nums bg-transparent border-b-2 border-border focus:border-teal-600 focus:outline-none text-foreground"
            />
            <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-[10px] text-muted-foreground/70 mt-1">
            ajuste por um confundidor
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card px-3 py-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Mudança
          </div>
          <div className="text-2xl font-semibold tabular-nums text-foreground">
            {pctChange !== null ? `${fmt(pctChange, 1)}%` : '—'}
          </div>
        </div>
      </div>

      <div
        className={`flex items-center gap-2 rounded-lg border px-4 py-3 mt-4 ${
          confounding
            ? 'border-amber-300 bg-amber-50/60 text-amber-800'
            : 'border-emerald-300 bg-emerald-50/60 text-emerald-800'
        }`}
      >
        {confounding ? (
          <AlertTriangle className="w-4 h-4 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 shrink-0" />
        )}
        <p className="text-xs">
          {confounding
            ? 'Mudança ≥ 10%: evidência de confundimento. A estimativa bruta superestima ou subestima o efeito verdadeiro.'
            : 'Mudança < 10%: pouca evidência de confundimento — a estimativa bruta é razoavelmente estável.'}
        </p>
      </div>
    </div>
  );
}