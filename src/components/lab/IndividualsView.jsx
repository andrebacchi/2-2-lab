import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fmtInt } from '@/lib/format';

const CAP = 240; // máximo de pontos por grupo para performance

function Group({ title, count, colorClass, ringClass, reduceMotion }) {
  const shown = Math.min(count, CAP);
  const sampled = count > CAP;
  const dur = reduceMotion ? 0 : 0.35;

  return (
    <div className="mb-4">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs font-medium text-foreground">{title}</span>
        <span className="text-[11px] text-muted-foreground tabular-nums">
          {fmtInt(count)} {sampled && '(amostra visual)'}
        </span>
      </div>
      <div className="flex flex-wrap gap-1 min-h-[28px]">
        <AnimatePresence>
          {Array.from({ length: shown }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: dur, ease: 'easeOut' }}
              className={`w-2.5 h-2.5 rounded-full ${colorClass} ${ringClass}`}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function IndividualsView({ r, labels, reduceMotion }) {
  return (
    <div>
      <h3 className="font-display text-base font-semibold text-foreground mb-1">
        Ver indivíduos
      </h3>
      <p className="text-xs text-muted-foreground italic mb-4">
        Cada ponto representa um indivíduo. A cor indica o desfecho; o grupo
        indica a exposição.
      </p>

      <Group
        title={`${labels.expYes} — ${labels.outYes}`}
        count={r.a}
        colorClass="bg-teal-700"
        ringClass="ring-1 ring-teal-800/20"
        reduceMotion={reduceMotion}
      />
      <Group
        title={`${labels.expYes} — ${labels.outNo}`}
        count={r.b}
        colorClass="bg-teal-200"
        ringClass="ring-1 ring-teal-300/40"
        reduceMotion={reduceMotion}
      />
      <Group
        title={`${labels.expNo} — ${labels.outYes}`}
        count={r.c}
        colorClass="bg-teal-700"
        ringClass="ring-1 ring-teal-800/20"
        reduceMotion={reduceMotion}
      />
      <Group
        title={`${labels.expNo} — ${labels.outNo}`}
        count={r.d}
        colorClass="bg-teal-200"
        ringClass="ring-1 ring-teal-300/40"
        reduceMotion={reduceMotion}
      />
    </div>
  );
}