"use client"

import type React from "react"
import { Inclusive_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BottomNav from "@/components/bottom-nav"
import ParticlesBackground from "@/components/particles-background"
import Script from "next/script"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

const inclusiveSans = Inclusive_Sans({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

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
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-5FVQXSR8');`}
        </Script>
        {/* End Google Tag Manager */}

        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-WJQ2C9VR70" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WJQ2C9VR70');
          `}
        </Script>
      </head>
      <body className={`${inclusiveSans.className} bg-gradient-to-br from-[#f5f7fa] to-[#f0f2f8]`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5FVQXSR8"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ThemeProvider attribute="class" defaultTheme="light">
          <ParticlesBackground />
          <div className="mx-auto max-w-3xl px-4 py-8">
            <Navbar />
            {children}
          </div>
          <Footer />
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  )
}
