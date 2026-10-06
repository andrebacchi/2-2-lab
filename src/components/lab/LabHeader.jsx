import React from 'react';
import { Contrast, BookOpen } from 'lucide-react';
import AddToHomeScreenButton from './AddToHomeScreenButton';
import { LAB_BTN, LAB_BTN_PRIMARY } from './labButtons';

// Cabeçalho no padrão da série LAB: link de volta ao BACCHI LAB e nome à esquerda, Instalar e Como usar à direita
export default function LabHeader({ highContrast, setHighContrast, onTeach }) {
  return (
    <header className="max-w-[1400px] mx-auto px-5 sm:px-8 pt-[18px] pb-2.5 flex items-center justify-between gap-3 flex-wrap">
      <div className="min-w-0">
        <a
          href="https://andrebacchi.github.io/bacchilab/"
          className="inline-flex items-center min-h-[28px] -mt-1.5 mb-1 text-[11.5px] leading-none font-semibold uppercase tracking-[0.16em] text-muted-foreground no-underline hover:text-teal-700"
        >
          ‹ BACCHI LAB
        </a>
        <h1 className="font-display text-[34px] leading-none font-semibold tracking-[-0.01em] text-foreground whitespace-nowrap">
          2×2 <span className="text-teal-700">LAB</span>
        </h1>
        <p className="mt-[5px] text-xs text-muted-foreground">Criado por André D. Bacchi</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setHighContrast(!highContrast)}
          aria-pressed={highContrast}
          title="Modo de alto contraste"
          className={highContrast ? LAB_BTN.replace('bg-card', 'bg-foreground').replace('text-foreground', 'text-background') : LAB_BTN}
        >
          <Contrast /> <span className="hidden sm:inline">Alto contraste</span>
        </button>
        <AddToHomeScreenButton />
        <button className={LAB_BTN_PRIMARY} onClick={onTeach}>
          <BookOpen /> Como usar
        </button>
      </div>
    </header>
  );
}
