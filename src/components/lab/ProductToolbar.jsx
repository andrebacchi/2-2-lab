import React from 'react';
import { Target, History, BookOpen } from 'lucide-react';

const BTN =
  'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors whitespace-nowrap';

export default function ProductToolbar({
  onChallenges,
  onDrawer,
  onTeach,
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button className={BTN} onClick={onChallenges}>
        <Target className="w-3.5 h-3.5" /> Desafios
      </button>
      <button className={BTN} onClick={onDrawer}>
        <History className="w-3.5 h-3.5" /> Análises
      </button>
      <button
        className={`${BTN} bg-foreground text-background border-foreground hover:bg-foreground/90 hover:text-background`}
        onClick={onTeach}
      >
        <BookOpen className="w-3.5 h-3.5" /> Como usar este aplicativo
      </button>
    </div>
  );
}