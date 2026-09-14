import { useState, useEffect, useRef } from 'react';
import { load, save } from '@/lib/storage';

// Histórico automático (debounced) + análises nomeadas, persistidos no navegador.
export function useLabStore(values, labels) {
  const [history, setHistory] = useState(() => load('history', []));
  const [saved, setSaved] = useState(() => load('saved', []));
  const last = useRef(JSON.stringify(values));

  useEffect(() => {
    const t = setTimeout(() => {
      const sig = JSON.stringify(values);
      if (sig === last.current) return;
      last.current = sig;
      const snap = {
        id: Date.now(),
        ts: Date.now(),
        values: { ...values },
        labels: { ...labels },
      };
      setHistory((prev) => {
        const next = [snap, ...prev].slice(0, 30);
        save('history', next);
        return next;
      });
    }, 600);
    return () => clearTimeout(t);
  }, [values, labels]);

  const saveSnapshot = (name) => {
    const snap = {
      id: Date.now(),
      name,
      ts: Date.now(),
      values: { ...values },
      labels: { ...labels },
    };
    setSaved((prev) => {
      const next = [snap, ...prev].slice(0, 50);
      save('saved', next);
      return next;
    });
  };

  const removeSaved = (id) => {
    setSaved((prev) => {
      const next = prev.filter((s) => s.id !== id);
      save('saved', next);
      return next;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    save('history', []);
  };

  return { history, saved, saveSnapshot, removeSaved, clearHistory };
}