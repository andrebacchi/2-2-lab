import React from 'react';

// Nomograma de Fagan — três eixos logarítmicos: pré-teste, LR, pós-teste.
// A linha reta liga pré-teste → LR → pós-teste (propriedade geométrica do log-odds).
const LMAX = 3; // alcance do log10(odds) ≈ ±3 cobre 0,1% a 99,9%

const log10odds = (p) => Math.log10(p / (1 - p));
const yLeft = (p, PH) => ((LMAX - log10odds(p)) / (2 * LMAX)) * PH;
const yRight = (p, PH) => ((LMAX + log10odds(p)) / (2 * LMAX)) * PH;
const yMid = (v, PH) => PH / 2 + (Math.log10(v) * PH) / (4 * LMAX);

const PROB_LABELS = [0.01, 0.05, 0.1, 0.2, 0.3, 0.5, 0.7, 0.9, 0.95];
const LR_LABELS = [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100];

const clampP = (p) => Math.min(0.999, Math.max(0.001, p));

function probLabel(p) {
  return p < 0.01 ? `${(p * 100).toFixed(1)}%` : `${Math.round(p * 100)}%`;
}

export default function FaganNomogram({ pre, lrPlus, lrMinus, postPos, postNeg }) {
  const PH = 300;
  const PAD = 28;
  const W = 360;
  const xL = 40;
  const xR = W - 40;
  const xM = (xL + xR) / 2;
  const top = PAD;
  const bot = PAD + PH;
  const H = bot + PAD;

  const preC = clampP(pre);
  const posC = clampP(postPos);
  const negC = clampP(postNeg);

  const yL = (p) => top + yLeft(p, PH);
  const yR = (p) => top + yRight(p, PH);
  const yM = (v) => top + yMid(v, PH);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full max-w-md mx-auto"
      role="img"
      aria-label="Nomograma de Fagan"
    >
      {/* títulos dos eixos */}
      <text x={xL} y={top - 10} textAnchor="middle" className="fill-muted-foreground" fontSize="10">
        Pré-teste
      </text>
      <text x={xM} y={top - 10} textAnchor="middle" className="fill-muted-foreground" fontSize="10">
        LR
      </text>
      <text x={xR} y={top - 10} textAnchor="middle" className="fill-muted-foreground" fontSize="10">
        Pós-teste
      </text>

      {/* eixos */}
      <line x1={xL} y1={top} x2={xL} y2={bot} className="text-border" stroke="currentColor" />
      <line x1={xR} y1={top} x2={xR} y2={bot} className="text-border" stroke="currentColor" />
      <line x1={xM} y1={top} x2={xM} y2={bot} className="text-border" stroke="currentColor" strokeDasharray="2 3" />

      {/* prob ticks — esquerda */}
      {PROB_LABELS.map((p) => (
        <g key={`l${p}`}>
          <line x1={xL - 4} y1={yL(p)} x2={xL} y2={yL(p)} className="text-muted-foreground" stroke="currentColor" />
          <text x={xL - 7} y={yL(p) + 3} textAnchor="end" className="fill-muted-foreground" fontSize="8">
            {probLabel(p)}
          </text>
        </g>
      ))}
      {/* prob ticks — direita (espelhada) */}
      {PROB_LABELS.map((p) => (
        <g key={`r${p}`}>
          <line x1={xR} y1={yR(p)} x2={xR + 4} y2={yR(p)} className="text-muted-foreground" stroke="currentColor" />
          <text x={xR + 7} y={yR(p) + 3} textAnchor="start" className="fill-muted-foreground" fontSize="8">
            {probLabel(p)}
          </text>
        </g>
      ))}
      {/* LR ticks — meio */}
      {LR_LABELS.map((v) => (
        <g key={`m${v}`}>
          <line x1={xM - 4} y1={yM(v)} x2={xM + 4} y2={yM(v)} className="text-muted-foreground" stroke="currentColor" />
          <text x={xM + (v >= 1 ? 8 : -8)} y={yM(v) + 3} textAnchor={v >= 1 ? 'start' : 'end'} className="fill-muted-foreground" fontSize="8">
            {v}
          </text>
        </g>
      ))}

      {/* linha do teste positivo */}
      <line x1={xL} y1={yL(preC)} x2={xR} y2={yR(posC)} className="text-teal-700" stroke="currentColor" strokeWidth="2.5" />
      <circle cx={xM} cy={yM(lrPlus)} r="3.5" className="text-teal-700" fill="currentColor" />
      <circle cx={xL} cy={yL(preC)} r="3" className="text-teal-700" fill="currentColor" />
      <circle cx={xR} cy={yR(posC)} r="3" className="text-teal-700" fill="currentColor" />

      {/* linha do teste negativo */}
      <line x1={xL} y1={yL(preC)} x2={xR} y2={yR(negC)} className="text-rose-500" stroke="currentColor" strokeWidth="2" strokeDasharray="5 3" />
      <circle cx={xM} cy={yM(lrMinus)} r="3.5" className="text-rose-500" fill="currentColor" />
      <circle cx={xR} cy={yR(negC)} r="3" className="text-rose-500" fill="currentColor" />
    </svg>
  );
}