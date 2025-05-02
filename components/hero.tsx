import Image from "next/image"

export default function Hero() {
  return (
    <div className="overflow-hidden rounded-3xl">
      <div className="grid gap-6 md:grid-cols-2 md:gap-12">
        <div className="flex flex-col justify-center space-y-4 p-6 md:p-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter text-gray-900 sm:text-4xl">
              Herramientas para freelancers
            </h1>
            <p className="text-gray-600 md:text-lg">
              Calcula cuánto cobrar, genera presupuestos profesionales y crea facturas en minutos. Todo en un solo
              lugar.
            </p>
          </div>
        </div>
        <div className="relative h-[300px] md:h-auto">
          <Image
            src="/freelancer.png"
            alt="Freelancer con herramientas digitales"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
      </div>
    </div>
  )
}
