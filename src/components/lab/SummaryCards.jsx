import React from 'react';
import { fmtInt, fmtPct, fmtMeasure, fmtP, ciText } from '@/lib/format';
import { STUDY_TYPES } from '@/lib/studyTypes';

const LEFT_BORDERS = {
  'teal-700': 'border-l-4 border-l-teal-700',
  'teal-600': 'border-l-4 border-l-teal-600',
};

const BADGE = {
  recomendada: 'bg-teal-700 text-white',
  possivel: 'bg-sky-100 text-sky-700',
  nao: 'bg-red-50 text-red-600 border border-red-200',
};
const BADGE_LABEL = {
  recomendada: 'Recomendada',
  possivel: 'Possível',
  nao: 'Não aplicável',
};

function measureStatus(studyType, key) {
  const study = STUDY_TYPES[studyType] || STUDY_TYPES.coorte;
  const m = study.measures.find((m) => m.key === key);
  return m ? m.status : null;
}

function Card({ label, value, sub, accent, status }) {
  const dim = status === 'nao';
  return (
    <button
      className={`text-left rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-foreground/25 ${
        accent ? LEFT_BORDERS[accent] || '' : ''
      } ${dim ? 'opacity-55' : ''}`}
    >
      <div className="flex items-center justify-between gap-1">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        {status && (
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${BADGE[status]}`}>
            {BADGE_LABEL[status]}
          </span>
        )}
      </div>
      <div className="text-2xl font-semibold tabular-nums text-foreground mt-0.5">
        {dim ? '—' : value}
      </div>
      {sub && <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>}
    </button>
  );
}

export default function SummaryCards({ r, studyType }) {
  const rrKey = studyType === 'transversal' ? 'RP' : 'RR';
  const rrStatus = measureStatus(studyType, rrKey);
  const orStatus = measureStatus(studyType, 'OR');

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
      <Card label="N" value={fmtInt(r.totals.n)} sub="total de indivíduos" accent="teal-700" />
      <Card
        label="P(desfecho | expostos)"
        value={fmtPct(r.riskExp, 1)}
        sub={`a / (a+b) = ${fmtInt(r.a)} / ${fmtInt(r.totals.row1)}`}
      />
      <Card
        label="P(desfecho | não expostos)"
        value={fmtPct(r.riskUnexp, 1)}
        sub={`c / (c+d) = ${fmtInt(r.c)} / ${fmtInt(r.totals.row2)}`}
      />
      <Card
        label={`RR${rrKey === 'RP' ? ' (RP)' : ' / RP'}`}
        value={fmtMeasure(r.RR)}
        sub={
          rrStatus === 'nao'
            ? 'Sem incidência neste desenho — use OR'
            : `IC 95%: ${ciText(r.RRCI)}${r.RR !== null ? ' · RP = mesmo cálculo (transversal)' : ''}`
        }
        accent="teal-600"
        status={rrStatus}
      />
      <Card
        label="OR"
        value={fmtMeasure(r.OR)}
        sub={`IC 95%: ${ciText(r.ORCI)}`}
        accent="teal-600"
        status={orStatus}
      />
    </section>
  );
}