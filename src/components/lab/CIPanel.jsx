import React from 'react';
import { fmt, fmtPct, ciText } from '@/lib/format';

function Row({ label, estimate, ci, min, max, color, fmtFn }) {
  const lo = ci?.low;
  const hi = ci?.high;
  const pos = (v) => ((v - min) / (max - min)) * 100;
  const est = estimate !== null && Number.isFinite(estimate);

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="font-medium text-foreground">{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {est ? `${fmtFn(estimate)} [${ciText(ci)}]` : 'não estimável'}
        </span>
      </div>
      <div className="relative h-5 rounded bg-muted/40">
        {min < 0 && max > 0 && (
          <div
            className="absolute top-0 bottom-0 w-px bg-border"
            style={{ left: `${pos(0)}%` }}
          />
        )}
        {est && lo !== null && hi !== null && (
          <>
            <div
              className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded"
              style={{
                left: `${pos(lo)}%`,
                width: `${pos(hi) - pos(lo)}%`,
                background: color,
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-background shadow"
              style={{ left: `calc(${pos(estimate)}% - 6px)`, background: color }}
            />
          </>
        )}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
        <span>{fmtFn(min)}</span>
        <span>{fmtFn(max)}</span>
      </div>
    </div>
  );
}

export default function CIPanel({ r, labels }) {
  return (
    <div>
      <h3 className="font-display text-base font-semibold text-foreground mb-1">
        Intervalos de confiança
      </h3>
      <p className="text-xs text-muted-foreground italic mb-4">
        IC 95% das proporções e da diferença. A largura reflete a incerteza
        amostral.
      </p>
      <Row
        label={`P(desfecho | ${labels.expYes.toLowerCase()})`}
        estimate={r.riskExp}
        ci={r.riskExpCI}
        min={0}
        max={1}
        color="#0f766e"
        fmtFn={(v) => fmtPct(v, 1)}
      />
      <Row
        label={`P(desfecho | ${labels.expNo.toLowerCase()})`}
        estimate={r.riskUnexp}
        ci={r.riskUnexpCI}
        min={0}
        max={1}
        color="#14b8a6"
        fmtFn={(v) => fmtPct(v, 1)}
      />
      <Row
        label="Diferença absoluta (RD)"
        estimate={r.RD}
        ci={r.RDCI}
        min={-1}
        max={1}
        color="#0f766e"
        fmtFn={(v) => fmt(v, 2)}
      />
    </div>
  );
}