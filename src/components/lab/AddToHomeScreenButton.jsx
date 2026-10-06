import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LAB_BTN } from './labButtons';
import { janelaApp, appInstalado, marcarInstalado } from '@/lib/janela';

const CHAVE = '2-2-lab.instalado';

// Botão "Instalar" no padrão da série LAB (Nomo LAB, STAT LAB)
let deferredPrompt = null;
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; });
}

function platform() {
  const u = navigator.userAgent || '';
  if (/iPhone|iPad|iPod/.test(u) || (/Macintosh/.test(u) && navigator.maxTouchPoints > 1)) return 'ios';
  if (/Android/.test(u)) return 'android';
  return 'desktop';
}

const STEPS = {
  ios: [<>Abra esta página no <b>Safari</b>.</>, <>Toque em <b>Compartilhar</b> <kbd className="font-mono text-xs bg-muted border border-border rounded px-1">⬆︎</kbd>.</>, <>Toque em <b>Adicionar à Tela de Início</b>.</>, <>Confirme o nome e toque em <b>Adicionar</b>.</>],
  android: [<>Abra esta página no <b>Chrome</b>.</>, <>Toque no menu <kbd className="font-mono text-xs bg-muted border border-border rounded px-1">⋮</kbd>.</>, <>Toque em <b>Adicionar à tela inicial</b> ou <b>Instalar app</b>.</>, <>Confirme. O ícone aparece junto dos seus apps.</>],
  desktop: [<><b>Chrome ou Edge:</b> use o ícone de instalar na barra de endereço, ou o menu <kbd className="font-mono text-xs bg-muted border border-border rounded px-1">⋮</kbd> → <b>Transmitir, salvar e compartilhar</b> → <b>Instalar página como app</b>.</>, <><b>Safari (Mac):</b> menu <b>Arquivo</b> → <b>Adicionar ao Dock</b>.</>, <><b>Qualquer navegador:</b> salve nos favoritos com <kbd className="font-mono text-xs bg-muted border border-border rounded px-1">Ctrl</kbd>+<kbd className="font-mono text-xs bg-muted border border-border rounded px-1">D</kbd>.</>],
};
const TABS = [['ios', 'iPhone e iPad'], ['android', 'Android'], ['desktop', 'Computador']];

export default function AddToHomeScreenButton() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('android');
  const [janela, setJanela] = useState('navegador');

  useEffect(() => {
    const j = janelaApp(CHAVE);
    setJanela(j);
    if (j === 'outra') appInstalado(CHAVE).then((ok) => { if (ok) setJanela('propria'); });
    const onInstalled = () => { marcarInstalado(CHAVE); setJanela('propria'); };
    window.addEventListener('appinstalled', onInstalled);
    return () => window.removeEventListener('appinstalled', onInstalled);
  }, []);

  // some só na janela do próprio app instalado; dentro de outro app (BACCHI LAB), continua visível
  if (janela === 'propria') return null;

  const handleClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const r = await deferredPrompt.userChoice;
        deferredPrompt = null;
        if (r?.outcome === 'accepted') return;
      } catch { /* mostra as instruções */ }
    }
    setTab(platform());
    setOpen(true);
  };

  return (
    <>
      <button onClick={handleClick} className={LAB_BTN} aria-label="Instalar o app no celular ou computador">
        <Download /> Instalar
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Instalar o 2×2 LAB</DialogTitle>
          </DialogHeader>
          {janela === 'outra' && (
            <p className="rounded-[10px] bg-muted px-3 py-2.5 text-sm">
              Você abriu este app por dentro de outro, como o BACCHI LAB, e daqui não dá para instalar. Toque em <kbd className="font-mono text-xs bg-card border border-border rounded px-1">⋮</kbd> no alto da tela e em <b>Abrir no Chrome</b>; lá, toque de novo em <b>Instalar</b>.
            </p>
          )}
          <p className="text-[15px] leading-relaxed">O 2×2 LAB pode ficar na tela inicial como um aplicativo, abrir em tela cheia e funcionar sem internet depois da primeira visita.</p>
          <div className="inline-flex flex-wrap gap-0.5 p-[3px] rounded-full border border-border bg-card w-fit">
            {TABS.map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)}
                className={`px-3 py-1.5 rounded-full text-[13px] ${tab === k ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>{l}</button>
            ))}
          </div>
          <ol className="list-decimal pl-5 grid gap-1.5 text-[15px]">
            {STEPS[tab].map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </DialogContent>
      </Dialog>
    </>
  );
}
