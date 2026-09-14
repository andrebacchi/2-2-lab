import React, { useState } from 'react';
import { fmt } from '@/lib/format';

const OR = (a, b, c, d) => (b > 0 && c > 0 ? (a * d) / (b * c) : null);

function StratumInput({ label, values, setValues, editable }) {
  const set = (k, v) => setValues({ ...values, [k]: Math.max(0, Math.round(Number(v) || 0)) });
  const cells = ['a', 'b', 'c', 'd'];
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
        {label}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {cells.map((k) => (
          <div key={k} className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground font-mono w-3">{k}</span>
            <input
              type="number"
              min="0"
              value={values[k]}
              disabled={!editable}
              onChange={(e) => set(k, e.target.value)}
              className="w-full text-sm tabular-nums bg-transparent border border-border rounded px-1.5 py-0.5 focus:border-teal-600 focus:outline-none disabled:bg-muted/40 disabled:text-muted-foreground"
            />
          </div>
        ))}
      </div>
      <div className="mt-2 text-xs text-foreground">
        OR ={' '}
        <span className="font-semibold tabular-nums text-teal-700">
          {OR(values.a, values.b, values.c, values.d) !== null
            ? fmt(OR(values.a, values.b, values.c, values.d), 2)
            : 'não estimável'}
        </span>
      </div>
    </div>
  );
}

export default function StratificationPanel({ r }) {
  const [s2, setS2] = useState({ a: 50, b: 50, c: 30, d: 70 });
  const s1 = { a: r.a, b: r.b, c: r.c, d: r.d };

  const n1 = s1.a + s1.b + s1.c + s1.d;
  const n2 = s2.a + s2.b + s2.c + s2.d;
  const or1 = OR(s1.a, s1.b, s1.c, s1.d);
  const or2 = OR(s2.a, s2.b, s2.c, s2.d);

  const num = (s1.a * s1.d) / n1 + (s2.a * s2.d) / n2;
  const den = (s1.b * s1.c) / n1 + (s2.b * s2.c) / n2;
  const mhOR = den > 0 ? num / den : null;

  const ratio =
    or1 !== null && or2 !== null && Math.min(or1, or2) > 0
      ? Math.max(or1, or2) / Math.min(or1, or2)
      : null;
  const effectMod = ratio !== null && ratio >= 1.5;

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-foreground mb-1">
        Estratificação (Mantel-Haenszel)
      </h3>
      <p className="text-xs text-muted-foreground italic mb-4">
        Divide os dados em estratos para controlar um confundidor. O OR de
        Mantel-Haenszel combina os estratos ponderando pelo tamanho de cada um.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <StratumInput label="Estrato 1 (tabela atual)" values={s1} editable={false} />
        <StratumInput label="Estrato 2" values={s2} setValues={setS2} editable />
      </div>

      <div className="rounded-lg border border-teal-200 bg-teal-50/50 px-4 py-3">
        <div className="text-[10px] uppercase tracking-wider text-teal-700">
          OR combinado (Mantel-Haenszel)
        </div>
        <div className="text-2xl font-semibold tabular-nums text-foreground">
          {mhOR !== null ? fmt(mhOR, 2) : 'não estimável'}
        </div>
        <div className="text-[11px] text-muted-foreground mt-1">
          Pondera cada estrato por 1/n — dá mais peso a estratos maiores.
        </div>
      </div>

      {ratio !== null && (
        <div
          className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 mt-3 text-xs ${
            effectMod
              ? 'border-amber-300 bg-amber-50/60 text-amber-800'
              : 'border-emerald-300 bg-emerald-50/60 text-emerald-800'
          }`}
        >
          {effectMod
            ? `Os ORs diferem ≈${fmt(ratio, 1)}× entre estratos: possível modificação de efeito (interação). Em vez de combinar, reporte os estratos separadamente.`
            : `Os ORs são próximos (razão ≈${fmt(ratio, 1)}×): não há modificação de efeito evidente; o OR combinado é interpretável.`}
        </div>
      )}
    </div>
  );
}