import { fmt, fmtInt, fmtPct, fmtP, ciText } from '@/lib/format';

// Gera interpretação em linguagem natural conforme o desenho do estudo.
// Determinística (sem LLM): instantânea, sem custo de créditos e reprodutível.
export function buildInterpretation(type, r, labels) {
  const outOfExposure = labels?.outcomeName?.toLowerCase() || 'o desfecho';
  const expName = labels?.expYes || 'expostos';
  const unexpName = labels?.expNo || 'não expostos';

  const pVal = r.pPearson;
  const significant = pVal !== null && pVal < 0.05;

  // ---- medidas por desenho ----
  const measures = {
    coorte: () => {
      if (r.RR === null) return null;
      const ci = ciText(r.RRCI);
      const protetor = r.RR < 1;
      const nulo = Math.abs(r.RR - 1) < 0.01;
      let frase;
      if (nulo) {
        frase = `O risco de ${outOfExposure} é essencialmente o mesmo em ${expName} e ${unexpName} (RR ≈ 1,00).`;
      } else if (protetor) {
        frase = `${expName} têm ${fmt(1 / r.RR, 1)}× menos risco de ${outOfExposure} que ${unexpName} (RR = ${fmt(r.RR, 2)}).`;
      } else {
        frase = `${expName} têm ${fmt(r.RR, 2)}× mais risco de ${outOfExposure} que ${unexpName}.`;
      }
      const infer = significant
        ? `O IC 95% [${ci}] não inclui 1 e p = ${fmtP(pVal)}, indicando associação estatisticamente significativa.`
        : `O IC 95% [${ci}] inclui 1 e p = ${fmtP(pVal)}: sem evidência de associação. Pode ser falta de poder.`;
      const rd = r.RD !== null
        ? ` A diferença absoluta de risco é de ${fmtPct(Math.abs(r.RD), 1)} ${r.RD >= 0 ? 'a mais' : 'a menos'} nos expostos.`
        : '';
      return `${frase} ${infer}${rd}`;
    },
    caso_controle: () => {
      if (r.OR === null) return null;
      const ci = ciText(r.ORCI);
      const protetor = r.OR < 1;
      const nulo = Math.abs(r.OR - 1) < 0.01;
      let frase;
      if (nulo) {
        frase = `As chances de ${outOfExposure} são semelhantes em ${expName} e ${unexpName} (OR ≈ 1,00).`;
      } else if (protetor) {
        frase = `${expName} têm ${fmt(1 / r.OR, 1)}× menores chances de ${outOfExposure} (OR = ${fmt(r.OR, 2)}).`;
      } else {
        frase = `${expName} têm ${fmt(r.OR, 2)}× maiores chances de ${outOfExposure} que ${unexpName}.`;
      }
      const infer = significant
        ? ` No caso-controle só a OR é interpretável (sem incidência). IC 95% [${ci}] não inclui 1; p = ${fmtP(pVal)} — associação significativa.`
        : ` IC 95% [${ci}] inclui 1; p = ${fmtP(pVal)} — sem associação estatisticamente significativa.`;
      return frase + infer;
    },
    transversal: () => {
      if (r.RR === null) return null;
      const ci = ciText(r.RRCI);
      const protetor = r.RR < 1;
      const nulo = Math.abs(r.RR - 1) < 0.01;
      const prevExp = r.totals.row1 > 0 ? r.a / r.totals.row1 : null;
      const prevUnexp = r.totals.row2 > 0 ? r.c / r.totals.row2 : null;
      let frase;
      if (nulo) {
        frase = `A prevalência de ${outOfExposure} é semelhante nos dois grupos (RP ≈ 1,00).`;
      } else if (protetor) {
        frase = `A prevalência de ${outOfExposure} em ${expName} é ${fmt(1 / r.RR, 1)}× menor que em ${unexpName} (RP = ${fmt(r.RR, 2)}).`;
      } else {
        frase = `A prevalência de ${outOfExposure} em ${expName} é ${fmt(r.RR, 2)}× maior que em ${unexpName} (RP = ${fmt(r.RR, 2)}).`;
      }
      const prev = prevExp !== null && prevUnexp !== null
        ? ` Prevalências: ${fmtPct(prevExp, 1)} (${expName}) vs ${fmtPct(prevUnexp, 1)} (${unexpName}).`
        : '';
      const infer = significant
        ? ` IC 95% [${ci}] não inclui 1; p = ${fmtP(pVal)} — associação significativa (atenção: estudo transversal não estabelece causalidade).`
        : ` IC 95% [${ci}] inclui 1; p = ${fmtP(pVal)} — sem associação significativa.`;
      return frase + prev + infer;
    },
    ensaio: () => {
      if (r.RR === null) return null;
      const ci = ciText(r.RRCI);
      const protetor = r.RR < 1;
      const nulo = Math.abs(r.RR - 1) < 0.01;
      const rrr = 1 - r.RR;
      const rar = r.RD !== null ? -r.RD : null;
      const nnt = rar !== null && rar > 0 ? Math.ceil(1 / rar) : null;
      let frase;
      if (nulo) {
        frase = `A intervenção não altera o risco de ${outOfExposure} (RR ≈ 1,00).`;
      } else if (protetor) {
        frase = `A intervenção reduz o risco de ${outOfExposure} em ${fmtPct(rrr, 1)} (RR = ${fmt(r.RR, 2)}).`;
      } else {
        frase = `A intervenção aumenta o risco de ${outOfExposure} em ${fmtPct(r.RR - 1, 1)} (RR = ${fmt(r.RR, 2)}).`;
      }
      const rarTxt = rar !== null
        ? ` Redução absoluta de risco (RAR) = ${fmtPct(rar, 1)}.`
        : '';
      const nntTxt = nnt !== null
        ? ` NNT = ${fmtInt(nnt)} (a cada ${fmtInt(nnt)} tratados, evita-se um desfecho).`
        : '';
      const infer = significant
        ? ` IC 95% [${ci}] não inclui 1; p = ${fmtP(pVal)}.`
        : ` IC 95% [${ci}] inclui 1; p = ${fmtP(pVal)} — sem significância.`;
      return frase + rarTxt + nntTxt + infer;
    },
  };

  const fn = measures[type] || measures.coorte;
  const text = fn();
  if (!text) return 'Não há dados suficientes para interpretar esta tabela.';
  return text;
}