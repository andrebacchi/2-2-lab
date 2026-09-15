import React from 'react';

const ACCENT = {
  teal: 'focus:border-teal-600 focus:bg-teal-50/40',
  slate: 'focus:border-slate-500 focus:bg-slate-50/40',
};

// Entrada numérica limpa — toque para digitar (abre teclado numérico no celular).
// Sem sliders nem botões extras para evitar alvos de toque acidentais.
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
      className={`w-full max-w-[88px] text-center text-2xl sm:text-xl font-semibold bg-transparent border-b-2 border-border ${ring} focus:outline-none text-foreground tabular-nums py-1`}
      aria-label="Valor da célula"
    />
  );
}