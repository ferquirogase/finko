import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import ProposalGenerator from "@/components/proposal-generator"

export default function PresupuestosPage() {
  return (
    <div className="space-y-6 pb-20">
      <div className="mb-6 flex items-center">
        <Link href="/">
          <Button variant="ghost" className="gap-2 text-green-600 hover:bg-green-50 hover:text-green-700">
            <IconArrowLeft className="h-4 w-4" stroke={1.5} />
            Volver a herramientas
          </Button>
        </Link>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-green-500 to-green-700 p-8 text-white">
        <h1 className="mb-4 text-3xl font-bold">Generador de Presupuestos</h1>
        <p className="mb-6 text-lg text-white/90">Crea presupuestos profesionales para tus clientes</p>
      </div>

      <ProposalGenerator />
    </div>
  )
}
