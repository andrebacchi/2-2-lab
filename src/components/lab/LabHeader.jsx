import React from 'react';
import { Contrast } from 'lucide-react';

export default function LabHeader({ highContrast, setHighContrast }) {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-3 min-w-0">
          <div className="min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground whitespace-nowrap">
              2×2 <span className="text-teal-700">LAB</span>
            </h1>
            <p className="text-[11px] text-muted-foreground/80 font-body">Criado por André D. Bacchi@bacchi.andre

            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setHighContrast(!highContrast)}
            aria-pressed={highContrast}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border transition-colors ${
            highContrast ?
            'bg-foreground text-background border-foreground' :
            'text-muted-foreground border-border hover:bg-accent'}`
            }
            title="Modo de alto contraste">
            
            <Contrast className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Alto contraste</span>
          </button>
        </div>
      </div>
    </header>);

}