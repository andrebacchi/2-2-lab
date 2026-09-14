import React from 'react';
import { gammq } from '@/lib/stats';
import { fmt, fmtInt, fmtP } from '@/lib/format';

// p exato bilateral do teste de sinal (binomial, p=0,5) — usado p/ b+c < 25
function binomTwoSided(b, c) {
  const n = b + c;
  if (n === 0) return null;
  const k = Math.max(b, c);
  let curr = Math.pow(0.5, n);
  const probs = [curr];
  for (let i = 0; i < n; i++) {
    curr = (curr * (n - i)) / (i + 1);
    probs.push(curr);
  }
  const lo = Math.min(b, c);
  let p = 0;
  for (let i = 0; i <= n; i++) {
    if (i <= lo || i >= k) p += probs[i];
  }
  return Math.min(1, p);
}

export default function McNemarPanel({ r }) {
  const { b, c } = r;
  const disc = b + c;
  const chi2 = disc > 0 ? (Math.abs(b - c) - 1) ** 2 / disc : null;
  const pAsymp = chi2 !== null ? gammq(0.5, chi2 / 2) : null;
  const useExact = disc > 0 && disc < 25;
  const pExact = useExact ? binomTwoSided(b, c) : null;
  const p = useExact ? pExact : pAsymp;

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-foreground mb-1">
        Teste de McNemar (dados pareados)
      </h3>
      <p className="text-xs text-muted-foreground italic mb-4">
        Para medidas pareadas/antes-depois. As células concordantes (a, d) são
        ignoradas; só importam os pares discordantes <b>b</b> e <b>c</b>.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Pares discordantes (b + c)
          </div>
          <div className="text-xl font-semibold tabular-nums text-foreground">
            {fmtInt(disc)}
          </div>
          <div className="text-[10px] text-muted-foreground/70 font-mono">
            b={fmtInt(b)} · c={fmtInt(c)}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Diferença das proporções
          </div>
          <div className="text-xl font-semibold tabular-nums text-foreground">
            {disc > 0 ? fmt((b - c) / disc, 3) : '—'}
          </div>
          <div className="text-[10px] text-muted-foreground/70 font-mono">
            (b − c)/(b + c)
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-teal-200 bg-teal-50/50 px-4 py-3">
        <div className="text-[10px] uppercase tracking-wider text-teal-700">
          Estatística
        </div>
        <div className="text-lg font-semibold tabular-nums text-foreground">
          χ² = {chi2 !== null ? fmt(chi2, 3) : '—'}{' '}
          {p !== null && (
            <span className="text-sm font-normal text-muted-foreground">
              · p = {fmtP(p)}
            </span>
          )}
        </div>
        <div className="text-[11px] text-muted-foreground mt-1">
          {disc === 0
            ? 'Sem pares discordantes — nada a testar.'
            : useExact
            ? 'b + c < 25: usando o p exato (binomial).'
            : 'Fórmula com correção de continuidade: (|b−c|−1)²/(b+c).'}
        </div>
      </div>

      <p className="text-xs text-muted-foreground italic mt-4">
        Rejeita-se H0 (proporções iguais) quando p &lt; 0,05.
      </p>
    </div>
  );
}