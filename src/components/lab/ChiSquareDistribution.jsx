import React, { useState } from 'react';
import { chi2Pdf, chi2Quantile } from '@/lib/stats';
import { fmt, fmtP } from '@/lib/format';

export default function ChiSquareDistribution({ r }) {
  const [alpha, setAlpha] = useState(0.05);
  const observed = r.chi2;
  const p = r.pPearson;
  const df = 1;
  const critical = chi2Quantile(df, 1 - alpha);
  const xMax = Math.max(observed * 1.5, critical * 1.25, 8);
  const N = 120;
  const pts = [];
  for (let i = 1; i <= N; i++) {
    const x = (i / N) * xMax;
    pts.push({ x, y: chi2Pdf(x, df) });
  }
  const maxY = Math.max(...pts.map((pp) => pp.y));
  const W = 100;
  const H = 180;
  const sx = (x) => (x / xMax) * W;
  const sy = (y) => H - (y / maxY) * H;
  const linePath = pts
    .map((pp, i) => `${i ? 'L' : 'M'}${sx(pp.x).toFixed(2)} ${sy(pp.y).toFixed(2)}`)
    .join(' ');

  const critPts = pts.filter((pp) => pp.x >= critical);
  const critPath = critPts.length
    ? `M${sx(critical).toFixed(2)} ${H} ` +
      critPts
        .map((pp) => `L${sx(pp.x).toFixed(2)} ${sy(pp.y).toFixed(2)}`)
        .join(' ') +
      ` L${sx(critPts[critPts.length - 1].x).toFixed(2)} ${H} Z`
    : '';

  const tailPts = pts.filter((pp) => pp.x >= observed);
  const tailPath = tailPts.length
    ? `M${sx(observed).toFixed(2)} ${H} ` +
      tailPts
        .map((pp) => `L${sx(pp.x).toFixed(2)} ${sy(pp.y).toFixed(2)}`)
        .join(' ') +
      ` L${sx(tailPts[tailPts.length - 1].x).toFixed(2)} ${H} Z`
    : '';

  const reject = p !== null && p < alpha;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display text-base font-semibold text-foreground">
          Distribuição do χ² (gl = 1)
        </h3>
        <div className="flex items-center gap-1 text-xs rounded-full border border-border p-0.5">
          {[0.1, 0.05, 0.01].map((a) => (
            <button
              key={a}
              onClick={() => setAlpha(a)}
              className={`px-2 py-0.5 rounded-full ${
                alpha === a
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground'
              }`}
            >
              α={a}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground italic mb-3">
        A área à direita da estatística observada é o p-valor.
      </p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full h-44 border border-border rounded-md bg-card"
      >
        {critPath && <path d={critPath} fill="#fecaca" opacity="0.6" />}
        {tailPath && <path d={tailPath} fill="#0f766e" opacity="0.35" />}
        <path d={linePath} fill="none" stroke="#0f766e" strokeWidth="0.6" />
        <line
          x1={sx(observed)}
          y1={0}
          x2={sx(observed)}
          y2={H}
          stroke="#0f766e"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />
        <line
          x1={sx(critical)}
          y1={0}
          x2={sx(critical)}
          y2={H}
          stroke="#ef4444"
          strokeWidth="0.4"
        />
      </svg>
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs mt-3">
        <span className="text-muted-foreground">
          χ² observado: <b className="text-foreground">{fmt(observed, 3)}</b>
        </span>
        <span className="text-muted-foreground">
          p: <b className="text-teal-700">{fmtP(p)}</b>
        </span>
        <span className="text-muted-foreground">
          valor crítico (α={alpha}):{' '}
          <b className="text-foreground">{fmt(critical, 3)}</b>
        </span>
      </div>
      <div
        className={`mt-2 text-sm font-medium ${
          reject ? 'text-red-600' : 'text-foreground'
        }`}
      >
        {p === null
          ? '—'
          : reject
          ? `p < ${alpha} → rejeitar H0.`
          : `p ≥ ${alpha} → não rejeitar H0.`}{' '}
        <span className="text-muted-foreground font-normal">
          Não rejeitar H0 não demonstra que H0 seja verdadeira.
        </span>
      </div>
    </div>
  );
}