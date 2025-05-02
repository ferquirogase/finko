import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <section className="bg-gradient-to-br from-brand-500 to-brand-700 py-20 text-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Comienza a gestionar tu negocio freelance como un profesional
            </h2>
            <p className="mx-auto max-w-[700px] text-white/80 md:text-xl/relaxed">
              Utiliza nuestras herramientas gratuitas para mejorar tu forma de trabajar, aumentar tus ingresos y reducir
              el estrés.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button size="lg" className="bg-white text-brand-700 hover:bg-white/90">
              Comenzar Ahora
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
              Ver Ejemplos
            </Button>
          </div>
          <p className="text-sm text-white/60">Todas las herramientas son gratuitas. No se requiere registro.</p>
        </div>
      </div>
    </section>
  )
}
