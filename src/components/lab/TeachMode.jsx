import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

const STEPS = [
  {
    title: 'Bem-vindo ao 2×2 LAB',
    body: 'Um laboratório para explorar tabelas de contingência 2×2. Você manipula quatro números (a, b, c, d) e vê, em tempo real, todas as estatísticas e visualizações derivarem deles.',
  },
  {
    title: 'A tabela 2×2',
    body: 'As linhas costumam representar a exposição e as colunas o desfecho. "a" = expostos com desfecho, "d" = não expostos sem desfecho. Edite os valores ou os rótulos diretamente nas células.',
  },
  {
    title: 'Medidas de associação',
    body: 'Os cartões de resumo mostram RR (risco relativo), OR (odds ratio) e RD (diferença de risco), cada um com seu IC 95%. Veja também a aba "Grupos" para comparar as proporções graficamente.',
  },
  {
    title: 'Incerteza e inferência',
    body: 'As abas "IC", "χ²" e "Distribuição" mostram os intervalos de confiança e os testes de hipótese. O p-valor mede a evidência contra H0 (sem associação).',
  },
  {
    title: 'Contexto do estudo',
    body: 'A aba "Contexto" deixa você escolher o desenho (coorte, caso-controle, transversal, ensaio). O desenho determina qual medida é válida — caso-controle, por exemplo, só admite OR.',
  },
  {
    title: 'Explore',
    body: 'Use "Desafios" para testar seu entendimento, "Análises" para salvar e revisar tabelas, e "Modo foco" para eliminar distrações. Bom estudo!',
  },
];

export default function TeachMode({ open, onOpenChange }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (open) setI(0);
  }, [open]);
  const step = STEPS[i];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-700" /> Modo aula
          </DialogTitle>
          <DialogDescription>
            Passo {i + 1} de {STEPS.length}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-[120px]">
          <h4 className="font-display text-base font-semibold text-foreground mb-2">
            {step.title}
          </h4>
          <p className="text-sm text-foreground/80 leading-relaxed">{step.body}</p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setI(Math.max(0, i - 1))}
            disabled={i === 0}
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </Button>
          <div className="flex gap-1">
            {STEPS.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full ${
                  idx === i ? 'bg-teal-700' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          {i < STEPS.length - 1 ? (
            <Button size="sm" onClick={() => setI(i + 1)}>
              Próximo <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button size="sm" onClick={() => onOpenChange(false)}>
              Concluir
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}