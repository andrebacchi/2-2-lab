import React from 'react';
import { Bookmark, History } from 'lucide-react';
import { LAB_BTN } from './labButtons';

export default function ProductToolbar({ onSave, onDrawer }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button className={LAB_BTN} onClick={onSave}>
        <Bookmark /> Salvar análise
      </button>
      <button className={LAB_BTN} onClick={onDrawer}>
        <History /> Análises
      </button>
    </div>
  );
}
