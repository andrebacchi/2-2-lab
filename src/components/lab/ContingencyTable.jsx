import React from 'react';
import CellControl from './CellControl';
import { fmtInt } from '@/lib/format';

const TotalCell = ({ value, label }) => (
  <div className="tot-flash flex flex-col items-center justify-center px-0.5 py-1.5 bg-muted/60 rounded-md">
    <span className="text-sm sm:text-lg font-semibold tabular-nums text-foreground">
      {fmtInt(value)}
    </span>
    {label && (
      <span className="text-[8px] uppercase tracking-wider text-muted-foreground mt-0.5">
        {label}
      </span>
    )}
  </div>
);

const NAME_INPUT =
  'font-display text-[13px] sm:text-sm font-medium text-center bg-transparent border-b border-dashed border-border focus:border-teal-600 focus:outline-none px-1 py-0.5 rounded text-foreground w-full';

// Células editáveis: retângulos horizontais (largas e baixas)
const CELL =
  'flex items-center justify-center min-w-0 py-1.5 px-0.5 rounded-md border border-border/60';

export default function ContingencyTable({
  values,
  setValues,
  labels,
  setLabels,
}) {
  const set = (key) => (v) => setValues({ ...values, [key]: v });
  const setLabel = (key) => (e) =>
    setLabels({ ...labels, [key]: e.target.value });

  const { a, b, c, d } = values;
  const t = {
    row1: a + b,
    row2: c + d,
    col1: a + c,
    col2: b + d,
    n: a + b + c + d,
  };

  return (
    <div className="rounded-xl border border-border bg-card p-3 sm:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="font-display text-base sm:text-lg font-semibold text-foreground">
          Tabela de contingência
        </h2>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          2 × 2
        </span>
      </div>

      {/* Nomes das variáveis (editáveis) — fora da grade, com fonte maior */}
      <div className="flex items-stretch justify-center gap-4 sm:gap-6 mb-3 sm:mb-4">
        <div className="flex flex-col items-center gap-0.5">
          <input
            value={labels.exposureName}
            onChange={setLabel('exposureName')}
            className={NAME_INPUT}
            aria-label="Nome da variável exposição"
          />
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
            linhas
          </span>
        </div>
        <span className="self-center text-muted-foreground text-sm">×</span>
        <div className="flex flex-col items-center gap-0.5">
          <input
            value={labels.outcomeName}
            onChange={setLabel('outcomeName')}
            className={NAME_INPUT}
            aria-label="Nome da variável desfecho"
          />
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
            colunas
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(2rem,auto)_1fr_1fr_minmax(2.2rem,auto)] gap-1.5 sm:gap-2">
        {/* Sub-cabeçalho Sim / Não / Total */}
        <div />
        <div className="text-center text-[11px] sm:text-xs font-medium text-muted-foreground">
          {labels.outYes}
        </div>
        <div className="text-center text-[11px] sm:text-xs font-medium text-muted-foreground">
          {labels.outNo}
        </div>
        <div className="text-center text-[9px] uppercase tracking-wider text-muted-foreground self-center">
          Total
        </div>

        {/* Linha Exposição Sim */}
        <div className="flex items-center justify-center text-[11px] sm:text-xs font-medium text-muted-foreground text-center">
          {labels.expYes}
        </div>
        <div className={CELL}>
          <CellControl value={a} onChange={set('a')} accent="teal" />
        </div>
        <div className={CELL}>
          <CellControl value={b} onChange={set('b')} accent="slate" />
        </div>
        <TotalCell value={t.row1} />

        {/* Linha Exposição Não */}
        <div className="flex items-center justify-center text-[11px] sm:text-xs font-medium text-muted-foreground text-center">
          {labels.expNo}
        </div>
        <div className={CELL}>
          <CellControl value={c} onChange={set('c')} accent="teal" />
        </div>
        <div className={CELL}>
          <CellControl value={d} onChange={set('d')} accent="slate" />
        </div>
        <TotalCell value={t.row2} />

        {/* Linha de totais */}
        <div className="text-center text-[9px] uppercase tracking-wider text-muted-foreground self-center pt-2 border-t border-border">
          Total
        </div>
        <div className="pt-2 border-t border-border">
          <TotalCell value={t.col1} />
        </div>
        <div className="pt-2 border-t border-border">
          <TotalCell value={t.col2} />
        </div>
        <div className="pt-2 border-t border-border">
          <TotalCell value={t.n} label="n" />
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-3 sm:mt-4 italic">
        Toque em um número para digitá-lo. Os rótulos das variáveis também são
        editáveis.
      </p>
    </div>
  );
}