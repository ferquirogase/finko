import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Testimonials() {
  return (
    <section className="bg-white py-20" id="testimonials">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-brand-100 px-3 py-1 text-sm text-brand-800">Testimonios</div>
            <h2 className="text-3xl font-bold tracking-tighter text-gray-900 sm:text-4xl md:text-5xl">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Freelancers como tú que han mejorado su negocio con nuestras herramientas.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/focused-freelancer.png" alt="Avatar" />
                  <AvatarFallback>LM</AvatarFallback>
                </Avatar>
                <div className="space-y-2 text-center">
                  <h3 className="font-bold text-gray-900">Laura Martínez</h3>
                  <p className="text-sm text-brand-600">Diseñadora Web</p>
                  <p className="text-sm text-gray-600">
                    "Antes me costaba mucho calcular cuánto cobrar por mis proyectos. Gracias a esta plataforma, ahora
                    tengo la confianza para establecer tarifas justas y crear presupuestos profesionales."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/focused-freelancer.png" alt="Avatar" />
                  <AvatarFallback>CR</AvatarFallback>
                </Avatar>
                <div className="space-y-2 text-center">
                  <h3 className="font-bold text-gray-900">Carlos Rodríguez</h3>
                  <p className="text-sm text-brand-600">Desarrollador Móvil</p>
                  <p className="text-sm text-gray-600">
                    "Las plantillas de facturas me han ahorrado horas de trabajo. Mis clientes reciben documentos
                    profesionales y yo puedo concentrarme en lo que realmente importa: programar."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/focused-marketing-freelancer.png" alt="Avatar" />
                  <AvatarFallback>AG</AvatarFallback>
                </Avatar>
                <div className="space-y-2 text-center">
                  <h3 className="font-bold text-gray-900">Ana García</h3>
                  <p className="text-sm text-brand-600">Marketing Digital</p>
                  <p className="text-sm text-gray-600">
                    "Desde que uso esta plataforma, mis propuestas tienen un aspecto mucho más profesional. He notado un
                    aumento del 30% en la tasa de conversión de mis presupuestos."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 md:col-span-2 lg:col-span-3">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex flex-wrap justify-center gap-2">
                  <div className="rounded-full bg-brand-100 px-3 py-1 text-sm text-brand-800">Fácil de usar</div>
                  <div className="rounded-full bg-brand-100 px-3 py-1 text-sm text-brand-800">Ahorra tiempo</div>
                  <div className="rounded-full bg-brand-100 px-3 py-1 text-sm text-brand-800">Profesional</div>
                  <div className="rounded-full bg-brand-100 px-3 py-1 text-sm text-brand-800">Aumenta ingresos</div>
                  <div className="rounded-full bg-brand-100 px-3 py-1 text-sm text-brand-800">Confianza</div>
                </div>
                <p className="max-w-3xl text-center text-lg font-medium text-gray-600">
                  "Más de 10,000 freelancers ya confían en nuestras herramientas para gestionar su negocio de manera
                  profesional y eficiente."
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
