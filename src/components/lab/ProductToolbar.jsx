import React from 'react';
import { Bookmark, History, BookOpen } from 'lucide-react';

const BTN =
  'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors whitespace-nowrap';

export default function ProductToolbar({ onSave, onDrawer, onTeach }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-teal-700 text-white border border-teal-700 hover:bg-teal-800 transition-colors whitespace-nowrap"
        onClick={onSave}
      >
        <Bookmark className="w-3.5 h-3.5" /> Salvar análise
      </button>
      <button className={BTN} onClick={onDrawer}>
        <History className="w-3.5 h-3.5" /> Análises
      </button>
      <button className={BTN} onClick={onTeach}>
        <BookOpen className="w-3.5 h-3.5" /> Como usar
      </button>
    </div>
  );
}