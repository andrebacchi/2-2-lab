import { useState } from "react";
import { QrCode, Copy, Check, Share2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LAB_BTN } from './labButtons';

// QR code do app (padrão do BACCHI LAB): abre o código do endereço do próprio app, grande e sobre branco,
// para compartilhar entre celulares ou projetar. O desenho é fixo, porque o endereço não muda: foi gerado
// com o qrcode.js do repositório bacchilab (nível M). Se o endereço mudar, gere de novo.
const ENDERECO = "https://andrebacchi.github.io/2-2-lab/";
const LADO = 33;
const DESENHO = "M2 2h7v1h-7zM10 2h4v1h-4zM18 2h1v1h-1zM21 2h2v1h-2zM24 2h7v1h-7zM2 3h1v1h-1zM8 3h1v1h-1zM10 3h1v1h-1zM12 3h5v1h-5zM18 3h3v1h-3zM24 3h1v1h-1zM30 3h1v1h-1zM2 4h1v1h-1zM4 4h3v1h-3zM8 4h1v1h-1zM13 4h1v1h-1zM15 4h1v1h-1zM18 4h1v1h-1zM21 4h1v1h-1zM24 4h1v1h-1zM26 4h3v1h-3zM30 4h1v1h-1zM2 5h1v1h-1zM4 5h3v1h-3zM8 5h1v1h-1zM10 5h2v1h-2zM15 5h1v1h-1zM17 5h1v1h-1zM19 5h1v1h-1zM21 5h1v1h-1zM24 5h1v1h-1zM26 5h3v1h-3zM30 5h1v1h-1zM2 6h1v1h-1zM4 6h3v1h-3zM8 6h1v1h-1zM11 6h2v1h-2zM14 6h5v1h-5zM21 6h1v1h-1zM24 6h1v1h-1zM26 6h3v1h-3zM30 6h1v1h-1zM2 7h1v1h-1zM8 7h1v1h-1zM11 7h2v1h-2zM14 7h1v1h-1zM16 7h1v1h-1zM18 7h1v1h-1zM21 7h2v1h-2zM24 7h1v1h-1zM30 7h1v1h-1zM2 8h7v1h-7zM10 8h1v1h-1zM12 8h1v1h-1zM14 8h1v1h-1zM16 8h1v1h-1zM18 8h1v1h-1zM20 8h1v1h-1zM22 8h1v1h-1zM24 8h7v1h-7zM10 9h1v1h-1zM14 9h1v1h-1zM18 9h2v1h-2zM21 9h1v1h-1zM2 10h1v1h-1zM4 10h2v1h-2zM7 10h3v1h-3zM11 10h1v1h-1zM15 10h1v1h-1zM17 10h5v1h-5zM24 10h1v1h-1zM27 10h1v1h-1zM29 10h2v1h-2zM3 11h3v1h-3zM7 11h1v1h-1zM10 11h2v1h-2zM13 11h1v1h-1zM15 11h1v1h-1zM18 11h1v1h-1zM21 11h6v1h-6zM30 11h1v1h-1zM2 12h4v1h-4zM7 12h6v1h-6zM14 12h2v1h-2zM18 12h3v1h-3zM22 12h2v1h-2zM25 12h2v1h-2zM28 12h2v1h-2zM2 13h2v1h-2zM7 13h1v1h-1zM12 13h1v1h-1zM20 13h1v1h-1zM22 13h3v1h-3zM30 13h1v1h-1zM3 14h1v1h-1zM5 14h2v1h-2zM8 14h1v1h-1zM10 14h1v1h-1zM16 14h1v1h-1zM19 14h1v1h-1zM21 14h1v1h-1zM25 14h1v1h-1zM27 14h2v1h-2zM2 15h1v1h-1zM6 15h1v1h-1zM10 15h1v1h-1zM13 15h1v1h-1zM16 15h2v1h-2zM19 15h1v1h-1zM21 15h2v1h-2zM24 15h1v1h-1zM28 15h3v1h-3zM2 16h3v1h-3zM6 16h5v1h-5zM12 16h1v1h-1zM15 16h1v1h-1zM18 16h2v1h-2zM21 16h2v1h-2zM24 16h1v1h-1zM28 16h3v1h-3zM2 17h3v1h-3zM6 17h2v1h-2zM10 17h2v1h-2zM13 17h1v1h-1zM16 17h1v1h-1zM20 17h1v1h-1zM23 17h4v1h-4zM29 17h1v1h-1zM2 18h1v1h-1zM4 18h1v1h-1zM6 18h1v1h-1zM8 18h2v1h-2zM12 18h1v1h-1zM14 18h1v1h-1zM16 18h1v1h-1zM18 18h1v1h-1zM21 18h3v1h-3zM25 18h3v1h-3zM29 18h1v1h-1zM4 19h2v1h-2zM9 19h2v1h-2zM14 19h1v1h-1zM16 19h4v1h-4zM22 19h1v1h-1zM25 19h1v1h-1zM27 19h3v1h-3zM2 20h1v1h-1zM5 20h1v1h-1zM8 20h3v1h-3zM13 20h1v1h-1zM15 20h5v1h-5zM23 20h1v1h-1zM28 20h1v1h-1zM6 21h2v1h-2zM10 21h2v1h-2zM14 21h3v1h-3zM18 21h2v1h-2zM22 21h2v1h-2zM26 21h1v1h-1zM28 21h1v1h-1zM3 22h2v1h-2zM6 22h1v1h-1zM8 22h1v1h-1zM11 22h2v1h-2zM15 22h6v1h-6zM22 22h7v1h-7zM10 23h2v1h-2zM13 23h1v1h-1zM19 23h2v1h-2zM22 23h1v1h-1zM26 23h5v1h-5zM2 24h7v1h-7zM10 24h1v1h-1zM14 24h1v1h-1zM16 24h1v1h-1zM19 24h1v1h-1zM21 24h2v1h-2zM24 24h1v1h-1zM26 24h2v1h-2zM29 24h1v1h-1zM2 25h1v1h-1zM8 25h1v1h-1zM10 25h3v1h-3zM14 25h5v1h-5zM20 25h1v1h-1zM22 25h1v1h-1zM26 25h2v1h-2zM2 26h1v1h-1zM4 26h3v1h-3zM8 26h1v1h-1zM11 26h2v1h-2zM17 26h3v1h-3zM22 26h5v1h-5zM28 26h1v1h-1zM2 27h1v1h-1zM4 27h3v1h-3zM8 27h1v1h-1zM10 27h1v1h-1zM12 27h1v1h-1zM17 27h1v1h-1zM21 27h1v1h-1zM23 27h1v1h-1zM25 27h3v1h-3zM30 27h1v1h-1zM2 28h1v1h-1zM4 28h3v1h-3zM8 28h1v1h-1zM10 28h1v1h-1zM14 28h2v1h-2zM19 28h3v1h-3zM25 28h1v1h-1zM28 28h1v1h-1zM30 28h1v1h-1zM2 29h1v1h-1zM8 29h1v1h-1zM11 29h2v1h-2zM16 29h1v1h-1zM18 29h1v1h-1zM22 29h2v1h-2zM25 29h3v1h-3zM29 29h1v1h-1zM2 30h7v1h-7zM10 30h2v1h-2zM15 30h3v1h-3zM21 30h5v1h-5zM29 30h1v1h-1z";

