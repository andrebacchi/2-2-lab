import React, { useState } from 'react';
import {
  BarChart3,
  Percent,
  Sigma,
  MoveHorizontal,
  Table,
  Superscript,
  Activity,
  ListChecks,
  Lightbulb,
  Atom,
  Sparkles,
} from 'lucide-react';
import ComparisonBars from './ComparisonBars';
import CIPanel from './CIPanel';
import ForestPlot from './ForestPlot';
import ExpectedFrequencies from './ExpectedFrequencies';
import ChiSquarePanel from './ChiSquarePanel';
import ChiSquareDistribution from './ChiSquareDistribution';
import TestsComparison from './TestsComparison';
import ExplanationPanel from './ExplanationPanel';
import AdvancedPanel from './AdvancedPanel';
import InterpretationTab from './InterpretationTab';

const GROUPS = [
  {
    key: 'associacao',
    label: 'Associação',
    tabs: [
      { key: 'grupos', label: 'Grupos', icon: BarChart3 },
      { key: 'ic', label: 'IC', icon: Sigma },
      { key: 'forest', label: 'Forest', icon: MoveHorizontal },
    ],
  },
  {
    key: 'inferencia',
    label: 'Inferência',
    tabs: [
      { key: 'esperado', label: 'Esperado', icon: Table },
      { key: 'chisq', label: 'χ²', icon: Superscript },
      { key: 'distribuicao', label: 'Distribuição', icon: Activity },
      { key: 'testes', label: 'Testes', icon: ListChecks },
      { key: 'explicacao', label: 'Explicação', icon: Lightbulb },
    ],
  },
  {
    key: 'aplicacao',
    label: 'Aplicação clínica',
    tabs: [
      { key: 'interpretacao', label: 'Interpretação', icon: Sparkles },
      { key: 'avancado', label: 'Testes diagnósticos', icon: Atom },
    ],
  },
];

function findGroup(tabKey) {
  for (const g of GROUPS) {
    if (g.tabs.some((t) => t.key === tabKey)) return g.key;
  }
  return GROUPS[0].key;
}

export default function VisualizationTabs({ r, labels, reduceMotion, values, studyType }) {
  const [tab, setTab] = useState('interpretacao');
  const [group, setGroup] = useState(findGroup(tab));

  const changeGroup = (gKey) => {
    setGroup(gKey);
    const g = GROUPS.find((g) => g.key === gKey);
    setTab(g.tabs[0].key);
  };

  const activeGroup = GROUPS.find((g) => g.key === group) || GROUPS[0];
  const subTabs = activeGroup.tabs;

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
      {/* Eixo temático (3 escolhas de alto nível) */}
      <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1">
        {GROUPS.map((g) => (
          <button
            key={g.key}
            onClick={() => changeGroup(g.key)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
              group === g.key
                ? 'bg-foreground text-background'
                : 'text-muted-foreground border border-border hover:bg-muted'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Sub-abas do eixo ativo */}
      <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1">
        {subTabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
                tab === t.key
                  ? 'bg-teal-700 text-white border-teal-700'
                  : 'text-muted-foreground border-border hover:bg-muted hover:border-foreground/20'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'grupos' && (
        <ComparisonBars r={r} labels={labels} reduceMotion={reduceMotion} />
      )}
      {tab === 'ic' && <CIPanel r={r} labels={labels} />}
      {tab === 'forest' && <ForestPlot r={r} />}
      {tab === 'esperado' && <ExpectedFrequencies r={r} />}
      {tab === 'chisq' && <ChiSquarePanel r={r} reduceMotion={reduceMotion} />}
      {tab === 'distribuicao' && <ChiSquareDistribution r={r} />}
      {tab === 'testes' && <TestsComparison r={r} />}
      {tab === 'explicacao' && <ExplanationPanel r={r} values={values} />}
      {tab === 'avancado' && <AdvancedPanel r={r} />}
      {tab === 'interpretacao' && (
        <InterpretationTab r={r} labels={labels} studyType={studyType} />
      )}
    </div>
  );
}