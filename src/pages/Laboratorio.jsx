import React, { useState, useMemo } from 'react';
import { calculate2x2 } from '@/lib/stats';
import LabHeader from '@/components/lab/LabHeader';
import PresetBar from '@/components/lab/PresetBar';
import SummaryCards from '@/components/lab/SummaryCards';
import ContingencyTable from '@/components/lab/ContingencyTable';
import TotalsPanel from '@/components/lab/TotalsPanel';
import ProportionsPanel from '@/components/lab/ProportionsPanel';
import VisualizationTabs from '@/components/lab/VisualizationTabs';
import ProductToolbar from '@/components/lab/ProductToolbar';
import ChallengesModal from '@/components/lab/ChallengesModal';
import AnalysisDrawer from '@/components/lab/AnalysisDrawer';
import TeachMode from '@/components/lab/TeachMode';
import FirstTimeOnboarding from '@/components/lab/FirstTimeOnboarding';
import { useLabStore } from '@/hooks/useLabStore';

export default function Laboratorio() {
  const [values, setValues] = useState({ a: 40, b: 60, c: 20, d: 80 });
  const [labels, setLabels] = useState({
    exposureName: 'Exposição',
    outcomeName: 'Desfecho',
    expYes: 'Sim',
    expNo: 'Não',
    outYes: 'Sim',
    outNo: 'Não',
  });
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [openChallenges, setOpenChallenges] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openTeach, setOpenTeach] = useState(false);
  const { history, saved, saveSnapshot, removeSaved, clearHistory } =
    useLabStore(values, labels);

  const r = useMemo(
    () => calculate2x2(values.a, values.b, values.c, values.d),
    [values]
  );

  const loadPreset = (p) =>
    setValues({ a: p.a, b: p.b, c: p.c, d: p.d });

  const restore = (snap) => {
    setValues({ ...snap.values });
    if (snap.labels) setLabels({ ...snap.labels });
    setOpenDrawer(false);
  };

  const wrapperClass = [
    'min-h-screen bg-background text-foreground',
    reduceMotion ? 'reduce-motion' : '',
    highContrast ? 'high-contrast' : '',
  ].join(' ');

  return (
    <div className={wrapperClass}>
      <LabHeader
        reduceMotion={reduceMotion}
        setReduceMotion={setReduceMotion}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
      />

      <main className="max-w-[1400px] mx-auto px-5 sm:px-8 py-6 sm:py-8 space-y-6">
        {/* Subtítulo / frase */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <PresetBar onLoad={loadPreset} />
          <ProductToolbar
            onChallenges={() => setOpenChallenges(true)}
            onDrawer={() => setOpenDrawer(true)}
            onTeach={() => setOpenTeach(true)}
          />
        </div>

        {/* Resumo principal */}
        <SummaryCards r={r} />

        {/* Layout duas colunas no desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-6">
            <ContingencyTable
              values={values}
              setValues={setValues}
              labels={labels}
              setLabels={setLabels}
            />
            <TotalsPanel r={r} values={values} setValues={setValues} />
          </div>

          <div className="lg:sticky lg:top-20">
            <VisualizationTabs
              r={r}
              values={values}
              labels={labels}
              reduceMotion={reduceMotion}
            />
          </div>
        </div>

        {/* Proporções — abaixo, full width */}
        <ProportionsPanel r={r} labels={labels} />

        <footer className="pt-6 pb-10 text-center text-xs text-muted-foreground">
          2×2 LAB — um laboratório educacional para exploração de tabelas de
          contingência 2×2, associação e inferência estatística.
        </footer>

        <ChallengesModal
          open={openChallenges}
          onOpenChange={setOpenChallenges}
          r={r}
        />
        <AnalysisDrawer
          open={openDrawer}
          onOpenChange={setOpenDrawer}
          history={history}
          saved={saved}
          onSave={saveSnapshot}
          onRemove={removeSaved}
          onRestore={restore}
          onClearHistory={clearHistory}
        />
        <TeachMode open={openTeach} onOpenChange={setOpenTeach} />
        <FirstTimeOnboarding />
      </main>
    </div>
  );
}