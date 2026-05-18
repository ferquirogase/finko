import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4 text-center">
      <p className="text-6xl font-bold text-[#7c3aed] select-none">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-gray-100">Página no encontrada</h1>
      <p className="mt-2 text-sm text-gray-500">
        El enlace que seguiste no existe o fue movido.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-[#7c3aed] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#6d28d9] transition-colors"
      >
        Volver a las herramientas
      </Link>
    </div>
  )
}
