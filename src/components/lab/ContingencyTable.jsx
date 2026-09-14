import React from 'react';
import CellControl from './CellControl';
import { fmtInt } from '@/lib/format';

const TotalCell = ({ value, label }) => (
  <div
    key={value}
    className="tot-flash flex flex-col items-center justify-center px-3 py-3 bg-muted/50 rounded-md"
  >
    <span className="text-xl font-semibold tabular-nums text-foreground">
      {fmtInt(value)}
    </span>
    {label && (
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
        {label}
      </span>
    )}
  </div>
);

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
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Tabela de contingência
        </h2>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          2 × 2
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[460px]">
          {/* Cabeçalho: nome do desfecho */}
          <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-end mb-2">
            <div />
            <div className="col-span-2 text-center">
              <input
                value={labels.outcomeName}
                onChange={setLabel('outcomeName')}
                className="font-display text-sm font-medium text-center bg-transparent border-b border-dashed border-border focus:border-teal-600 focus:outline-none px-2 py-0.5 rounded text-foreground w-full max-w-[260px] mx-auto"
                aria-label="Nome da variável desfecho"
              />
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                Desfecho
              </div>
            </div>
            <div />
          </div>

          {/* Sub-cabeçalho Sim / Não */}
          <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 mb-2">
            <div className="w-24" />
            <div className="text-center text-sm font-medium text-muted-foreground">
              {labels.outYes}
            </div>
            <div className="text-center text-sm font-medium text-muted-foreground">
              {labels.outNo}
            </div>
            <div className="w-20 text-center text-[10px] uppercase tracking-wider text-muted-foreground self-center">
              Total
            </div>
          </div>

          {/* Linha Exposição Sim */}
          <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 mb-2 items-stretch">
            <div className="flex flex-col items-center justify-center w-24">
              <input
                value={labels.exposureName}
                onChange={setLabel('exposureName')}
                className="font-display text-sm font-medium text-center bg-transparent border-b border-dashed border-border focus:border-teal-600 focus:outline-none px-1 py-0.5 rounded text-foreground w-full"
                aria-label="Nome da variável exposição"
              />
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                Exposição
              </div>
            </div>
            <div className="flex flex-col items-center justify-center py-2 px-2 rounded-md bg-teal-50/60 border border-teal-100">
              <div className="text-[10px] uppercase tracking-wider text-teal-700 mb-1">
                {labels.expYes}
              </div>
              <CellControl value={a} onChange={set('a')} accent="teal" />
            </div>
            <div className="flex flex-col items-center justify-center py-2 px-2 rounded-md bg-slate-50 border border-slate-100">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                {labels.expNo}
              </div>
              <CellControl value={b} onChange={set('b')} accent="slate" />
            </div>
            <TotalCell value={t.row1} />
          </div>

          {/* Linha Exposição Não */}
          <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 mb-2 items-stretch">
            <div className="w-24 flex items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground">
                {labels.expNo}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center py-2 px-2 rounded-md bg-teal-50/60 border border-teal-100">
              <div className="text-[10px] uppercase tracking-wider text-teal-700 mb-1">
                {labels.outYes}
              </div>
              <CellControl value={c} onChange={set('c')} accent="teal" />
            </div>
            <div className="flex flex-col items-center justify-center py-2 px-2 rounded-md bg-slate-50 border border-slate-100">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                {labels.outNo}
              </div>
              <CellControl value={d} onChange={set('d')} accent="slate" />
            </div>
            <TotalCell value={t.row2} />
          </div>

          {/* Linha de totais */}
          <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 pt-2 border-t border-border">
            <div className="w-24 text-center text-[10px] uppercase tracking-wider text-muted-foreground self-center">
              Total
            </div>
            <TotalCell value={t.col1} />
            <TotalCell value={t.col2} />
            <TotalCell value={t.n} label="n" />
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4 italic">
        Edite os rótulos das variáveis clicando nos nomes. Altere qualquer
        célula — tudo se atualiza instantaneamente.
      </p>
    </div>
  );
}