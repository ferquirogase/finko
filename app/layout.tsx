import type React from "react"
import ClientLayout from "./clientLayout"

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
  return <ClientLayout>{children}</ClientLayout>
}


import './globals.css'