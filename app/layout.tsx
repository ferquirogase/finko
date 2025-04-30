import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ParticlesBackground from "@/components/particles-background"
import Script from "next/script"

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
      <head>
        {/* Favicon */}
        <link rel="icon" href="/finko.png" />

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
