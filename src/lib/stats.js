// =============================================================
// 2×2 LAB — Camada central de cálculo estatístico
// Toda estatística deriva dos mesmos quatro valores a,b,c,d.
// Os componentes visuais apenas consomem os resultados.
// =============================================================

function sanitize(v) {
  let n = Math.round(Number(v));
  if (!Number.isFinite(n) || n < 0) n = 0;
  return n;
}

// ---- funções especiais (gama incompleta regularizada) ----------
function lnGamma(x) {
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (x < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * x)) - lnGamma(1 - x);
  }
  x -= 1;
  let a = c[0];
  const t = x + g + 0.5;
  for (let i = 1; i < g + 2; i++) a += c[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

// P(a,x) — gama incompleta inferior regularizada
function gammp(a, x) {
  if (x < 0 || a <= 0) return 0;
  if (x === 0) return 0;
  if (x < a + 1) {
    let ap = a;
    let sum = 1 / a;
    let del = sum;
    for (let n = 0; n < 300; n++) {
      ap += 1;
      del *= x / ap;
      sum += del;
      if (Math.abs(del) < Math.abs(sum) * 1e-16) break;
    }
    return sum * Math.exp(-x + a * Math.log(x) - lnGamma(a));
  }
  let b = x + 1 - a;
  let cc = 1 / 1e-30;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i < 300; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    cc = b + an / cc;
    if (Math.abs(cc) < 1e-30) cc = 1e-30;
    d = 1 / d;
    const del = d * cc;
    h *= del;
    if (Math.abs(del - 1) < 1e-16) break;
  }
  return 1 - Math.exp(-x + a * Math.log(x) - lnGamma(a)) * h;
}

// Q(a,x) — cauda superior (usada para p-valor do χ²)
export function gammq(a, x) {
  return 1 - gammp(a, x);
}

const safeDiv = (num, den) => (den > 0 ? num / den : null);
const contrib = (o, e) => (e !== null && e > 0 ? ((o - e) ** 2) / e : null);
const contribYates = (o, e) =>
  e !== null && e > 0 ? (Math.abs(o - e) - 0.5) ** 2 / e : null;

// níveis críticos de z para IC
const Z_LEVELS = { 0.9: 1.644853627, 0.95: 1.959963985, 0.99: 2.575829304 };
export function zForLevel(level) {
  return Z_LEVELS[level] || Z_LEVELS[0.95];
}

// IC de Wilson para uma proporção x/n (exportado para os painéis)
export function proportionCI(x, n, level = 0.95) {
  return wilsonCI(x, n, zForLevel(level));
}

