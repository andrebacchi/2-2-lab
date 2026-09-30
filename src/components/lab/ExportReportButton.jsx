import React, { useRef, useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { LAB_BTN } from './labButtons';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import ReportDocument from './ReportDocument';

export default function ExportReportButton({ r, values, labels, studyType }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);

  const exportPDF = async () => {
    if (!ref.current || busy) return;
    setBusy(true);
    try {
      const canvas = await html2canvas(ref.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW;
      const imgH = (canvas.height * imgW) / canvas.width;
      let heightLeft = imgH;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgW, imgH);
      heightLeft -= pageH;
      while (heightLeft > 0) {
        position -= pageH;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgW, imgH);
        heightLeft -= pageH;
      }
      pdf.save('relatorio-2x2lab.pdf');
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={exportPDF}
        disabled={busy}
        className={`${LAB_BTN} disabled:opacity-60`}
      >
        {busy ? <Loader2 className="animate-spin" /> : <FileText />}
        Exportar relatório
      </button>
      {/* Documento de relatório renderizado fora da tela para captura */}
      <div
        style={{
          position: 'fixed',
          left: -10000,
          top: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
        aria-hidden="true"
      >
        <ReportDocument
          ref={ref}
          r={r}
          values={values}
          labels={labels}
          studyType={studyType}
        />
      </div>
    </>
  );
}