import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { statTestUrl } from '@/lib/statLab';

// Link para o laboratório de testes do STAT LAB, com a tabela atual.
export default function StatLabLink({ r, labels, test = 'chi', children }) {
  return (
    <a
      href={statTestUrl({
        a: r.a,
        b: r.b,
        c: r.c,
        d: r.d,
        test,
        exposure: labels?.exposureName,
        outcome: labels?.outcomeName,
      })}
      target="_blank"
      rel="noopener"
      className="mt-4 pt-3 border-t border-border flex items-start gap-1.5 text-xs text-teal-700 font-medium no-underline hover:underline"
    >
      <ArrowUpRight className="w-3.5 h-3.5 shrink-0 mt-px" />
      <span>{children}</span>
    </a>
  );
}
