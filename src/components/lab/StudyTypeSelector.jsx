import React from 'react';
import { STUDY_TYPES, STUDY_ORDER } from '@/lib/studyTypes';

// Seletor compacto do desenho do estudo — fica junto à tabela 2×2.
export default function StudyTypeSelector({ type, setType }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Desenho do estudo
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STUDY_ORDER.map((key) => {
            const val = STUDY_TYPES[key];
            const TIcon = val.icon;
            const active = type === key;
            return (
              <button
                key={key}
                onClick={() => setType(key)}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-teal-700 text-white border-teal-700'
                    : 'text-muted-foreground border-border hover:bg-accent'
                }`}
              >
                <TIcon className="w-3.5 h-3.5" />
                {val.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}