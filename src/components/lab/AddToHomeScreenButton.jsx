import React, { useState, useEffect } from 'react';
import { Smartphone, Share, Plus, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

function detectIOS() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';
  return (
    /iphone|ipad|ipod/i.test(ua) ||
    (platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

export default function AddToHomeScreenButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [installed, setInstalled] = useState(isStandalone());

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleClick = async () => {
    // Android/Chrome: dispara o prompt nativo de instalação (atalho automático)
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try {
        await deferredPrompt.userChoice;
      } catch (_) {}
      setDeferredPrompt(null);
      return;
    }
    // iOS e demais: mostra instruções
    setShowInstructions(true);
  };

  const ios = detectIOS();

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors whitespace-nowrap"
      >
        <Smartphone className="w-3.5 h-3.5" /> Adicionar aos meus aplicativos
      </button>

      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-teal-700" />
              Adicionar à tela inicial
            </DialogTitle>
            <DialogDescription>
              {installed
                ? 'Este app já está instalado no seu dispositivo.'
                : 'Siga os passos abaixo para criar um atalho.'}
            </DialogDescription>
          </DialogHeader>

          {installed ? (
            <p className="text-sm text-foreground/80">
              Você já pode abri-lo diretamente do ícone na tela inicial.
            </p>
          ) : ios ? (
            <ol className="space-y-3 text-sm text-foreground/90">
              <li className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-700 text-white text-xs shrink-0">1</span>
                <span className="flex items-center gap-1.5">
                  Toque no botão <Share className="w-4 h-4 text-teal-700" /> Compartilhar na barra do Safari.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-700 text-white text-xs shrink-0">2</span>
                <span className="flex items-center gap-1.5">
                  Role e toque em <Plus className="w-3.5 h-3.5" /> <b>Adicionar à Tela de Início</b>.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-700 text-white text-xs shrink-0">3</span>
                <span>Confirme. O ícone do 2×2 LAB aparecerá na tela inicial.</span>
              </li>
            </ol>
          ) : (
            <ol className="space-y-3 text-sm text-foreground/90">
              <li className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-700 text-white text-xs shrink-0">1</span>
                <span>Abra o menu do navegador (ícone <b>⋮</b> no canto superior direito).</span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-700 text-white text-xs shrink-0">2</span>
                <span>Toque em <b>Adicionar à tela inicial</b> ou <b>Instalar aplicativo</b>.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-700 text-white text-xs shrink-0">3</span>
                <span>Confirme. O atalho será criado na tela inicial.</span>
              </li>
            </ol>
          )}

          <div className="flex justify-end mt-2">
            <Button size="sm" variant="outline" onClick={() => setShowInstructions(false)}>
              <X className="w-4 h-4" /> Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}