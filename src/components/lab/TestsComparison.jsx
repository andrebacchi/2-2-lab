import React from 'react';
import { fmt, fmtP } from '@/lib/format';

export default function TestsComparison({ r }) {
  const rows = [
    { name: 'Pearson', stat: r.chi2, p: r.pPearson, note: 'aproximação padrão' },
    {
      name: 'Yates (correção de continuidade)',
      stat: r.chi2Yates,
      p: r.pYates,
      note: 'mais conservador',
    },
    {
      name: 'Fisher (exato)',
      stat: null,
      p: r.fisher?.twoSided,
      note: 'recomendado p/ freq. esperadas pequenas',
      exact: true,
    },
    {
      name: 'G-test (razão de verossimilhanças)',
      stat: r.gTest?.G,
      p: r.gTest?.p,
      note: 'alternativo',
    },
  ];
  const smallExpected = ['a', 'b', 'c', 'd'].some(
    (k) => r.expected[k] !== null && r.expected[k] < 5
  );

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-foreground mb-1">
        Compare os testes
      </h3>
      <p className="text-xs text-muted-foreground italic mb-4">
        Pearson, Yates, Fisher e G-test aplicados à mesma tabela.
      </p>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
            <th className="py-2 font-medium">Teste</th>
            <th className="py-2 font-medium text-right">Estatística</th>
            <th className="py-2 font-medium text-right">p</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-border/60">
              <td className="py-2.5">
                <div className="text-foreground">{row.name}</div>
                <div className="text-[10px] text-muted-foreground">
                  {row.note}
                </div>
              </td>
              <td className="py-2.5 text-right tabular-nums text-foreground">
                {row.exact ? '—' : fmt(row.stat, 3)}
              </td>
              <td className="py-2.5 text-right tabular-nums text-teal-700">
                {fmtP(row.p)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {smallExpected && (
        <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
          <b>Atenção:</b> há frequência esperada menor que 5. A aproximação do
          qui-quadrado pode não ser adequada — considere o teste exato de
          Fisher.
        </div>
      )}
    </div>
  );
}