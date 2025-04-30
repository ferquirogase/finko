import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ParticlesBackground from "@/components/particles-background"

const inter = Inter({ subsets: ["latin"] })

// Reemplazar el título y descripción
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
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} bg-gradient-to-br from-[#f5f7fa] to-[#f0f2f8]`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <ParticlesBackground />
          <div className="mx-auto max-w-3xl px-4 py-8">
            <Navbar />
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
