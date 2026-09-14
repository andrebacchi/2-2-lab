import React, { useState } from 'react';
import {
  Clock,
  Search,
  Camera,
  FlaskConical,
  Microscope,
  CheckCircle2,
  Circle,
  XCircle,
} from 'lucide-react';
import { fmt, fmtInt, ciText } from '@/lib/format';

const STUDY_TYPES = {
  coorte: {
    name: 'Coorte',
    icon: Clock,
    desc: 'Acompanha expostos e não expostos no tempo até o desfecho. Mede incidência — logo, risco é estimável.',
    measures: [
      { key: 'RR', status: 'recomendada', note: 'Razão de riscos (incidências). Estimativa direta do efeito relativo.' },
      { key: 'RD', status: 'possivel', note: 'Diferença absoluta de risco (ARR). Efeito na escala original; base do NNT.' },
      { key: 'NNT', status: 'possivel', note: 'Número necessário para tratar ≈ 1/|RD|.' },
      { key: 'OR', status: 'possivel', note: 'Válido, mas só aproxima o RR se o desfecho for raro.' },
    ],
  },
  caso_controle: {
    name: 'Caso-controle',
    icon: Search,
    desc: 'Amostragem por desfecho. Os totais das linhas são fixados pelo desenho — não há incidência.',
    measures: [
      { key: 'OR', status: 'recomendada', note: 'Única medida válida: a odds ratio é independente da amostragem por desfecho.' },
      { key: 'RR', status: 'nao', note: 'Não aplicável: sem incidência, o "risco" é artefato da forma como você amostrou.' },
      { key: 'RD', status: 'nao', note: 'Não aplicável: a diferença de riscos não tem significado sem incidência.' },
    ],
  },
  transversal: {
    name: 'Transversal',
    icon: Camera,
    desc: 'Um único momento no tempo. Mede prevalência, não incidência.',
    measures: [
      { key: 'RP', status: 'recomendada', note: 'Razão de prevalências — o "RR" da tabela, reinterpretado como prevalência.' },
      { key: 'RD', status: 'possivel', note: 'Diferença de prevalências.' },
      { key: 'OR', status: 'possivel', note: 'Razão de odds de prevalência; aproxima a RP se a prevalência for baixa.' },
    ],
  },
  ensaio: {
    name: 'Ensaio clínico',
    icon: FlaskConical,
    desc: 'Intervenção alocada → desfecho. Como coorte, mas a exposição é manipulada pelo pesquisador.',
    measures: [
      { key: 'RR', status: 'recomendada', note: 'Razão de riscos entre intervenção e controle.' },
      { key: 'RD', status: 'recomendada', note: 'Redução absoluta de risco (ARR); NNT = 1/|RD|.' },
      { key: 'NNT', status: 'recomendada', note: 'Número necessário para tratar — quanto menor, mais eficaz a intervenção.' },
      { key: 'OR', status: 'possivel', note: 'Válido, mas menos intuitivo que RR/RD em ensaios.' },
    ],
  },
};

function measureValue(key, r) {
  switch (key) {
    case 'RR':
      return { val: r.RR, ci: r.RRCI, label: 'RR' };
    case 'RP':
      return { val: r.RR, ci: r.RRCI, label: 'RP' };
    case 'RD':
      return { val: r.RD, ci: r.RDCI, label: 'RD' };
    case 'OR':
      return { val: r.OR, ci: r.ORCI, label: 'OR' };
    case 'NNT': {
      const val = r.RD !== null && r.RD !== 0 ? Math.ceil(1 / Math.abs(r.RD)) : null;
      return { val, ci: null, label: 'NNT' };
    }
    default:
      return { val: null, ci: null, label: key };
  }
}

const STATUS = {
  recomendada: {
    badge: 'bg-teal-700 text-white',
    icon: CheckCircle2,
    iconClass: 'text-teal-700',
    label: 'Recomendada',
  },
  possivel: {
    badge: 'bg-sky-100 text-sky-700',
    icon: Circle,
    iconClass: 'text-sky-600',
    label: 'Possível',
  },
  nao: {
    badge: 'bg-red-50 text-red-600 border border-red-200',
    icon: XCircle,
    iconClass: 'text-red-500',
    label: 'Não aplicável',
  },
};

export default function StudyContextPanel({ r }) {
  const [type, setType] = useState('coorte');
  const study = STUDY_TYPES[type];
  const Icon = study.icon;

  const recommended = study.measures.find((m) => m.status === 'recomendada');
  const recVal = recommended ? measureValue(recommended.key, r) : null;

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-foreground mb-1">
        Contexto do estudo
      </h3>
      <p className="text-xs text-muted-foreground italic mb-4">
        O desenho do estudo determina quais medidas de associação fazem sentido.
        Escolha um para ver a recomendada, as possíveis e por que as demais não
        se aplicam.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(STUDY_TYPES).map(([key, val]) => {
          const TIcon = val.icon;
          return (
            <button
              key={key}
              onClick={() => setType(key)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
                type === key
                  ? 'bg-teal-700 text-white border-teal-700'
                  : 'text-muted-foreground border-border hover:bg-accent'
              }`}
            >
              <TIcon className="w-3.5 h-3.5" />
              {val.name}
            </button>
          );
        })}
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-teal-50/60 border border-teal-100 px-3 py-2.5 mb-4">
        <Icon className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <p className="text-xs text-foreground/80">
          <span className="font-semibold">{study.name}:</span> {study.desc}
        </p>
      </div>

      {recVal && recVal.val !== null && (
        <div className="rounded-lg border border-teal-200 bg-teal-50/50 px-4 py-3 mb-4">
          <div className="text-[10px] uppercase tracking-wider text-teal-700">
            Medida recomendada · {recVal.label}
          </div>
          <div className="text-2xl font-semibold tabular-nums text-foreground">
            {recVal.label === 'NNT' ? fmtInt(recVal.val) : fmt(recVal.val, 2)}{' '}
            {recVal.ci && (
              <span className="text-sm font-normal text-muted-foreground">
                [{ciText(recVal.ci)}]
              </span>
            )}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {study.measures.map((m) => {
          const st = STATUS[m.status];
          const StIcon = st.icon;
          const mv = measureValue(m.key, r);
          const showVal = m.status !== 'nao' && mv.val !== null;
          return (
            <div
              key={m.key}
              className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 ${
                m.status === 'nao'
                  ? 'border-border bg-muted/30 opacity-80'
                  : 'border-border bg-card'
              }`}
            >
              <StIcon className={`w-4 h-4 ${st.iconClass} shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground text-sm">
                    {mv.label}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${st.badge}`}
                  >
                    {st.label}
                  </span>
                  {showVal && (
                    <span className="ml-auto text-sm tabular-nums text-teal-700 font-semibold">
                      {mv.label === 'NNT'
                        ? fmtInt(mv.val)
                        : fmt(mv.val, 2)}
                      {mv.ci && (
                        <span className="text-muted-foreground font-normal">
                          {' '}
                          [{ciText(mv.ci)}]
                        </span>
                      )}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{m.note}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}