import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronRight, Hand, Edit3, LayoutGrid } from 'lucide-react';

const STORAGE_KEY = '2x2lab_onboarding_v1';

const STEPS = [
  {
    icon: Hand,
    title: 'Toque para digitar os números',
    body: 'As quatro células centrais (a, b, c, d) são editáveis. Toque em qualquer número e digite o valor — as estatísticas e os gráficos se atualizam na hora.',
  },
  {
    icon: Edit3,
    title: 'Renomeie as variáveis',
    body: 'Os rótulos "Exposição" e "Desfecho" acima da tabela também são editáveis. Toque neles e digite, por exemplo, "Tabagismo" e "Câncer". Os gráficos passam a usar seus nomes.',
  },
  {
    icon: LayoutGrid,
    title: 'Troque de visualização',
    body: 'No menu suspenso abaixo da tabela (ou nas abas, no desktop) você navega entre Grupos, Proporções, IC, χ², Contexto e Testes diagnósticos. Cada uma mostra um recorte diferente dos mesmos quatro números.',
  },
];

export default function FirstTimeOnboarding() {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setOpen(true);
      }
    } catch {
      // localStorage indisponível — não mostra
    }
  }, []);

  const finish = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignora
    }
    setOpen(false);
  };

  const step = STEPS[i];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && finish()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <step.icon className="w-4 h-4 text-teal-700" />
            {step.title}
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-foreground/80 leading-relaxed">{step.body}</p>

        <div className="flex items-center justify-between mt-1">
          <div className="flex gap-1.5">
            {STEPS.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === i ? 'bg-teal-700' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={finish}>
              Pular
            </Button>
            {i < STEPS.length - 1 ? (
              <Button size="sm" onClick={() => setI(i + 1)}>
                Próximo <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button size="sm" onClick={finish}>
                Começar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}