import type React from "react"
import { Inclusive_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BottomNav from "@/components/bottom-nav"
import ParticlesBackground from "@/components/particles-background"
import Script from "next/script"

const inclusiveSans = Inclusive_Sans({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

export const metadata = {
  title: "finko - Herramientas para freelancers",
  description: "Calcula tarifas, genera presupuestos y crea facturas profesionales fácilmente",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://finko.app",
    title: "finko - Herramientas para freelancers",
    description: "Calcula tarifas, genera presupuestos y crea facturas profesionales fácilmente",
    siteName: "finko",
    images: [
      {
        url: "https://finko.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "finko - Herramientas para freelancers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "finko - Herramientas para freelancers",
    description: "Calcula tarifas, genera presupuestos y crea facturas profesionales fácilmente",
    images: ["https://finko.app/og-image.png"],
    creator: "@finkoapp",
  },
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
