import React from 'react';

const ACCENT = {
  teal: 'focus:ring-teal-500/30',
  slate: 'focus:ring-slate-400/40',
};

// Entrada numérica limpa — toque para digitar (abre teclado numérico no celular).
// Usamos type="text" + inputMode para evitar as setas e a área reservada do
// input number, que cortam números de 3 dígitos em telas estreitas.
export default function CellControl({ value, onChange, accent = 'teal' }) {
  const set = (v) => {
    const digits = String(v).replace(/\D/g, '');
    let n = Math.round(Number(digits));
    if (!Number.isFinite(n) || n < 0) n = 0;
    onChange(n);
  };
  const ring = ACCENT[accent] || ACCENT.teal;
  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      size={1}
      value={value}
      onChange={(e) => set(e.target.value)}
      onFocus={(e) => e.target.select()}
      className={`w-full text-center text-lg sm:text-xl font-semibold bg-transparent focus:outline-none focus:ring-2 ${ring} rounded text-foreground tabular-nums px-1 py-1 min-w-0`}
      aria-label="Valor da célula"
    />
  );
}