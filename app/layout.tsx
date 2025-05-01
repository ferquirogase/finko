import type React from "react"
import { Inclusive_Sans } from "next/font/google"
import "./globals.css"

const inclusiveSans = Inclusive_Sans({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

export const metadata = {
  title: "finko - Herramientas para freelancers",
  description: "Calcula tarifas, genera presupuestos y crea facturas profesionales fácilmente",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>{/* Eliminamos todos los scripts */}</head>
      <body className={inclusiveSans.className}>{children}</body>
    </html>
  )
}
