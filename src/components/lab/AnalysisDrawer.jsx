import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bookmark, History, Trash2, RotateCcw, Trash } from 'lucide-react';
import { fmtInt } from '@/lib/format';

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'agora';
  if (s < 3600) return `${Math.floor(s / 60)} min atrás`;
  if (s < 86400) return `${Math.floor(s / 3600)} h atrás`;
  return `${Math.floor(s / 86400)} d atrás`;
}

export default function AnalysisDrawer({
  open,
  onOpenChange,
  history,
  saved,
  onSave,
  onRemove,
  onRestore,
  onClearHistory,
}) {
  const [name, setName] = useState('');

  const submit = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    setName('');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Minhas análises</SheetTitle>
          <SheetDescription>
            Histórico automático e análises salvas no navegador.
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="salvas" className="mt-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="salvas">
              <Bookmark className="w-3.5 h-3.5 mr-1" /> Salvas
            </TabsTrigger>
            <TabsTrigger value="historico">
              <History className="w-3.5 h-3.5 mr-1" /> Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="salvas" className="space-y-3 mt-3">
            <div className="flex gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome da análise"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submit();
                }}
              />
              <Button onClick={submit} size="sm">
                Salvar
              </Button>
            </div>
            {saved.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-6">
                Nenhuma análise salva ainda.
              </p>
            ) : (
              <div className="space-y-2">
                {saved.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-lg border border-border bg-card px-3 py-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-medium text-foreground truncate">
                        {s.name}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => onRestore(s)}
                          className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
                          title="Restaurar"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onRemove(s.id)}
                          className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-destructive"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground tabular-nums">
                      a={fmtInt(s.values.a)} b={fmtInt(s.values.b)} c={fmtInt(s.values.c)} d={fmtInt(s.values.d)} ·{' '}
                      {timeAgo(s.ts)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="historico" className="space-y-2 mt-3">
            {history.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-6">
                Sem histórico ainda. Edite a tabela para gerar entradas.
              </p>
            ) : (
              <>
                <div className="flex justify-end">
                  <button
                    onClick={onClearHistory}
                    className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                  >
                    <Trash className="w-3 h-3" /> Limpar
                  </button>
                </div>
                {history.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2"
                  >
                    <div className="text-[10px] text-muted-foreground tabular-nums">
                      a={fmtInt(h.values.a)} b={fmtInt(h.values.b)} c={fmtInt(h.values.c)} d={fmtInt(h.values.d)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">
                        {timeAgo(h.ts)}
                      </span>
                      <button
                        onClick={() => onRestore(h)}
                        className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
                        title="Restaurar"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}