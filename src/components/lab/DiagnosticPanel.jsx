import React from 'react';
import { proportionCI } from '@/lib/stats';
import { fmt, fmtPct, ciText } from '@/lib/format';

const sd = (x, y) => (y > 0 ? x / y : null);

export default function DiagnosticPanel({ r }) {
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
      <p className="text-xs text-muted-foreground italic mt-4">
        LR+ &gt; 10 e LR− &lt; 0,1 sugerem teste com alto poder discriminativo.
      </p>
    </div>
  );
}