import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Target, CheckCircle2, Circle, RotateCcw } from 'lucide-react';
import { load, save } from '@/lib/storage';

const CHALLENGES = [
  {
    id: 'forte',
    title: 'Associação forte e significante',
    desc: 'RR ≥ 2 e p < 0,05',
    check: (r) =>
      r.RR !== null && r.RR >= 2 && r.pPearson !== null && r.pPearson < 0.05,
  },
  {
    id: 'sem',
    title: 'Nenhuma associação',
    desc: 'χ² < 0,5',
    check: (r) => r.chi2 < 0.5,
  },
  {
    id: 'protetor',
    title: 'Efeito protetor',
    desc: 'RR < 1 e IC 95% inteiro à esquerda de 1',
    check: (r) =>
      r.RR !== null &&
      r.RR < 1 &&
      r.RRCI &&
      r.RRCI.high !== null &&
      r.RRCI.high < 1,
  },
  {
    id: 'incerto',
    title: 'Resultado inconclusivo',
    desc: 'IC 95% do RR contém 1',
    check: (r) =>
      r.RRCI &&
      r.RRCI.low !== null &&
      r.RRCI.high !== null &&
      r.RRCI.low <= 1 &&
      r.RRCI.high >= 1,
  },
  {
    id: 'poder',
    title: 'Amostra com poder',
    desc: 'p < 0,01 mesmo com efeito fraco (φ < 0,3)',
    check: (r) =>
      r.pPearson !== null &&
      r.pPearson < 0.01 &&
      r.phi !== null &&
      r.phi < 0.3,
  },
  {
    id: 'fisher',
    title: 'Hora do Fisher',
    desc: 'alguma frequência esperada < 5',
    check: (r) =>
      [r.expected.a, r.expected.b, r.expected.c, r.expected.d].some(
        (e) => e !== null && e < 5
      ),
  },
];

export default function ChallengesModal({ open, onOpenChange, r }) {
  const [done, setDone] = useState(() => load('challenges_done', {}));

  useEffect(() => {
    if (!open || !r) return;
    let changed = false;
    const next = { ...done };
    for (const c of CHALLENGES) {
      try {
        if (c.check(r) && !next[c.id]) {
          next[c.id] = true;
          changed = true;
        }
      } catch {
        /* ignore */
      }
    }
    if (changed) {
      setDone(next);
      save('challenges_done', next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, r]);

  const count = CHALLENGES.filter((c) => done[c.id]).length;
  const reset = () => {
    setDone({});
    save('challenges_done', {});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-4 h-4 text-teal-700" /> Desafios
          </DialogTitle>
          <DialogDescription>
            Ajuste a tabela para atingir cada objetivo. O progresso fica salvo
            no navegador.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-muted-foreground">
            Concluídos:{' '}
            <span className="font-semibold text-foreground">
              {count}/{CHALLENGES.length}
            </span>
          </div>
          <button
            onClick={reset}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reiniciar
          </button>
        </div>

        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-teal-600 transition-all"
            style={{ width: `${(count / CHALLENGES.length) * 100}%` }}
          />
        </div>

        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
          {CHALLENGES.map((c) => {
            const ok = !!done[c.id];
            return (
              <div
                key={c.id}
                className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 ${
                  ok ? 'border-teal-300 bg-teal-50/50' : 'border-border bg-card'
                }`}
              >
                {ok ? (
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {c.title}
                  </div>
                  <div className="text-xs text-muted-foreground">{c.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}