// intervalo de Wilson para uma proporção x/n (adequado para n pequeno)
function wilsonCI(x, n, z) {
  if (!n || n <= 0) return { low: null, high: null };
  const p = x / n;
  const denom = 1 + (z * z) / n;
  const center = (p + (z * z) / (2 * n)) / denom;
  const half =
    (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / denom;
  return { low: Math.max(0, center - half), high: Math.min(1, center + half) };
}

// log-fatorial (com cache) para o teste exato de Fisher
const _lnFactCache = [0];
function lnFact(n) {
  while (_lnFactCache.length <= n) {
    const i = _lnFactCache.length;
    _lnFactCache.push(_lnFactCache[i - 1] + Math.log(i));
  }
  return _lnFactCache[n];
}

// teste exato de Fisher (2×2) — p bilateral e unilaterais
function fisherExact(a, b, c, d) {
  const n = a + b + c + d;
  const row1 = a + b;
  const row2 = c + d;
  const col1 = a + c;
  const col2 = b + d;
  if (n === 0) return { twoSided: null, less: null, greater: null };
  const logP = (k) =>
    lnFact(row1) + lnFact(row2) + lnFact(col1) + lnFact(col2) - lnFact(n) -
    lnFact(k) - lnFact(row1 - k) - lnFact(col1 - k) - lnFact(col2 - (row1 - k));
  const lo = Math.max(0, col1 - row2);
  const hi = Math.min(row1, col1);
  const pObs = logP(a);
  let twoSided = 0;
  let less = 0;
  let greater = 0;
  for (let k = lo; k <= hi; k++) {
    const lp = logP(k);
    const p = Math.exp(lp);
    if (lp <= pObs + 1e-12) twoSided += p;
    if (k <= a) less += p;
    if (k >= a) greater += p;
  }
  return { twoSided, less, greater };
}

// G-test (razão de verossimilhanças), df = 1
function gTest(a, b, c, d, expected) {
  let G = 0;
  const cells = [
    [a, expected.a],
    [b, expected.b],
    [c, expected.c],
    [d, expected.d],
  ];
  for (const [o, e] of cells) {
    if (o > 0 && e !== null && e > 0) G += 2 * o * Math.log(o / e);
  }
  return { G, p: gammq(0.5, G / 2) };
}

// densidade da distribuição qui-quadrado
export function chi2Pdf(x, df = 1) {
  if (x <= 0) return 0;
  const a = df / 2;
  return (
    (Math.pow(x, a - 1) * Math.exp(-x / 2)) /
    (Math.pow(2, a) * Math.exp(lnGamma(a)))
  );
}

// quantil (cauda inferior) da qui-quadrado via bisseção
export function chi2Quantile(df, p) {
  if (p <= 0) return 0;
  if (p >= 1) return Infinity;
  const a = df / 2;
  let lo = 0;
  let hi = 1000;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (gammp(a, mid / 2) < p) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// =============================================================
// calculate2x2 — função central
// retorna totais, proporções, medidas, frequências esperadas,
// χ² (Pearson + Yates), contribuições, resíduos, p-valores, phi.
// Componentes consomem este objeto; nada duplica a lógica.
// =============================================================
export function calculate2x2(a, b, c, d) {
  a = sanitize(a);
  b = sanitize(b);
  c = sanitize(c);
  d = sanitize(d);

  const n = a + b + c + d;
  const row1 = a + b; // expostos
  const row2 = c + d; // não expostos
  const col1 = a + c; // com desfecho
  const col2 = b + d; // sem desfecho

  // proporções por linha, coluna e total
  const proportions = {
    row: {
      a: safeDiv(a, row1),
      b: safeDiv(b, row1),
      c: safeDiv(c, row2),
      d: safeDiv(d, row2),
    },
    col: {
      a: safeDiv(a, col1),
      c: safeDiv(c, col1),
      b: safeDiv(b, col2),
      d: safeDiv(d, col2),
    },
    total: {
      a: safeDiv(a, n),
      b: safeDiv(b, n),
      c: safeDiv(c, n),
      d: safeDiv(d, n),
    },
  };

  // riscos / probabilidades condicionais
  const riskExp = safeDiv(a, row1); // P(desfecho | exposição)
  const riskUnexp = safeDiv(c, row2); // P(desfecho | não exposição)

  // chances (odds)
  const oddsExp = safeDiv(a, b);
  const oddsUnexp = safeDiv(c, d);

  // medidas de associação
  const OR = b > 0 && c > 0 ? (a * d) / (b * c) : null;
  const RR =
    riskExp !== null && riskUnexp !== null && riskUnexp !== 0
      ? riskExp / riskUnexp
      : null;
  const RD =
    riskExp !== null && riskUnexp !== null ? riskExp - riskUnexp : null;

  // intervalos de confiança (95% por padrão)
  const z = zForLevel(0.95);
  const riskExpCI = wilsonCI(a, row1, z);
  const riskUnexpCI = wilsonCI(c, row2, z);

  // IC do RR via método delta no log(RR)
  let RRCI = null;
  if (RR !== null && a > 0 && c > 0) {
    const seRR = Math.sqrt(1 / a - 1 / row1 + 1 / c - 1 / row2);
    RRCI = {
      low: Math.exp(Math.log(RR) - z * seRR),
      high: Math.exp(Math.log(RR) + z * seRR),
    };
  }

  // IC do OR via método delta no log(OR)
  let ORCI = null;
  if (OR !== null && a > 0 && b > 0 && c > 0 && d > 0) {
    const seOR = Math.sqrt(1 / a + 1 / b + 1 / c + 1 / d);
    ORCI = {
      low: Math.exp(Math.log(OR) - z * seOR),
      high: Math.exp(Math.log(OR) + z * seOR),
    };
  }

  // IC da diferença absoluta (RD)
  let RDCI = null;
  if (RD !== null && riskExp !== null && riskUnexp !== null) {
    const seRD = Math.sqrt(
      (riskExp * (1 - riskExp)) / row1 + (riskUnexp * (1 - riskUnexp)) / row2
    );
    RDCI = { low: RD - z * seRD, high: RD + z * seRD };
  }

  // frequências esperadas sob H0
  const expected = {
    a: safeDiv(row1 * col1, n),
    b: safeDiv(row1 * col2, n),
    c: safeDiv(row2 * col1, n),
    d: safeDiv(row2 * col2, n),
  };

  // teste exato de Fisher e G-test
  const fisher = fisherExact(a, b, c, d);
  const gTestRes = gTest(a, b, c, d, expected);

  // contribuições e χ²
  const ca = contrib(a, expected.a);
  const cb = contrib(b, expected.b);
  const cc = contrib(c, expected.c);
  const cd = contrib(d, expected.d);
  const contributions = { a: ca, b: cb, c: cc, d: cd };
  const chi2 = [ca, cb, cc, cd].reduce((s, v) => s + (v ?? 0), 0);

  const ya = contribYates(a, expected.a);
  const yb = contribYates(b, expected.b);
  const yc = contribYates(c, expected.c);
  const yd = contribYates(d, expected.d);
  const chi2Yates = [ya, yb, yc, yd].reduce((s, v) => s + (v ?? 0), 0);

  // resíduos
  const r = (o, e) => (e !== null ? o - e : null);
  const sr = (o, e) => (e !== null && e > 0 ? (o - e) / Math.sqrt(e) : null);
  const residuals = {
    a: r(a, expected.a),
    b: r(b, expected.b),
    c: r(c, expected.c),
    d: r(d, expected.d),
  };
  const stdResiduals = {
    a: sr(a, expected.a),
    b: sr(b, expected.b),
    c: sr(c, expected.c),
    d: sr(d, expected.d),
  };

  // p-valores (df = 1 para tabela 2×2)
  const df = 1;
  const pPearson = n > 0 ? gammq(df / 2, chi2 / 2) : null;
  const pYates = n > 0 ? gammq(df / 2, chi2Yates / 2) : null;

  // phi (tamanho de efeito)
  const phi = n > 0 ? Math.sqrt(chi2 / n) : null;
  const phiSigned = phi !== null ? phi * Math.sign(a * d - b * c) : null;

  return {
    a,
    b,
    c,
    d,
    totals: {
      row1,
      row2,
      col1,
      col2,
      n,
      exposed: row1,
      unexposed: row2,
      withOutcome: col1,
      withoutOutcome: col2,
    },
    proportions,
    riskExp,
    riskUnexp,
    oddsExp,
    oddsUnexp,
    OR,
    RR,
    RD,
    RRCI,
    ORCI,
    RDCI,
    riskExpCI,
    riskUnexpCI,
    expected,
    fisher,
    gTest: gTestRes,
    contributions,
    chi2,
    chi2Yates,
    pPearson,
    pYates,
    residuals,
    stdResiduals,
    phi,
    phiSigned,
  };
}

// n mínimo absoluto: a tabela nunca colapsa para tudo-zero, preservando as proporções
export const MIN_N = 4;

// redimensiona a tabela mantendo as proporções (maior resto) — soma = newN
export function rescaleTable(values, newN) {
  const a = sanitize(values.a);
  const b = sanitize(values.b);
  const c = sanitize(values.c);
  const d = sanitize(values.d);
  const n = a + b + c + d;
  let target = Math.round(Number(newN));
  if (!Number.isFinite(target) || target < MIN_N) target = MIN_N;
  if (n === 0) return { a: 1, b: 1, c: 1, d: 1 };
  if (target === n) return { a, b, c, d };

  const factor = target / n;
  const raw = { a: a * factor, b: b * factor, c: c * factor, d: d * factor };
  const floored = {
    a: Math.floor(raw.a),
    b: Math.floor(raw.b),
    c: Math.floor(raw.c),
    d: Math.floor(raw.d),
  };
  let remainder = target - (floored.a + floored.b + floored.c + floored.d);
  const fracs = ['a', 'b', 'c', 'd']
    .map((k) => ({ k, f: raw[k] - floored[k] }))
    .sort((x, y) => y.f - x.f);

  const result = { ...floored };
  let i = 0;
  while (remainder > 0 && i < fracs.length) {
    result[fracs[i].k] += 1;
    remainder -= 1;
    i += 1;
  }
  i = fracs.length - 1;
  while (remainder < 0 && i >= 0) {
    if (result[fracs[i].k] > 0) {
      result[fracs[i].k] -= 1;
      remainder += 1;
    }
    i -= 1;
  }
  return result;
}

export const PRESETS = [
  { key: 'zerar', name: 'Zerar', a: 0, b: 0, c: 0, d: 0 },
  { key: 'sem_assoc', name: 'Sem associação', a: 50, b: 50, c: 50, d: 50 },
  { key: 'pos_fraca', name: 'Associação positiva fraca', a: 45, b: 55, c: 35, d: 65 },
  { key: 'pos_forte', name: 'Associação positiva forte', a: 70, b: 30, c: 20, d: 80 },
  { key: 'negativa', name: 'Associação negativa (protetora)', a: 20, b: 80, c: 60, d: 40 },
  { key: 'amostra_peq', name: 'Amostra pequena', a: 4, b: 6, c: 1, d: 9 },
  { key: 'amostra_grd', name: 'Amostra grande', a: 400, b: 600, c: 200, d: 800 },
  { key: 'esperadas_peq', name: 'Frequências esperadas pequenas', a: 3, b: 30, c: 0, d: 40, desc: 'Células com E<5: o χ² perde confiabilidade — prefira Fisher.' },
  { key: 'fumo', name: 'Fumo × câncer', a: 90, b: 10, c: 30, d: 70, desc: 'Coorte: tabagismo e câncer de pulmão.' },
  { key: 'vacina', name: 'Vacina × infecção', a: 20, b: 80, c: 60, d: 40, desc: 'Ensaio: vacina reduz o risco (efeito protetor).' },
  { key: 'exame', name: 'Exame × diagnóstico', a: 45, b: 5, c: 15, d: 35, desc: 'Teste diagnóstico: alta sensibilidade e especificidade.' },
];