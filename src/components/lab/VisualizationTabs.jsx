import React, { useState } from 'react';
import {
  BarChart3,
  Percent,
  Users,
  Grid2x2,
  Flame,
  Sigma,
  MoveHorizontal,
  Table,
  Superscript,
  Activity,
  ListChecks,
} from 'lucide-react';
import ComparisonBars from './ComparisonBars';
import StackedBars from './StackedBars';
import IndividualsView from './IndividualsView';
import MosaicPlot from './MosaicPlot';
import Heatmap from './Heatmap';
import CIPanel from './CIPanel';
import ForestPlot from './ForestPlot';
import ExpectedFrequencies from './ExpectedFrequencies';
import ChiSquarePanel from './ChiSquarePanel';
import ChiSquareDistribution from './ChiSquareDistribution';
import TestsComparison from './TestsComparison';

const TABS = [
  { key: 'grupos', label: 'Grupos', icon: BarChart3 },
  { key: 'proporcoes', label: 'Proporções', icon: Percent },
  { key: 'individuos', label: 'Indivíduos', icon: Users },
  { key: 'mosaic', label: 'Mosaic', icon: Grid2x2 },
  { key: 'heatmap', label: 'Heatmap', icon: Flame },
  { key: 'ic', label: 'IC', icon: Sigma },
  { key: 'forest', label: 'Forest', icon: MoveHorizontal },
  { key: 'esperado', label: 'Esperado', icon: Table },
  { key: 'chisq', label: 'χ²', icon: Superscript },
  { key: 'distribuicao', label: 'Distribuição', icon: Activity },
  { key: 'testes', label: 'Testes', icon: ListChecks },
];

export default function VisualizationTabs({ r, labels, reduceMotion }) {
  const [tab, setTab] = useState('grupos');

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6 shadow-sm">
      <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
                tab === t.key
                  ? 'bg-teal-700 text-white border-teal-700'
                  : 'text-muted-foreground border-border hover:bg-accent'
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
      {tab === 'individuos' && (
        <IndividualsView r={r} labels={labels} reduceMotion={reduceMotion} />
      )}
      {tab === 'mosaic' && (
        <MosaicPlot r={r} labels={labels} reduceMotion={reduceMotion} />
      )}
      {tab === 'heatmap' && (
        <Heatmap r={r} labels={labels} reduceMotion={reduceMotion} />
      )}
      {tab === 'ic' && <CIPanel r={r} labels={labels} />}
      {tab === 'forest' && <ForestPlot r={r} />}
      {tab === 'esperado' && <ExpectedFrequencies r={r} />}
      {tab === 'chisq' && (
        <ChiSquarePanel r={r} reduceMotion={reduceMotion} />
      )}
      {tab === 'distribuicao' && <ChiSquareDistribution r={r} />}
      {tab === 'testes' && <TestsComparison r={r} />}
    </div>
  );
}