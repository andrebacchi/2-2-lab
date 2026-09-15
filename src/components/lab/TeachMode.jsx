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
    title: 'Cabeçalho e acessibilidade',
    body: 'No topo ficam o título do app e o crédito do autor. Os botões "Reduzir animações" e "Alto contraste" ajustam a interface para maior conforto visual.',
  },
  {
    title: 'Exemplos pré-definidos',
    body: 'A barra de exemplos carrega cenários prontos (associação forte, nula, protetora etc.) para você partir de um ponto conhecido antes de explorar.',
  },
  {
    title: 'Cartões de resumo',
    body: 'Logo abaixo da tabela, os cartões mostram N (total), P(desfecho|expostos), P(desfecho|não expostos), RR/OR com seus IC 95% — o essencial num relance.',
  },
  {
    title: 'Tabela de contingência',
    body: 'As linhas representam a exposição e as colunas o desfecho: "a" = expostos com desfecho, "d" = não expostos sem desfecho. Toque em qualquer número para digitá-lo; os rótulos das variáveis também são editáveis.',
  },
  {
    title: 'Totais e redimensionamento',
    body: 'O painel de totais mostra expostos, não expostos, com/sem desfecho. Alterar o total n redimensiona a tabela preservando as proporções entre as células.',
  },
  {
    title: 'Aba Grupos',
    body: 'Barras que comparam o risco (proporção com desfecho) entre expostos e não expostos, com opção de valores absolutos ou percentuais e IC 95%. Permite ver a diferença visualmente.',
  },
  {
    title: 'Aba Proporções',
    body: 'Painel que mostra cada célula como proporção, com seletor de perspectiva (por linha, por coluna ou pelo total). A mesma célula responde a perguntas diferentes conforme o denominador.',
  },
  {
    title: 'Aba IC e Forest',
    body: '"IC" exibe os intervalos de confiança de RR, OR e RD; "Forest" mostra o gráfico em floresta (forest plot) com a estimativa central e os limites do IC.',
  },
  {
    title: 'Aba Esperado e χ²',
    body: '"Esperado" mostra as frequências esperadas sob a hipótese nula; "χ²" apresenta o teste qui-quadrado de Pearson com as contribuições de cada célula.',
  },
  {
    title: 'Aba Distribuição e Testes',
    body: '"Distribuição" desenha a curva do χ² com a estatística observada; "Testes" compara Pearson, Yates (correção de continuidade), G-test (razão de verossimilhanças) e Fisher exato.',
  },
  {
    title: 'Aba Explicação',
    body: 'Resíduos padronizados (quais células fogem do esperado) e uma análise de sensibilidade do p-valor em relação ao tamanho amostral n.',
  },
  {
    title: 'Aba Contexto',
    body: 'Escolha o desenho do estudo (coorte, caso-controle, transversal, ensaio clínico). O desenho determina quais medidas são válidas — caso-controle, por exemplo, admite apenas OR; ensaios mostram RRR, RAR e NNT.',
  },
  {
    title: 'Aba Testes diagnósticos',
    body: 'Módulos de diagnóstico (sensibilidade, especificidade, VPP/VPN e nomograma de Fagan), McNemar (dados pareados), Kappa (concordância), confundimento e estratificação de Mantel-Haenszel.',
  },
  {
    title: 'Ferramentas e fim',
    body: '"Desafios" propõe objetivos para testar seu entendimento; "Análises" salva tabelas e mantém um histórico; "Modo foco" oculta elementos periféricos. Bom estudo!',
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
            <BookOpen className="w-4 h-4 text-teal-700" /> Como usar este aplicativo
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