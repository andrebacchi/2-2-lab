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
import AnalysisDrawer from '@/components/lab/AnalysisDrawer';
import { useToast } from '@/components/ui/use-toast';
import TeachMode from '@/components/lab/TeachMode';
import FirstTimeOnboarding from '@/components/lab/FirstTimeOnboarding';
import StudyTypeSelector from '@/components/lab/StudyTypeSelector';
import ExportReportButton from '@/components/lab/ExportReportButton';
import { useLabStore } from '@/hooks/useLabStore';

export default function Laboratorio() {
  const [values, setValues] = useState({ a: 0, b: 0, c: 0, d: 0 });
  const [labels, setLabels] = useState({
    exposureName: 'Exposição',
    outcomeName: 'Desfecho',
    expYes: 'Sim',
    expNo: 'Não',
    outYes: 'Sim',
    outNo: 'Não',
  });
  const [highContrast, setHighContrast] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openTeach, setOpenTeach] = useState(false);
  const [studyType, setStudyType] = useState('coorte');
  const { toast } = useToast();
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
    highContrast ? 'high-contrast' : '',
  ].join(' ');

  return (
    <div className={wrapperClass}>
      <LabHeader
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        onTeach={() => setOpenTeach(true)}
      />

      <main className="max-w-[1400px] mx-auto px-5 sm:px-8 pt-2 pb-8 space-y-6">
        {/* Ferramentas */}
        <div className="flex justify-end items-center gap-2 flex-wrap">
          <ProductToolbar
            onSave={() => {
              const name = `Análise ${new Date().toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}`;
              saveSnapshot(name);
              toast({
                title: 'Análise salva',
                description: `${name} · ${values.a + values.b + values.c + values.d} indivíduos`,
              });
            }}
            onDrawer={() => setOpenDrawer(true)}
          />
          <ExportReportButton
            r={r}
            values={values}
            labels={labels}
            studyType={studyType}
          />
        </div>

        {/* Layout duas colunas no desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-6">
            <PresetBar onLoad={loadPreset} />
            <StudyTypeSelector type={studyType} setType={setStudyType} />
            <ContingencyTable
              values={values}
              setValues={setValues}
              labels={labels}
              setLabels={setLabels}
            />
            <SummaryCards r={r} studyType={studyType} />
            <TotalsPanel r={r} values={values} setValues={setValues} />
          </div>

          <div className="lg:sticky lg:top-20">
            <VisualizationTabs
              r={r}
              values={values}
              labels={labels}
              studyType={studyType}
            />
          </div>
        </div>

        {/* Proporções — abaixo, full width */}
        <ProportionsPanel r={r} labels={labels} />

        <footer className="pt-6 pb-10 text-center text-xs text-muted-foreground">
          2×2 LAB — um laboratório educacional para exploração de tabelas de
          contingência 2×2, associação e inferência estatística.
        </footer>

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