"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BottomNav from "@/components/bottom-nav"
import ParticlesBackground from "@/components/particles-background"

// Función para enviar eventos de vista de página
function sendPageView(pathname: string, pageTitle: string) {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: "page_view",
      page_path: pathname,
      page_title: pageTitle,
      timestamp: new Date().toISOString(),
    })
  }
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  // Rastrear vistas de página cuando cambia la ruta
  useEffect(() => {
    if (pathname) {
      const pageTitle = document.title || "finko - Herramientas para freelancers"
      sendPageView(pathname, pageTitle)
    }
  }, [pathname])

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <ParticlesBackground />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Navbar />
        {children}
      </div>
      <Footer />
      <BottomNav />
    </ThemeProvider>
  )
}
