import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import Laboratorio from './pages/Laboratorio';

// Versão independente (GitHub Pages): sem login, tudo roda no navegador.
export default function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Laboratorio />
      <Toaster />
    </QueryClientProvider>
  )
}
