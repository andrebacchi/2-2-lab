import React from 'react';
import { calculate2x2, rescaleTable, MIN_N } from '@/lib/stats';
import { fmt, fmtP, fmtInt } from '@/lib/format';

const CELLS = ['a', 'b', 'c', 'd'];

function StdResiduals({ r }) {
  const vals = CELLS.map((k) => ({ k, v: r.stdResiduals[k] }));
  const finite = vals
    .filter((x) => x.v !== null && Number.isFinite(x.v))
    .map((x) => Math.abs(x.v));
  const maxScale = Math.max(3, ...(finite.length ? finite : [1]));
  const half = 50;

  return (
    <div>
      <h4 className="font-display text-sm font-semibold text-foreground mb-1">
        Resíduos padronizados
      </h4>
      <p className="text-xs text-muted-foreground italic mb-3">
        Quanto cada célula foge do esperado, em desvios-padrão. |≥1,96| (5%) e
        |≥2,58| (1%) indicam desvio incomum sob H0.
      </p>
      <div className="space-y-2">
        {vals.map(({ k, v }) => {
          const pos = v !== null && v >= 0;
          const barW = v === null ? 0 : (Math.abs(v) / maxScale) * half;
          const abs = v === null ? 0 : Math.abs(v);
          const color =
            abs >= 2.58 ? 'bg-red-500' : abs >= 1.96 ? 'bg-amber-500' : pos ? 'bg-teal-600' : 'bg-slate-400';
          return (
            <div key={k} className="flex items-center gap-2">
              <span className="w-4 text-xs font-semibold text-muted-foreground">
                {k}
              </span>
              <div className="relative flex-1 h-5 bg-muted/40 rounded overflow-hidden">
                <div className="absolute top-0 bottom-0 w-px bg-border" style={{ left: '50%' }} />
                {[1.96, 2.58].map((t) => (
                  <div key={t}>
                    <div
                      className="absolute top-0 bottom-0 w-px bg-amber-300/70"
                      style={{ left: `${50 + (t / maxScale) * half}%` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 w-px bg-amber-300/70"
                      style={{ left: `${50 - (t / maxScale) * half}%` }}
                    />
                  </div>
                ))}
                {v !== null && (
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 h-3 rounded ${color}`}
                    style={
                      pos
                        ? { left: '50%', width: `${barW}%` }
                        : { right: '50%', width: `${barW}%` }
                    }
                  />
                )}
              </div>
              <span className="w-12 text-right text-xs tabular-nums text-foreground font-medium">
                {v === null ? '—' : fmt(v, 2)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DeOndeVeioChi2({ r }) {
  const rows = CELLS.map((k) => {
    const o = r[k];
    const e = r.expected[k];
    const diff = r.residuals[k];
    const sq = diff === null ? null : diff * diff;
    const contrib = r.contributions[k];
    return { k, o, e, diff, sq, contrib };
  });
  const total = r.chi2;

  return (
    <div>
      <h4 className="font-display text-sm font-semibold text-foreground mb-1">
        De onde veio o χ²?
      </h4>
      <p className="text-xs text-muted-foreground italic mb-3">
        χ² = Σ (O−E)²/E. Cada célula nasce da diferença entre observado e
        esperado, elevada ao quadrado e dividida pelo esperado.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="py-1.5 font-medium">Célula</th>
              <th className="py-1.5 font-medium text-right">O</th>
              <th className="py-1.5 font-medium text-right">E</th>
              <th className="py-1.5 font-medium text-right">O−E</th>
              <th className="py-1.5 font-medium text-right">(O−E)²</th>
              <th className="py-1.5 font-medium text-right">(O−E)²/E</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.k} className="border-b border-border/40">
                <td className="py-1.5 font-semibold text-foreground">{row.k}</td>
                <td className="py-1.5 text-right tabular-nums text-foreground">{fmtInt(row.o)}</td>
                <td className="py-1.5 text-right tabular-nums text-muted-foreground">{fmt(row.e, 1)}</td>
                <td className="py-1.5 text-right tabular-nums text-foreground">{fmt(row.diff, 2)}</td>
                <td className="py-1.5 text-right tabular-nums text-muted-foreground">{fmt(row.sq, 2)}</td>
                <td className="py-1.5 text-right tabular-nums font-semibold text-teal-700">{fmt(row.contrib, 3)}</td>
              </tr>
            ))}
            <tr className="border-t border-border">
              <td className="py-1.5 font-semibold text-foreground" colSpan={5}>
                χ² total
              </td>
              <td className="py-1.5 text-right tabular-nums font-bold text-foreground">
                {fmt(total, 3)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex h-2.5 rounded-full overflow-hidden border border-border mt-3">
        {rows.map((row, i) => {
          const pct = total > 0 ? (row.contrib / total) * 100 : 0;
          const shades = ['bg-teal-700', 'bg-teal-600', 'bg-teal-500', 'bg-teal-400'];
          return (
            <div
              key={row.k}
              className={`${shades[i]}`}
              style={{ width: `${pct}%` }}
              title={`${row.k}: ${fmt(row.contrib, 3)}`}
            />
          );
        })}
      </div>
    </div>
  );
}

function PorQuePMudou({ r, values }) {
  const n = r.totals.n;
  const scenarios = [0.5, 1, 2].map((scale) => {
    const targetN = Math.max(MIN_N, Math.round(n * scale));
    const scaled = rescaleTable(values, targetN);
    const rr = calculate2x2(scaled.a, scaled.b, scaled.c, scaled.d);
    return {
      label: scale === 0.5 ? 'metade do n' : scale === 1 ? 'atual' : 'dobro do n',
      n: scaled.a + scaled.b + scaled.c + scaled.d,
      chi2: rr.chi2,
      p: rr.pPearson,
      phi: rr.phi,
    };
  });

  return (
    <div>
      <h4 className="font-display text-sm font-semibold text-foreground mb-1">
        Por que o p mudou?
      </h4>
      <p className="text-xs text-muted-foreground italic mb-3">
        O p-valor depende de duas coisas: o tamanho do efeito (φ) e o tamanho da
        amostra (n). Veja o que acontece mantendo as proporções e mudando só o n:
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="py-1.5 font-medium">Tamanho</th>
              <th className="py-1.5 font-medium text-right">n</th>
              <th className="py-1.5 font-medium text-right">χ²</th>
              <th className="py-1.5 font-medium text-right">φ (efeito)</th>
              <th className="py-1.5 font-medium text-right">p</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((s) => (
              <tr
                key={s.label}
                className={`border-b border-border/40 ${s.label === 'atual' ? 'bg-teal-50/50' : ''}`}
              >
                <td className="py-1.5 text-foreground">{s.label}</td>
                <td className="py-1.5 text-right tabular-nums text-muted-foreground">{fmtInt(s.n)}</td>
                <td className="py-1.5 text-right tabular-nums text-foreground">{fmt(s.chi2, 2)}</td>
                <td className="py-1.5 text-right tabular-nums text-muted-foreground">{fmt(s.phi, 3)}</td>
                <td className="py-1.5 text-right tabular-nums font-semibold text-teal-700">{fmtP(s.p)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-foreground/80 mt-3">
        <b>Conclusão:</b> φ não muda — o efeito é o mesmo. Mas χ² cresce
        proporcionalmente a n, e com ele a evidência; por isso o p cai. Um
        resultado "não significativo" pode ser falta de poder (n pequeno), não
        ausência de efeito.
      </p>
    </div>
  );
}

export default function ExplanationPanel({ r, values }) {
  return (
    <div className="space-y-7">
      <StdResiduals r={r} />
      <hr className="border-border" />
      <DeOndeVeioChi2 r={r} />
      <hr className="border-border" />
      <PorQuePMudou r={r} values={values} />
    </div>
  );
}