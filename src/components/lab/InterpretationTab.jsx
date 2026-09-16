import React from 'react';
import { Sparkles, CheckCircle2, Circle, XCircle } from 'lucide-react';
import { buildInterpretation } from '@/lib/interpretation';
import { studyName, STUDY_TYPES } from '@/lib/studyTypes';
import { fmt, fmtInt, fmtPct, ciText } from '@/lib/format';

function measureValue(key, r) {
  switch (key) {
    case 'RR':
      return { val: r.RR, ci: r.RRCI, label: 'RR' };
    case 'RP':
      return { val: r.RR, ci: r.RRCI, label: 'RP' };
    case 'RD':
      return { val: r.RD, ci: r.RDCI, label: 'RD' };
    case 'RA':
      return { val: r.RD, ci: r.RDCI, label: 'RA' };
    case 'RAP':
      return { val: r.RAP, ci: r.RAPCI, label: 'RAP' };
    case 'OR':
      return { val: r.OR, ci: r.ORCI, label: 'OR' };
    case 'RRR':
      return { val: r.RR !== null ? 1 - r.RR : null, ci: null, label: 'RRR' };
    case 'RAR':
      return { val: r.RD !== null ? -r.RD : null, ci: null, label: 'RAR' };
    case 'NNT': {
      const rar = r.RD !== null ? -r.RD : null;
      const val = rar !== null && rar > 0 ? Math.ceil(1 / rar) : null;
      return { val, ci: null, label: 'NNT' };
    }
    default:
      return { val: null, ci: null, label: key };
  }
}

function formatVal(mv) {
  if (mv.val === null) return '—';
  if (mv.label === 'NNT') return fmtInt(mv.val);
  if (
    mv.label === 'RRR' ||
    mv.label === 'RAR' ||
    mv.label === 'RA' ||
    mv.label === 'RAP'
  )
    return fmtPct(mv.val, 1);
  return fmt(mv.val, 2);
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

export default function InterpretationTab({ r, labels, studyType }) {
  const text = buildInterpretation(studyType, r, labels);
  const study = STUDY_TYPES[studyType] || STUDY_TYPES.coorte;
  const recommended = study.measures.find((m) => m.status === 'recomendada');
  const recVal = recommended ? measureValue(recommended.key, r) : null;

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-foreground mb-1 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-teal-700" />
        Interpretação
      </h3>
      <p className="text-xs text-muted-foreground italic mb-4">
        Leitura contextualizada conforme o desenho selecionado:{' '}
        <span className="font-medium not-italic text-foreground">
          {studyName(studyType)}
        </span>
        . {study.desc}
      </p>

      {/* Leitura em linguagem natural */}
      <div className="rounded-lg border border-teal-200 bg-teal-50/50 px-4 py-3 mb-4">
        <div className="text-[10px] uppercase tracking-wider text-teal-700 mb-1.5">
          Leitura
        </div>
        <p className="text-sm text-foreground leading-relaxed">{text}</p>
      </div>

      {/* Medida recomendada em destaque */}
      {recVal && recVal.val !== null && (
        <div className="rounded-lg border border-teal-200 bg-teal-50/50 px-4 py-3 mb-4">
          <div className="text-[10px] uppercase tracking-wider text-teal-700">
            Medida recomendada · {recVal.label}
          </div>
          <div className="text-2xl font-semibold tabular-nums text-foreground">
            {formatVal(recVal)}{' '}
            {recVal.ci && (
              <span className="text-sm font-normal text-muted-foreground">
                [{ciText(recVal.ci)}]
              </span>
            )}
          </div>
        </div>
      )}

      {/* Medidas válidas para o desenho */}
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
        Medidas válidas para {study.name}
      </div>
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
                      {formatVal(mv)}
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

      <p className="text-xs text-muted-foreground mt-3">
        Esta interpretação é gerada automaticamente a partir dos valores da
        tabela e do desenho do estudo. Sempre valide o raciocínio clínico e o
        desenho amostral antes de concluir.
      </p>
    </div>
  );
}