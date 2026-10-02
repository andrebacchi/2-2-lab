import {
  Clock,
  Search,
  Camera,
  FlaskConical,
} from 'lucide-react';

export const STUDY_TYPES = {
  coorte: {
    name: 'Coorte',
    icon: Clock,
    desc: 'Acompanha expostos e não expostos no tempo até o desfecho. Mede incidência — logo, risco é estimável.',
    measures: [
      { key: 'RR', status: 'recomendada', note: 'Risco Relativo (razão de incidências). Estimativa direta do efeito relativo.' },
      { key: 'RD', status: 'possivel', note: 'Diferença absoluta de risco. Efeito na escala original.' },
      { key: 'RA', status: 'possivel', note: 'Risco atribuível = risco nos expostos − risco nos não expostos (impacto absoluto da exposição).' },
      { key: 'RAP', status: 'possivel', note: 'Risco atribuível à população = RA × prevalência da exposição. Estima o impacto na população total; informe abaixo a prevalência da exposição na população de interesse.' },
      { key: 'OR', status: 'possivel', note: 'Válido, mas só aproxima o RR se o desfecho for raro.' },
    ],
  },
  caso_controle: {
    name: 'Caso-controle',
    icon: Search,
    desc: 'Amostragem por desfecho. Os totais das linhas são fixados pelo desenho — não há incidência.',
    measures: [
      { key: 'OR', status: 'recomendada', note: 'Única medida válida: a odds ratio é independente da amostragem por desfecho.' },
      { key: 'RR', status: 'nao', note: 'Não aplicável: sem incidência, o "risco" é artefato da forma como você amostrou.' },
      { key: 'RD', status: 'nao', note: 'Não aplicável: a diferença de riscos não tem significado sem incidência.' },
    ],
  },
  transversal: {
    name: 'Transversal',
    icon: Camera,
    desc: 'Um único momento no tempo. Mede prevalência, não incidência.',
    measures: [
      { key: 'RP', status: 'recomendada', note: 'Razão de prevalências — o "RR" da tabela, reinterpretado como prevalência.' },
      { key: 'RD', status: 'possivel', note: 'Diferença de prevalências.' },
      { key: 'OR', status: 'possivel', note: 'Razão de odds de prevalência; aproxima a RP se a prevalência for baixa.' },
    ],
  },
  ensaio: {
    name: 'Ensaio clínico',
    icon: FlaskConical,
    desc: 'Intervenção alocada → desfecho. Como coorte, mas a exposição é manipulada pelo pesquisador.',
    measures: [
      { key: 'RR', status: 'recomendada', note: 'Razão de riscos entre intervenção e controle.' },
      { key: 'RRR', status: 'recomendada', note: 'Redução relativa do risco = 1 − RR.' },
      { key: 'RAR', status: 'recomendada', note: 'Redução absoluta do risco (ARR) = risco_controle − risco_tratado.' },
      { key: 'NNT', status: 'recomendada', note: 'Número necessário para tratar = 1/RAR (quanto menor, mais eficaz).' },
      { key: 'OR', status: 'possivel', note: 'Válido, mas menos intuitivo que RR/RAR em ensaios.' },
    ],
  },
};

export const STUDY_ORDER = ['coorte', 'caso_controle', 'transversal', 'ensaio'];

export function studyName(type) {
  return STUDY_TYPES[type]?.name || type;
}