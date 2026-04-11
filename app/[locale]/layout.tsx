import type React from "react"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { notFound } from "next/navigation"
import InfoBar from "@/components/info-bar"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata" })
  const baseUrl = "https://finkoapp.online"
  const path = locale === "en" ? "/en" : ""

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: t("title"),
      template: `%s | finko`,
    },
    description: t("description"),
    icons: {
      icon: [{ url: "/finko-fav.png" }, { url: "/icon.png" }],
      apple: [{ url: "/pwa/apple-icon-180.png" }],
    },
    manifest: "/manifest.json",
    alternates: {
      canonical: `${baseUrl}${path}`,
      languages: {
        "es": `${baseUrl}`,
        "en": `${baseUrl}/en`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}${path}`,
      siteName: "finko",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
      locale: locale === "en" ? "en_US" : "es_AR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${baseUrl}/og-image.png`],
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as "es" | "en")) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <InfoBar />
      {children}
    </NextIntlClientProvider>
  )
}
