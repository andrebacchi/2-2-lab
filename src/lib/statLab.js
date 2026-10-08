// Ligação com o STAT LAB: leva a tabela 2×2 para o laboratório de testes (qui-quadrado, Fisher ou McNemar).
// Regra da família BACCHI LAB: números no endereço (?...), tela depois do #, origem em "de".
const STAT_LAB = 'https://andrebacchi.github.io/stat-lab/';
const NOMES_PADRAO = ['exposição', 'desfecho', ''];

export function statTestUrl({ a, b, c, d, test = 'chi', exposure, outcome }) {
  const q = new URLSearchParams();
  [['a', a], ['b', b], ['c', c], ['d', d]].forEach(([k, v]) => q.set(k, String(Math.max(0, Math.round(Number(v) || 0)))));
  const nome = (s) => String(s || '').trim().slice(0, 40);
  if (test !== 'mcn') {
    if (!NOMES_PADRAO.includes(nome(exposure).toLowerCase())) q.set('ex', nome(exposure));
    if (!NOMES_PADRAO.includes(nome(outcome).toLowerCase())) q.set('ds', nome(outcome));
  }
  q.set('de', '2-2-lab');
  return `${STAT_LAB}?${q.toString()}#testes-${test}`;
}
