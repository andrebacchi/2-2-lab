import React, { forwardRef } from 'react';
import { fmt, fmtInt, fmtPct, fmtP, ciText } from '@/lib/format';
import { buildInterpretation } from '@/lib/interpretation';
import { studyName, STUDY_TYPES } from '@/lib/studyTypes';

// Documento visual de relatório — renderizado fora da tela e capturado por html2canvas.
const ReportDocument = forwardRef(function ReportDocument(
  { r, values, labels, studyType },
  ref
) {
  const { a, b, c, d } = values;
  const row1 = a + b;
  const row2 = c + d;
  const col1 = a + c;
  const col2 = b + d;
  const n = a + b + c + d;

  const interp = buildInterpretation(studyType, r, labels);
  const study = STUDY_TYPES[studyType] || STUDY_TYPES.coorte;
  const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  // escala do gráfico de grupos
  const maxRisk = Math.max(r.riskExp ?? 0, r.riskUnexp ?? 0, 0.001);
  const barH = (v) => `${Math.max(2, (v / maxRisk) * 100)}%`;

  const Cell = ({ children, accent }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 52,
        fontSize: 20,
        fontWeight: 600,
        fontFamily: 'Inter, sans-serif',
        color: '#2b1f24',
        background: accent === 'teal' ? '#f7e8ee' : accent === 'slate' ? '#f1f5f7' : '#ffffff',
        border: '1px solid #e2d8dc',
      }}
    >
      {children}
    </div>
  );

  const totalCell = (v) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 52,
        fontSize: 18,
        fontWeight: 600,
        color: '#665a5f',
        background: '#f7fafafa',
        border: '1px solid #e2d8dc',
      }}
    >
      {fmtInt(v)}
    </div>
  );

  const Stat = ({ label, value, sub }) => (
    <div
      style={{
        flex: 1,
        minWidth: 120,
        border: '1px solid #ebe4e7',
        borderRadius: 8,
        padding: '10px 12px',
        background: '#ffffff',
      }}
    >
      <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5, color: '#877b80' }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 600, color: '#2b1f24', marginTop: 2 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: '#877b80', marginTop: 2 }}>{sub}</div>}
    </div>
  );

  return (
    <div
      ref={ref}
      style={{
        width: 800,
        background: '#ffffff',
        padding: 40,
        fontFamily: 'Inter, sans-serif',
        color: '#2b1f24',
        boxSizing: 'border-box',
      }}
    >
      {/* Cabeçalho */}
      <div style={{ borderBottom: '2px solid #5c1f39', paddingBottom: 14, marginBottom: 20 }}>
        <div style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: 30, fontWeight: 600, color: '#5c1f39' }}>
          2×2 LAB — Relatório de Análise
        </div>
        <div style={{ fontSize: 11, color: '#877b80', marginTop: 6 }}>
          Gerado em {now} · Desenho: {studyName(studyType)} · {labels.exposureName} × {labels.outcomeName}
        </div>
      </div>

      {/* Tabela 2x2 */}
      <div style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: 16, fontWeight: 600, marginBottom: 10 }}>
        Tabela de contingência 2×2
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 90px', gap: 4, marginBottom: 24 }}>
        <div style={{ height: 30 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#877b80' }}>{labels.outYes}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#877b80' }}>{labels.outNo}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, textTransform: 'uppercase', color: '#877b80' }}>Total</div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#665a5f' }}>{labels.expYes}</div>
        <Cell accent="teal">{fmtInt(a)}</Cell>
        <Cell accent="slate">{fmtInt(b)}</Cell>
        {totalCell(row1)}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#665a5f' }}>{labels.expNo}</div>
        <Cell accent="teal">{fmtInt(c)}</Cell>
        <Cell accent="slate">{fmtInt(d)}</Cell>
        {totalCell(row2)}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, textTransform: 'uppercase', color: '#877b80', borderTop: '1px solid #e2d8dc' }}>Total</div>
        <div style={{ borderTop: '1px solid #e2d8dc' }}>{totalCell(col1)}</div>
        <div style={{ borderTop: '1px solid #e2d8dc' }}>{totalCell(col2)}</div>
        <div style={{ borderTop: '1px solid #e2d8dc' }}>{totalCell(n)}</div>
      </div>

      {/* Resumo estatístico */}
      <div style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: 16, fontWeight: 600, marginBottom: 10 }}>
        Resumo estatístico
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <Stat label="N" value={fmtInt(n)} sub="total de indivíduos" />
        <Stat label="P(desfecho | expostos)" value={fmtPct(r.riskExp, 1)} sub={`${fmtInt(a)} / ${fmtInt(row1)}`} />
        <Stat label="P(desfecho | não expostos)" value={fmtPct(r.riskUnexp, 1)} sub={`${fmtInt(c)} / ${fmtInt(row2)}`} />
        <Stat label="RR / RP" value={fmt(r.RR, 2)} sub={`IC 95%: ${ciText(r.RRCI)}`} />
        <Stat label="OR" value={fmt(r.OR, 2)} sub={`IC 95%: ${ciText(r.ORCI)}`} />
        <Stat label="RD" value={fmtPct(r.RD, 1)} sub={`IC 95%: ${ciText(r.RDCI)}`} />
      </div>

      {/* Gráfico de grupos */}
      <div style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: 16, fontWeight: 600, marginBottom: 10 }}>
        Grupos — risco de {labels.outcomeName.toLowerCase()}
      </div>
      <div style={{ border: '1px solid #ebe4e7', borderRadius: 8, padding: 18, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-end', height: 200 }}>
          {[
            { name: labels.expYes, risk: r.riskExp, ci: r.riskExpCI, color: '#5c1f39' },
            { name: labels.expNo, risk: r.riskUnexp, ci: r.riskUnexpCI, color: '#8a7a80' },
          ].map((g) => (
            <div key={g.name} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#2b1f24', marginBottom: 4 }}>
                {fmtPct(g.risk, 1)}
              </div>
              <div style={{ width: '70%', height: 150, background: '#f1f5f7', borderRadius: 6, display: 'flex', alignItems: 'flex-end', overflow: 'visible' }}>
                <div style={{ width: '100%', height: barH(g.risk), background: g.color, borderRadius: 6 }} />
              </div>
              <div style={{ fontSize: 11, color: '#877b80', marginTop: 8 }}>{g.name}</div>
              <div style={{ fontSize: 9, color: '#a89ca1' }}>IC 95%: {ciText(g.ci)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Testes */}
      <div style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: 16, fontWeight: 600, marginBottom: 10 }}>
        Testes de hipótese
      </div>
      <div style={{ fontSize: 12, lineHeight: 1.8, color: '#44383d', marginBottom: 24 }}>
        <div>Qui-quadrado (Pearson): <b>{fmt(r.chi2, 3)}</b> · p = {fmtP(r.pPearson)}</div>
        <div>Qui-quadrado (Yates): <b>{fmt(r.chi2Yates, 3)}</b> · p = {fmtP(r.pYates)}</div>
        <div>Fisher exato: p = {fmtP(r.fisher?.twoTail)}</div>
        <div>Coeficiente φ: <b>{fmt(r.phi, 3)}</b></div>
      </div>

      {/* Interpretação */}
      <div style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: 16, fontWeight: 600, marginBottom: 10 }}>
        Interpretação
      </div>
      <div style={{ border: '1px solid #ecc6d4', background: '#fbf3f6', borderRadius: 8, padding: 16, fontSize: 13, lineHeight: 1.6, color: '#2b1f24' }}>
        {interp}
      </div>
      <div style={{ fontSize: 9, color: '#a89ca1', marginTop: 20, textAlign: 'center', borderTop: '1px solid #ebe4e7', paddingTop: 12 }}>
        Relatório gerado pelo 2×2 LAB — laboratório educacional de tabelas 2×2.
      </div>
    </div>
  );
});

export default ReportDocument;