export default function QrButton({ className }) {
  const [open, setOpen] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const podeCompartilhar = typeof navigator !== "undefined" && !!navigator.share;

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(ENDERECO);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2200);
    } catch { /* sem acesso à área de transferência: o endereço fica selecionável logo acima */ }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Mostrar o QR code deste app" className={className ? `${LAB_BTN} ${className}` : LAB_BTN}>
        <QrCode /> QR code
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[calc(100dvh-1.5rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">QR code do 2×2 LAB</DialogTitle>
          </DialogHeader>
          <p className="text-center text-sm text-muted-foreground">Aponte a câmera do celular para o código.</p>
          <div className="mx-auto w-full max-w-[min(100%,56vh)] rounded-xl border border-border bg-white p-2.5">
            <svg viewBox={`0 0 ${LADO} ${LADO}`} shapeRendering="crispEdges" role="img" aria-label="QR code para andrebacchi.github.io/2-2-lab" className="block w-full h-auto">
              <rect width={LADO} height={LADO} fill="#fff" />
              <path d={DESENHO} fill="#161a22" />
            </svg>
          </div>
          <p className="text-center font-mono font-semibold text-[clamp(15px,4vw,20px)] break-all select-all text-foreground">andrebacchi.github.io/2-2-lab</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button onClick={copiar} className="inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm  transition-colors bg-teal-700 text-white hover:bg-teal-800">
              {copiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copiado ? "Link copiado" : "Copiar link"}
            </button>
            {podeCompartilhar && (
              <button onClick={() => navigator.share({ title: "2×2 LAB", url: ENDERECO }).catch(() => {})} className="inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm  transition-colors border border-border bg-card text-foreground hover:border-muted-foreground">
                <Share2 className="w-4 h-4" /> Compartilhar
              </button>
            )}
          </div>
          <p className="text-center text-xs text-muted-foreground opacity-80">QR Code é marca registrada da DENSO WAVE INCORPORATED.</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
