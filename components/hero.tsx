import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-purple-50 py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter text-purple-900 sm:text-5xl xl:text-6xl">
                Herramientas para freelancers que simplifican tu negocio
              </h1>
              <p className="max-w-[600px] text-gray-600 md:text-xl">
                Calcula cuánto cobrar, genera presupuestos profesionales y crea facturas en minutos. Todo en un solo
                lugar.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button className="bg-purple-600 hover:bg-purple-700">Comenzar Ahora</Button>
              <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                Ver Ejemplos
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 p-6 shadow-2xl lg:h-[400px] xl:h-[450px]">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10 flex h-full flex-col items-center justify-center space-y-4 text-white">
                <div className="rounded-lg bg-white/20 p-4 backdrop-blur-sm">
                  <h3 className="text-xl font-bold">Calcula tus tarifas</h3>
                  <p className="text-sm">Basado en tu experiencia y el mercado</p>
                </div>
                <div className="rounded-lg bg-white/20 p-4 backdrop-blur-sm">
                  <h3 className="text-xl font-bold">Genera presupuestos</h3>
                  <p className="text-sm">Plantillas profesionales personalizables</p>
                </div>
                <div className="rounded-lg bg-white/20 p-4 backdrop-blur-sm">
                  <h3 className="text-xl font-bold">Crea facturas</h3>
                  <p className="text-sm">Documentos legales en segundos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
