import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { fmtInt } from '@/lib/format';
import { rescaleTable, MIN_N } from '@/lib/stats';

function TotalItem({ label, value, sub }) {
  return (
    <div
      key={value}
      className="tot-flash flex flex-col items-center justify-center px-3 py-3 bg-muted/50 rounded-md"
    >
      <span className="text-xl font-semibold tabular-nums text-foreground">
        {fmtInt(value)}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
        {label}
      </span>
      {sub && (
        <span className="text-[10px] text-muted-foreground/70">{sub}</span>
      )}
    </div>
  );
}

function NTotalEditor({ values, setValues }) {
  const n = values.a + values.b + values.c + values.d;
  const setN = (newN) => {
    let m = Math.round(Number(newN));
    if (!Number.isFinite(m) || m < MIN_N) m = MIN_N;
    setValues(rescaleTable(values, m));
  };
  const sliderMax = Math.max(200, Math.ceil((n + 20) / 10) * 10);
  const atMin = n <= MIN_N;

  // draft evita redimensionar a cada tecla — só aplica em blur/Enter
  const [draft, setDraft] = useState(null);
  const commit = () => {
    if (draft !== null && draft !== '') {
      const m = Number(draft);
      if (Number.isFinite(m)) setN(m);
    }
    setDraft(null);
  };
  const inputValue = draft !== null ? draft : String(n);

  return (
    <div className="flex flex-col items-center justify-center px-3 py-3 bg-teal-50/70 border border-teal-200 rounded-md">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setN(n - 1)}
          disabled={atMin}
          className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Diminuir n"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <input
          type="number"
          min={MIN_N}
          value={inputValue}
          onFocus={() => setDraft(String(n))}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur();
          }}
          className="w-16 text-center text-xl font-semibold bg-transparent border-b-2 border-transparent focus:border-teal-600 focus:outline-none text-foreground tabular-nums"
          aria-label="Total n"
        />
        <button
          onClick={() => setN(n + 1)}
          className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0"
          aria-label="Aumentar n"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      <span className="text-[10px] uppercase tracking-wider text-teal-700 mt-1">
        Total · n
      </span>
      <input
        type="range"
        min={MIN_N}
        max={sliderMax}
        value={Math.min(n, sliderMax)}
        onChange={(e) => setN(e.target.value)}
        className="w-full max-w-[120px] accent-teal-700 h-1 mt-2 cursor-pointer"
        aria-label="Controle deslizante do total n"
      />
      <span className="text-[10px] text-muted-foreground/80 mt-1">
        redimensiona proporcional · mínimo {MIN_N}
      </span>
    </div>
  );
}

export default function TotalsPanel({ r, values, setValues }) {
  const { totals: t } = r;
  return (
    <section className="rounded-xl border border-border bg-background p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Totais
        </h3>
        <span className="text-[11px] text-muted-foreground italic hidden sm:block">
          Alterar n redimensiona a tabela preservando as proporções
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <TotalItem label="Expostos" value={t.exposed} sub="a + b" />
        <TotalItem label="Não expostos" value={t.unexposed} sub="c + d" />
        <TotalItem label="Com desfecho" value={t.withOutcome} sub="a + c" />
        <TotalItem label="Sem desfecho" value={t.withoutOutcome} sub="b + d" />
        <NTotalEditor values={values} setValues={setValues} />
      </div>
    </section>
  );
}