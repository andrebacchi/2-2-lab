import React, { useState, useEffect } from 'react';
import { proportionCI } from '@/lib/stats';
import { fmt, fmtPct, ciText } from '@/lib/format';
import { ArrowUpRight } from 'lucide-react';
import FaganNomogram from './FaganNomogram';
import { nomoDxUrl } from '@/lib/nomoLab';

const sd = (x, y) => (y > 0 ? x / y : null);

export default function DiagnosticPanel({ r, labels }) {
  const { a, b, c, d } = r;
  const n = a + b + c + d;
  const sens = sd(a, a + c);
  const spec = sd(d, b + d);
  const ppv = sd(a, a + b);
  const npv = sd(d, c + d);
  const acc = sd(a + d, n);
  const prev = sd(a + c, n);
  const lrPlus =
    sens !== null && spec !== null && 1 - spec !== 0 ? sens / (1 - spec) : null;
  const lrMinus =
    sens !== null && spec !== null && spec !== 0 ? (1 - sens) / spec : null;

  // prevalência/pré-teste editável (segue a da amostra até o usuário editar)
  const [prevPct, setPrevPct] = useState(() =>
    prev !== null ? +(prev * 100).toFixed(1) : 20
  );
  const [manual, setManual] = useState(false);
  useEffect(() => {
    if (!manual && prev !== null) setPrevPct(+(prev * 100).toFixed(1));
  }, [prev, manual]);
  const resetPrev = () => {
    setManual(false);
    if (prev !== null) setPrevPct(+(prev * 100).toFixed(1));
  };

  const pre = Math.min(0.999, Math.max(0.001, (Number(prevPct) || 0) / 100));
  let postPos = null;
  let postNeg = null;
  if (sens !== null && spec !== null) {
    const num = pre * sens;
    const den = pre * sens + (1 - pre) * (1 - spec);
    postPos = den > 0 ? num / den : null;
    const numN = pre * (1 - sens);
    const denN = pre * (1 - sens) + (1 - pre) * spec;
    postNeg = denN > 0 ? numN / denN : null;
  }
  const vppAdj = postPos;
  const vpnAdj = postNeg !== null ? 1 - postNeg : null;

  const metrics = [
    { label: 'Sensibilidade', val: sens, ci: proportionCI(a, a + c), sub: 'a/(a+c)' },
    { label: 'Especificidade', val: spec, ci: proportionCI(d, b + d), sub: 'd/(b+d)' },
    { label: 'VP+', val: ppv, ci: proportionCI(a, a + b), sub: 'a/(a+b)' },
    { label: 'VN−', val: npv, ci: proportionCI(d, c + d), sub: 'd/(c+d)' },
    { label: 'Acurácia', val: acc, ci: null, sub: '(a+d)/n' },
    { label: 'Prevalência', val: prev, ci: null, sub: '(a+c)/n' },
    { label: 'LR+', val: lrPlus, ci: null, sub: 'Sens/(1−Spec)' },
    { label: 'LR−', val: lrMinus, ci: null, sub: '(1−Sens)/Spec' },
  ];

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-foreground mb-1">
        Avaliação de teste diagnóstico
      </h3>
      <p className="text-xs text-muted-foreground italic mb-4">
        A tabela é reinterpretada como teste (linhas) × doença (colunas): a=VP,
        b=FP, c=FN, d=VN.
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m) => {
          const isLR = m.label.startsWith('LR');
          return (
            <div
              key={m.label}
              className="rounded-lg border border-border bg-card px-3 py-2.5"
            >
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {m.label}
              </div>
              <div className="text-xl font-semibold tabular-nums text-foreground">
                {m.val === null ? '—' : isLR ? fmt(m.val, 2) : fmtPct(m.val, 1)}
              </div>
              <div className="text-[10px] text-muted-foreground tabular-nums">
                {m.ci ? `IC 95%: ${ciText(m.ci)}` : '\u00A0'}
              </div>
              <div className="text-[10px] text-muted-foreground/70 mt-0.5 font-mono">
                {m.sub}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-5 rounded-xl border border-border bg-card p-4">
        <h4 className="font-display text-sm font-semibold text-foreground mb-1">
          Prevalência e probabilidade pós-teste
        </h4>
        <p className="text-xs text-muted-foreground italic mb-3">
          Defina a prevalência (ou probabilidade pré-teste) da sua população. O
          VPP e a VPN são recalculados por Bayes e o nomograma de Fagan mostra a
          passagem pré-teste → pós-teste.
        </p>
        <div className="flex flex-wrap items-end gap-4 mb-4">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Prevalência / pré-teste (%)
            </span>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={prevPct}
              onChange={(e) => {
                setManual(true);
                setPrevPct(e.target.value);
              }}
              className="w-24 text-center text-sm rounded-md border border-border bg-background px-2 py-1.5 text-foreground tabular-nums focus:border-teal-600 focus:outline-none"
            />
          </label>
          <button
            onClick={resetPrev}
            className="mb-0.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-full px-2.5 py-1 whitespace-nowrap"
          >
            ↺ usar prevalência da amostra
          </button>
          <div className="grid grid-cols-2 gap-3 sm:ml-auto">
            <div className="rounded-lg border border-border bg-background px-3 py-2 text-center">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                VPP
              </div>
              <div className="text-lg font-semibold tabular-nums text-teal-700">
                {vppAdj === null ? '—' : fmtPct(vppAdj, 1)}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-background px-3 py-2 text-center">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                VPN
              </div>
              <div className="text-lg font-semibold tabular-nums text-teal-700">
                {vpnAdj === null ? '—' : fmtPct(vpnAdj, 1)}
              </div>
            </div>
          </div>
        </div>
        {lrPlus !== null &&
        lrMinus !== null &&
        postPos !== null &&
        postNeg !== null ? (
          <div>
            <FaganNomogram
              pre={pre}
              lrPlus={lrPlus}
              lrMinus={lrMinus}
              postPos={postPos}
              postNeg={postNeg}
            />
            {/* leva o mesmo teste para o Nomo LAB, com a pré-teste escolhida aqui */}
            <a
              href={nomoDxUrl({
                se: sens,
                sp: spec,
                nD: a + c,
                nH: b + d,
                pre,
                test: labels?.exposureName,
                disease: labels?.outcomeName,
              })}
              target="_blank"
              rel="noopener"
              className="mt-4 pt-3 border-t border-border flex items-start gap-1.5 text-xs text-teal-700 font-medium no-underline hover:underline"
            >
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0 mt-px" />
              <span>
                Levar este teste ao Nomo LAB: frequências naturais, limiares de
                decisão e teste em sequência
              </span>
            </a>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            Defina sensibilidade e especificidade válidas para gerar o
            nomograma.
          </p>
        )}
      </div>
      <p className="text-xs text-muted-foreground italic mt-4">
        LR+ &gt; 10 e LR− &lt; 0,1 sugerem teste com alto poder discriminativo.
      </p>
    </div>
  );
}