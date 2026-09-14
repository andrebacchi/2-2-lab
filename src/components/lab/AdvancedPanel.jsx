import React, { useState } from 'react';
import DiagnosticPanel from './DiagnosticPanel';
import McNemarPanel from './McNemarPanel';
import KappaPanel from './KappaPanel';
import ConfoundingPanel from './ConfoundingPanel';
import StratificationPanel from './StratificationPanel';

const SUB = [
  { key: 'dx', label: 'Diagnóstico', C: DiagnosticPanel },
  { key: 'mcnemar', label: 'McNemar', C: McNemarPanel },
  { key: 'kappa', label: 'Kappa', C: KappaPanel },
  { key: 'conf', label: 'Confundimento', C: ConfoundingPanel },
  { key: 'estrat', label: 'Estratificação', C: StratificationPanel },
];

export default function AdvancedPanel({ r }) {
  const [sub, setSub] = useState('dx');
  const Current = SUB.find((s) => s.key === sub).C;
  return (
    <div>
      <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1">
        {SUB.map((s) => (
          <button
            key={s.key}
            onClick={() => setSub(s.key)}
            className={`text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
              sub === s.key
                ? 'bg-foreground text-background border-foreground'
                : 'text-muted-foreground border-border hover:bg-accent'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <Current r={r} />
    </div>
  );
}