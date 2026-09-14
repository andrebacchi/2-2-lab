import React from 'react';

// Nomograma de Fagan — orientação clássica.
// Esquerda: prob. pré-teste (0,1 no topo → 99 embaixo).
// Centro: razão de verossimilhança (1000 no topo → 0,001 embaixo; 1 no meio).
// Direita: prob. pós-teste (99 no topo → 0,1 embaixo) — espelhada.
// Posição pré→LR→pós alinhada em reta (propriedade do log-odds).

const LMAX = 3; // log10(odds) ≈ ±3 cobre 0,1% a 99,9%

const log10odds = (p) => Math.log10(p / (1 - p));
// esquerda: baixa prob no topo
const yLeft = (p, PH) => ((log10odds(p) + LMAX) / (2 * LMAX)) * PH;
// direita (espelhada): alta prob no topo
const yRight = (p, PH) => ((LMAX - log10odds(p)) / (2 * LMAX)) * PH;
// centro: LR alto no topo, 1 no meio
const yMid = (v, PH) => PH / 2 - (Math.log10(v) * PH) / (4 * LMAX);

const PROB_TICKS = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99];
const LR_TICKS = [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];

const clampP = (p) => Math.min(0.999, Math.max(0.001, p));
const dec = (n) => String(n).replace('.', ',');

export default function FaganNomogram({ pre, lrPlus, lrMinus, postPos, postNeg }) {
  const PH = 320;
  const TOP = 16;
  const BOT = TOP + PH;
  const W = 430;
  const H = BOT + 12;
  const xL = 50;
  const xR = W - 50;
  const xM = (xL + xR) / 2;

  const preC = clampP(pre);
  const posC = clampP(postPos);
  const negC = clampP(postNeg);

  const yL = (p) => TOP + yLeft(p, PH);
  const yR = (p) => TOP + yRight(p, PH);
  const yM = (v) => TOP + yMid(v, PH);

  return (
    <div className="rounded-xl border border-border bg-muted/60 p-4">
      <div className="text-center font-display text-sm font-semibold text-foreground mb-2">
        Nomograma de Fagan
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg mx-auto" role="img" aria-label="Nomograma de Fagan">
        {/* eixos */}
        <line x1={xL} y1={TOP} x2={xL} y2={BOT} className="text-foreground" stroke="currentColor" strokeWidth="1" />
        <line x1={xR} y1={TOP} x2={xR} y2={BOT} className="text-foreground" stroke="currentColor" strokeWidth="1" />
        <line x1={xM} y1={TOP} x2={xM} y2={BOT} className="text-foreground" stroke="currentColor" strokeWidth="1" />

        {/* pré-teste — esquerda */}
        {PROB_TICKS.map((v) => {
          const p = v / 100;
          return (
            <g key={`l${v}`}>
              <line x1={xL - 4} y1={yL(p)} x2={xL} y2={yL(p)} className="text-foreground" stroke="currentColor" strokeWidth="1" />
              <text x={xL - 7} y={yL(p) + 2.5} textAnchor="end" className="fill-foreground" fontSize="7">
                {dec(v)}
              </text>
            </g>
          );
        })}

        {/* pós-teste — direita */}
        {PROB_TICKS.map((v) => {
          const p = v / 100;
          return (
            <g key={`r${v}`}>
              <line x1={xR} y1={yR(p)} x2={xR + 4} y2={yR(p)} className="text-foreground" stroke="currentColor" strokeWidth="1" />
              <text x={xR + 7} y={yR(p) + 2.5} textAnchor="start" className="fill-foreground" fontSize="7">
                {dec(v)}
              </text>
            </g>
          );
        })}

        {/* LR — centro */}
        {LR_TICKS.map((v) => (
          <g key={`m${v}`}>
            <line x1={xM - 3} y1={yM(v)} x2={xM + 3} y2={yM(v)} className="text-foreground" stroke="currentColor" strokeWidth="1" />
            <text x={xM + 6} y={yM(v) + 2.5} textAnchor="start" className="fill-foreground" fontSize="6.5">
              {dec(v)}
            </text>
          </g>
        ))}

        {/* linha do teste positivo (sobe) */}
        <line x1={xL} y1={yL(preC)} x2={xR} y2={yR(posC)} className="text-teal-700" stroke="currentColor" strokeWidth="2.5" />
        <circle cx={xM} cy={yM(lrPlus)} r="3.5" className="text-teal-700" fill="currentColor" />
        <circle cx={xL} cy={yL(preC)} r="3" className="text-teal-700" fill="currentColor" />
        <circle cx={xR} cy={yR(posC)} r="3" className="text-teal-700" fill="currentColor" />

        {/* linha do teste negativo (desce) */}
        <line x1={xL} y1={yL(preC)} x2={xR} y2={yR(negC)} className="text-rose-500" stroke="currentColor" strokeWidth="2" strokeDasharray="5 3" />
        <circle cx={xM} cy={yM(lrMinus)} r="3.5" className="text-rose-500" fill="currentColor" />
        <circle cx={xR} cy={yR(negC)} r="3" className="text-rose-500" fill="currentColor" />
      </svg>
      <div className="grid grid-cols-3 text-center text-[11px] text-muted-foreground mt-2 px-2">
        <span>Probabilidade<br />pré-teste</span>
        <span>Razão de<br />verossimilhança</span>
        <span>Probabilidade<br />pós-teste</span>
      </div>
      <div className="flex items-center justify-center gap-4 mt-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-0.5 bg-teal-700" /> teste positivo
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 border-t-2 border-dashed border-rose-500" /> teste negativo
        </span>
      </div>
    </div>
  );
}