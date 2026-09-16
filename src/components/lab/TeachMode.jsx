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
    body: 'Um laboratório para explorar tabelas de contingência 2×2. Você manipula quatro números (a, b, c, d) e vê, em tempo real, todas as estatísticas e visualizações derivarem deles — pensado para uso em aulas de epidemiologia, inclusive no celular.',
  },
  {
    title: 'Cabeçalho e acessibilidade',
    body: 'No topo ficam o título do app. O botão "Alto contraste" ajusta a interface para maior conforto visual; ao lado estão as ferramentas (Salvar análise, Análises e este guia).',
  },
  {
    title: 'Exemplos pré-definidos',
    body: 'Logo no início da coluna principal, a barra de exemplos carrega cenários prontos (zerar, associação forte, nula, protetora etc.) para você partir de um ponto conhecido antes de explorar.',
  },
  {
    title: 'Desenho do estudo',
    body: 'Abaixo dos exemplos, escolha o desenho: coorte, caso-controle, transversal ou ensaio clínico. O desenho determina quais medidas são válidas — ao escolher caso-controle, por exemplo, a interface já sinaliza que OR é a medida correta e RR não se aplica.',
  },
  {
    title: 'Tabela de contingência',
    body: 'As linhas representam a exposição e as colunas o desfecho: "a" = expostos com desfecho, "d" = não expostos sem desfecho. Toque em qualquer número para digitá-lo; os rótulos das variáveis também são editáveis.',
  },
  {
    title: 'Cartões de resumo',
    body: 'Logo abaixo da tabela, os cartões mostram N (total), P(desfecho|expostos), P(desfecho|não expostos), RR/OR com IC 95%. Cada medida traz um selo — Recomendada, Possível ou Não aplicável — conforme o desenho selecionado, reforçando a lição central de qual medida usar.',
  },
  {
    title: 'Totais e redimensionamento',
    body: 'O painel de totais mostra expostos, não expostos, com/sem desfecho. Alterar o total n redimensiona a tabela preservando as proporções entre as células.',
  },
  {
    title: 'Painel de Proporções',
    body: 'Abaixo da tabela, em largura total, o painel mostra cada célula como proporção, com seletor de perspectiva (por linha, por coluna ou pelo total). A mesma célula responde a perguntas diferentes conforme o denominador.',
  },
  {
    title: 'Visualizações em 3 eixos',
    body: 'Ao lado da tabela, as visualizações estão organizadas em três eixos de alto nível: Associação, Inferência e Aplicação clínica. Escolha o eixo e, dentro dele, a opção desejada — bem mais fácil de navegar no celular.',
  },
  {
    title: 'Eixo Associação',
    body: 'Grupos (barras comparando o risco entre expostos e não expostos), IC (intervalos de confiança de RR, OR e RD) e Forest (gráfico em floresta com a estimativa central e os limites do IC).',
  },
  {
    title: 'Eixo Inferência',
    body: 'Esperado (frequências esperadas sob a hipótese nula), χ² (Pearson com contribuições de cada célula), Distribuição (curva do χ² com a estatística observada), Testes (Pearson, Yates, G-test e Fisher) e Explicação (resíduos padronizados e sensibilidade do p-valor em relação ao n).',
  },
  {
    title: 'Eixo Aplicação clínica',
    body: 'Interpretação (leitura em linguagem natural já contextualizada pelo desenho, com a medida recomendada e a validade de cada medida) e Testes diagnósticos (sensibilidade, especificidade, VPP/VPN, nomograma de Fagan, McNemar, Kappa, confundimento e Mantel-Haenszel).',
  },
  {
    title: 'Exportar relatório',
    body: 'O botão "Exportar" gera um PDF paginado com a tabela formatada, o gráfico de grupos e o resumo estatístico com a interpretação — pronto para entregar ou discutir em sala.',
  },
  {
    title: 'Ferramentas e fim',
    body: '"Salvar análise" guarda a tabela atual com um nome automático; "Análises" mostra o histórico e as análises salvas para restaurar depois. Bom estudo!',
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