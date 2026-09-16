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
import StackedBars from './StackedBars';
import CIPanel from './CIPanel';
import ForestPlot from './ForestPlot';
import ExpectedFrequencies from './ExpectedFrequencies';
import ChiSquarePanel from './ChiSquarePanel';
import ChiSquareDistribution from './ChiSquareDistribution';
import TestsComparison from './TestsComparison';
import ExplanationPanel from './ExplanationPanel';
import AdvancedPanel from './AdvancedPanel';
import InterpretationTab from './InterpretationTab';

const TABS = [
  { key: 'interpretacao', label: 'Interpretação', icon: Sparkles },
  { key: 'grupos', label: 'Grupos', icon: BarChart3 },
  { key: 'proporcoes', label: 'Proporções', icon: Percent },
  { key: 'ic', label: 'IC', icon: Sigma },
  { key: 'forest', label: 'Forest', icon: MoveHorizontal },
  { key: 'esperado', label: 'Esperado', icon: Table },
  { key: 'chisq', label: 'χ²', icon: Superscript },
  { key: 'distribuicao', label: 'Distribuição', icon: Activity },
  { key: 'testes', label: 'Testes', icon: ListChecks },
  { key: 'explicacao', label: 'Explicação', icon: Lightbulb },
  { key: 'avancado', label: 'Testes diagnósticos', icon: Atom },
];

export default function VisualizationTabs({ r, labels, reduceMotion, values, studyType }) {
  const [tab, setTab] = useState('interpretacao');

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <select
        value={tab}
        onChange={(e) => setTab(e.target.value)}
        className="sm:hidden w-full text-sm border border-border rounded-md px-3 py-2 bg-card mb-3 text-foreground"
        aria-label="Selecionar visualização"
      >
        {TABS.map((t) => (
          <option key={t.key} value={t.key}>
            {t.label}
          </option>
        ))}
      </select>
      <div className="hidden sm:flex items-center gap-1 mb-5 overflow-x-auto pb-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
                tab === t.key
                  ? 'bg-foreground text-background border-foreground'
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
      {tab === 'proporcoes' && (
        <StackedBars r={r} labels={labels} reduceMotion={reduceMotion} />
      )}
      {tab === 'ic' && <CIPanel r={r} labels={labels} />}
      {tab === 'forest' && <ForestPlot r={r} />}
      {tab === 'esperado' && <ExpectedFrequencies r={r} />}
      {tab === 'chisq' && (
        <ChiSquarePanel r={r} reduceMotion={reduceMotion} />
      )}
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