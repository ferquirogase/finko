import Link from "next/link"
import { IconBrandLinkedin, IconCoffee } from "@tabler/icons-react"
import { Space_Grotesk } from "next/font/google"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
})

export default function Footer() {
  return (
    <footer className="rounded-3xl border border-gray-800 bg-gray-900 py-12 pb-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <span className={`${spaceGrotesk.className} text-xl font-bold tracking-tight text-white`}>
                finko
              </span>
            </Link>
            <p className="text-sm text-gray-500">
              Herramientas para freelancers que simplifican tu negocio. Calcula tarifas, genera presupuestos y crea
              facturas profesionales.
            </p>
            <div className="flex items-center space-x-4">
              <Link
                href="https://www.linkedin.com/in/ferquirogase/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-brand-400"
              >
                <IconBrandLinkedin className="h-5 w-5" stroke={1.5} />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <p className="mb-2 text-center text-sm text-gray-400">
              ¿Te resultaron útiles nuestras herramientas? ¡Invítanos a un cafecito!
            </p>
            <a
              href="https://cafecito.app/ferquirogaux"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gray-700 px-6 py-2 text-sm font-medium text-gray-100 transition-colors hover:bg-gray-600"
            >
              <IconCoffee className="h-4 w-4" stroke={1.5} />
              Invitar un cafecito
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} Finko. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
