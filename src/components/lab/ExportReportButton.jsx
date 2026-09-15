import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { fmt, fmtInt, fmtPct, fmtP, ciText } from '@/lib/format';
import { buildInterpretation } from '@/lib/interpretation';
import { studyName } from '@/lib/studyTypes';

function sanitize(s) {
  return String(s)
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/×/g, 'x')
    .replace(/≈/g, '~')
    .replace(/[^\x00-\xFF]/g, '');
}

export default function ExportReportButton({ r, values, labels, studyType }) {
  const [busy, setBusy] = useState(false);

  const exportPDF = () => {
    setBusy(true);
    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 16;
      const maxW = pageW - margin * 2;
      let y = margin;

      const ensure = (h) => {
        if (y + h > pageH - margin) {
          doc.addPage();
          y = margin;
        }
      };

      const line = (text, opts = {}) => {
        const { size = 10, bold = false, color = [20, 20, 20], gap = 2, indent = 0 } = opts;
        doc.setFontSize(size);
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setTextColor(...color);
        const wrapped = doc.splitTextToSize(sanitize(text), maxW - indent);
        wrapped.forEach((w) => {
          ensure(size * 0.45 + gap);
          doc.text(w, margin + indent, y);
          y += size * 0.45 + gap;
        });
      };

      const sectionTitle = (t) => {
        y += 3;
        line(t, { size: 12, bold: true, color: [15, 76, 76], gap: 3 });
        doc.setDrawColor(15, 76, 76);
        doc.setLineWidth(0.3);
        ensure(2);
        doc.line(margin, y, margin + maxW, y);
        y += 3;
      };

      // Cabeçalho
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 76, 76);
      doc.text('2x2 LAB - Relatorio de Analise', margin, y + 4);
      y += 12;
      const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      line(`Gerado em: ${now}`, { size: 8, color: [110, 110, 110], gap: 1 });
      line(`Desenho do estudo: ${sanitize(studyName(studyType))}`, { size: 9, color: [60, 60, 60], gap: 1 });
      line(`Variaveis: ${sanitize(labels.exposureName)} x ${sanitize(labels.outcomeName)}`, { size: 9, color: [60, 60, 60], gap: 4 });

      // Tabela 2x2
      sectionTitle('Tabela de contingencia 2x2');
      const { a, b, c, d } = values;
      const row1 = a + b, row2 = c + d, col1 = a + c, col2 = b + d, n = a + b + c + d;
      const cellW = maxW / 4;
      const rowH = 9;
      const drawRow = (vals, isHeader = false) => {
        ensure(rowH);
        vals.forEach((v, idx) => {
          const x = margin + idx * cellW;
          doc.setDrawColor(180, 180, 180);
          doc.setLineWidth(0.2);
          doc.rect(x, y, cellW, rowH);
          doc.setFontSize(isHeader ? 8 : 10);
          doc.setFont('helvetica', isHeader ? 'bold' : 'normal');
          doc.setTextColor(...(isHeader ? [110, 110, 110] : [20, 20, 20]));
          doc.text(sanitize(String(v)), x + cellW / 2, y + rowH / 2 + 1.5, { align: 'center' });
        });
        y += rowH;
      };
      drawRow(['', sanitize(labels.outYes), sanitize(labels.outNo), 'Total'], true);
      drawRow([sanitize(labels.expYes), fmtInt(a), fmtInt(b), fmtInt(row1)]);
      drawRow([sanitize(labels.expNo), fmtInt(c), fmtInt(d), fmtInt(row2)]);
      drawRow(['Total', fmtInt(col1), fmtInt(col2), fmtInt(n)]);
      y += 2;
      line(`Total de individuos (n): ${fmtInt(n)}`, { size: 9, color: [90, 90, 90] });

      // Medidas de associacao
      sectionTitle('Medidas de associacao');
      const mk = (label, val, ci) =>
        `${label}: ${val}${ci ? `  (IC 95%: ${ci})` : ''}`;
      line(mk('RR / RP', r.RR !== null ? fmt(r.RR, 2) : '-', ciText(r.RRCI)), { size: 10, gap: 1.5 });
      line(mk('OR', r.OR !== null ? fmt(r.OR, 2) : '-', ciText(r.ORCI)), { size: 10, gap: 1.5 });
      line(mk('RD', r.RD !== null ? fmtPct(r.RD, 1) : '-', ciText(r.RDCI)), { size: 10, gap: 1.5 });
      line(`Risco (expostos): ${fmtPct(r.riskExp, 1)}  |  Risco (nao expostos): ${fmtPct(r.riskUnexp, 1)}`, { size: 9, color: [90, 90, 90], gap: 3 });

      // Testes estatisticos
      sectionTitle('Testes de hipotese');
      line(`Qui-quadrado (Pearson): ${fmt(r.chi2, 3)}  (p = ${fmtP(r.pPearson)})`, { size: 10, gap: 1.5 });
      line(`Qui-quadrado (Yates): ${fmt(r.chi2Yates, 3)}  (p = ${fmtP(r.pYates)})`, { size: 10, gap: 1.5 });
      line(`Fisher exato: p = ${fmtP(r.fisher?.twoTail)}`, { size: 10, gap: 1.5 });
      line(`Coeficiente phi: ${fmt(r.phi, 3)}`, { size: 10, gap: 3 });

      // Interpretacao
      sectionTitle('Interpretacao');
      const interp = buildInterpretation(studyType, r, labels);
      line(interp, { size: 10, gap: 3 });

      // Rodape
      ensure(8);
      y = pageH - 12;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, margin + maxW, y);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(130, 130, 130);
      doc.text('Relatorio gerado pelo 2x2 LAB - laboratorio educacional de tabelas 2x2.', margin, y + 4);

      doc.save('relatorio-2x2lab.pdf');
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={exportPDF}
      disabled={busy}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors whitespace-nowrap disabled:opacity-60"
    >
      {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
      Exportar relatório
    </button>
  );
}