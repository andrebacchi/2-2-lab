// Ligação com o STUDY LAB (tipos de estudos epidemiológicos), nos dois sentidos.
import { STUDY_TYPES } from '@/lib/studyTypes';

const STUDY_LAB = 'https://andrebacchi.github.io/study-lab/';
// chave do desenho aqui → desenho na "Linha do tempo" do STUDY LAB
const KEY = { coorte: 'coorte', caso_controle: 'cc', transversal: 'transversal', ensaio: 'ecr' };

// como o desenho aparece no texto do link
const LABEL = { coorte: 'estudo de coorte', caso_controle: 'estudo de caso-controle', transversal: 'estudo transversal', ensaio: 'ensaio clínico' };
export const studyLabLabel = (type) => LABEL[type] || LABEL.coorte;

// Endereço do STUDY LAB já aberto no desenho selecionado.
export function studyLabUrl(type) {
  return `${STUDY_LAB}#tempo-${KEY[type] || 'coorte'}`;
}

// Tabela enviada pelo STUDY LAB: ?a=12&b=36&c=9&d=63&tipo=coorte
// Devolve { values, type } ou null. Só aceita contagens inteiras e não negativas.
export function readStudyParams(search = window.location.search) {
  try {
    const q = new URLSearchParams(search);
    if (!['a', 'b', 'c', 'd'].every((k) => q.has(k))) return null;
    const values = {};
    for (const k of ['a', 'b', 'c', 'd']) {
      const raw = q.get(k);
      if (!/^\d{1,7}$/.test(raw)) return null;
      values[k] = parseInt(raw, 10);
    }
    const tipo = q.get('tipo');
    return { values, type: STUDY_TYPES[tipo] ? tipo : null };
  } catch {
    return null;
  }
}

// Tira os números do endereço depois de lidos, para recarregar ou compartilhar a página não reabrir a mesma tabela.
export function clearStudyParams() {
  try {
    const u = new URL(window.location.href);
    ['a', 'b', 'c', 'd', 'tipo'].forEach((k) => u.searchParams.delete(k));
    window.history.replaceState(null, '', u.pathname + u.search + u.hash);
  } catch {
    /* ignore */
  }
}
