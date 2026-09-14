import React from 'react';
import { PRESETS } from '@/lib/stats';

export default function PresetBar({ onLoad }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <span className="text-xs text-muted-foreground shrink-0">Exemplos:</span>
      {PRESETS.map((p) => (
        <button
          key={p.key}
          onClick={() => onLoad(p)}
          title={p.desc}
          className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:bg-accent hover:text-foreground whitespace-nowrap transition-colors"
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}