import React from 'react';

const ACCENT = {
  teal: 'focus:ring-teal-500/30',
  slate: 'focus:ring-slate-400/40',
};

// Entrada numérica limpa — toque para digitar (abre teclado numérico no celular).
export default function CellControl({ value, onChange, accent = 'teal' }) {
  const set = (v) => {
    let n = Math.round(Number(v));
    if (!Number.isFinite(n) || n < 0) n = 0;
    onChange(n);
  };
  const ring = ACCENT[accent] || ACCENT.teal;
  return (
    <input
      type="number"
      inputMode="numeric"
      min={0}
      value={value}
      onChange={(e) => set(e.target.value)}
      onFocus={(e) => e.target.select()}
      className={`w-full max-w-[120px] text-center text-2xl sm:text-xl font-semibold bg-transparent focus:outline-none focus:ring-2 ${ring} rounded text-foreground tabular-nums py-1`}
      aria-label="Valor da célula"
    />
  );
}