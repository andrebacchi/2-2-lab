import React from 'react';
import { Sparkles, CheckCircle2, Circle, XCircle } from 'lucide-react';
import { buildInterpretation } from '@/lib/interpretation';
import { studyName, STUDY_TYPES } from '@/lib/studyTypes';
import { fmt, fmtInt, fmtPct, ciText } from '@/lib/format';
import { parsePrevalence } from '@/lib/stats';

function measureValue(key, r) {
  switch (key) {
    case 'RR':
      return { val: r.RR, ci: r.RRCI, label: 'Risco Relativo', code: 'RR' };
    case 'RP':
      return { val: r.RR, ci: r.RRCI, label: 'Razão de Prevalências', code: 'RP' };
    case 'RD':
      return { val: r.RD, ci: r.RDCI, label: 'Diferença de Risco', code: 'RD' };
    case 'RA':
      return { val: r.RD, ci: r.RDCI, label: 'Risco Atribuível', code: 'RA' };
    case 'RAP':
      return { val: r.RAP, ci: r.RAPCI, label: 'Risco Atribuível à População', code: 'RAP' };
    case 'OR':
      return { val: r.OR, ci: r.ORCI, label: 'Odds Ratio', code: 'OR' };
    case 'RRR':
      return { val: r.RR !== null ? 1 - r.RR : null, ci: null, label: 'Redução Relativa de Risco', code: 'RRR' };
    case 'RAR':
      return { val: r.RD !== null ? -r.RD : null, ci: null, label: 'Redução Absoluta de Risco', code: 'RAR' };
    case 'NNT': {
      const rar = r.RD !== null ? -r.RD : null;
      const val = rar !== null && rar > 0 ? Math.ceil(1 / rar) : null;
      return { val, ci: null, label: 'NNT', code: 'NNT' };
    }
    default:
      return { val: null, ci: null, label: key, code: key };
  }
}

const PCT_CODES = ['RRR', 'RAR', 'RA', 'RAP'];

function formatVal(mv) {
  if (mv.val === null) return '—';
  if (mv.code === 'NNT') return fmtInt(mv.val);
  if (PCT_CODES.includes(mv.code)) return fmtPct(mv.val, 1);
  return fmt(mv.val, 2);
}

// O IC acompanha a unidade do valor: medidas em % mostram o IC em %.
function formatCI(mv) {
  if (!PCT_CODES.includes(mv.code)) return ciText(mv.ci);
  const { low, high } = mv.ci;
  if (!Number.isFinite(low) || !Number.isFinite(high)) return 'não estimável';
  return `${fmtPct(low, 1)} – ${fmtPct(high, 1)}`;
}

// Campo para informar a prevalência da exposição na população (RAP da coorte).
function ExposurePrevalenceField({ r, expPrev, setExpPrev }) {
  const parsed = parsePrevalence(expPrev);
  const invalid = Number.isNaN(parsed);
  const sample = r.PeSample;
  return (
    <div className="mt-2.5 rounded-md border border-border bg-muted/40 px-3 py-2.5">
      <label
        htmlFor="exp-prev"
        className="block text-xs font-semibold text-foreground"
      >
        Prevalência da exposição na população
      </label>
      <div className="mt-1.5 flex items-center gap-2 flex-wrap">
        <div
          className={`flex items-center rounded-md border bg-card px-2.5 h-10 w-32 focus-within:border-teal-700 ${
            invalid ? 'border-red-400' : 'border-border'
          }`}
        >
          <input
            id="exp-prev"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={expPrev}
            onChange={(e) => setExpPrev(e.target.value)}
            placeholder={sample !== null ? fmt(sample * 100, 1) : 'ex.: 30'}
            aria-invalid={invalid}
            aria-describedby="exp-prev-help"
            className="w-full min-w-0 bg-transparent outline-none text-base font-semibold tabular-nums text-foreground placeholder:text-muted-foreground/60 placeholder:font-normal"
          />
          <span className="text-sm text-muted-foreground ml-1">%</span>
        </div>
        {expPrev !== '' && (
          <button
            type="button"
            onClick={() => setExpPrev('')}
            className="text-xs text-teal-700 font-medium underline underline-offset-2"
          >
            Usar a da amostra
          </button>
        )}
      </div>
      <p id="exp-prev-help" className="text-xs text-muted-foreground mt-1.5">
        {invalid
          ? 'Digite um valor entre 0 e 100.'
          : r.PeCustom
            ? `Usando ${fmtPct(r.Pe, 1)}, informada por você.`
            : sample !== null
              ? `Em branco, usa a proporção de expostos da tabela (${fmtPct(sample, 1)}), que na coorte costuma ser fixada pelo desenho e não representa a população.`
              : 'Em branco, usa a proporção de expostos da tabela.'}
      </p>
      {r.RD !== null && r.Pe !== null && r.RAP !== null && (
        <p className="text-xs text-foreground mt-1.5 font-mono tabular-nums">
          RAP = RA × Pe = {fmtPct(r.RD, 1)} × {fmtPct(r.Pe, 1)} ={' '}
          <b>{fmtPct(r.RAP, 1)}</b>
        </p>
      )}
    </div>
  );
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

export default function InterpretationTab({ r, labels, studyType, expPrev = '', setExpPrev }) {
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
                [{formatCI(recVal)}]
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
                          [{formatCI(mv)}]
                        </span>
                      )}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{m.note}</p>
                {m.key === 'RAP' && setExpPrev && (
                  <ExposurePrevalenceField
                    r={r}
                    expPrev={expPrev}
                    setExpPrev={setExpPrev}
                  />
                )}
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