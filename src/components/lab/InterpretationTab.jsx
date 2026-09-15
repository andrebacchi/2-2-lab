import React from 'react';
import { Sparkles } from 'lucide-react';
import { buildInterpretation } from '@/lib/interpretation';
import { studyName } from '@/lib/studyTypes';

export default function InterpretationTab({ r, labels, studyType }) {
  const text = buildInterpretation(studyType, r, labels);

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-foreground mb-1 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-teal-700" />
        Interpretação
      </h3>
      <p className="text-xs text-muted-foreground italic mb-4">
        Leitura contextualizada conforme o desenho selecionado:{' '}
        <span className="font-medium not-italic text-foreground">
          {studyName(studyType)}
        </span>
        .
      </p>

      <div className="rounded-lg border border-teal-200 bg-teal-50/50 px-4 py-3">
        <div className="text-[10px] uppercase tracking-wider text-teal-700 mb-1.5">
          Resultado
        </div>
        <p className="text-sm text-foreground leading-relaxed">{text}</p>
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        Esta interpretação é gerada automaticamente a partir dos valores da
        tabela e do desenho do estudo. Sempre valide o raciocínio clínico e o
        desenho amostral antes de concluir.
      </p>
    </div>
  );
}