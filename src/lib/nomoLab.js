// Ligação com o Nomo LAB: leva sensibilidade, especificidade e pré-teste para o nomograma de Fagan.
// Regra da família BACCHI LAB: números no endereço (?...), tela depois do #, origem em "de".
const NOMO_LAB = 'https://andrebacchi.github.io/nomo-lab/';
const r4 = (x) => String(Math.round(x * 10000) / 10000);
const NOMES_PADRAO = ['exposição', 'desfecho', ''];

export function nomoDxUrl({ se, sp, nD, nH, pre, test, disease }) {
  const q = new URLSearchParams();
  q.set('se', r4(se));
  q.set('sp', r4(sp));
  if (nD > 0) q.set('nd', String(nD));
  if (nH > 0) q.set('nh', String(nH));
  if (pre > 0 && pre < 1) q.set('pre', r4(pre));
  const nome = (s) => String(s || '').trim().slice(0, 40);
  if (!NOMES_PADRAO.includes(nome(test).toLowerCase())) q.set('ts', nome(test));
  if (!NOMES_PADRAO.includes(nome(disease).toLowerCase())) q.set('dz', nome(disease));
  q.set('de', '2-2-lab');
  return `${NOMO_LAB}?${q.toString()}#dx`;
}
