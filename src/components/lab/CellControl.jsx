import React from 'react';
import { Minus, Plus } from 'lucide-react';

const ACCENT_MAP = {
  teal: { focus: 'focus:border-teal-600', slider: 'accent-teal-700' },
  slate: { focus: 'focus:border-slate-500', slider: 'accent-slate-500' },
};

export default function CellControl({ value, onChange, accent = 'teal' }) {
  const set = (v) => {
    let n = Math.round(Number(v));
    if (!Number.isFinite(n) || n < 0) n = 0;
    onChange(n);
  };

  const sliderMax = Math.max(100, Math.ceil((value + 10) / 10) * 10);
  const ac = ACCENT_MAP[accent] || ACCENT_MAP.teal;

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => set(value - 1)}
          className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0"
          aria-label="Diminuir"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => set(e.target.value)}
          className={`w-16 text-center text-xl font-semibold bg-transparent border-b-2 border-transparent ${ac.focus} focus:outline-none text-foreground tabular-nums`}
          aria-label="Valor da célula"
        />
        <button
          onClick={() => set(value + 1)}
          className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0"
          aria-label="Aumentar"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      <input
        type="range"
        min={0}
        max={sliderMax}
        value={Math.min(value, sliderMax)}
        onChange={(e) => set(e.target.value)}
        className={`w-full max-w-[140px] ${ac.slider} h-1 cursor-pointer`}
        aria-label="Controle deslizante da célula"
      />
    </div>
  );
}