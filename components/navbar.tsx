import { Link } from "@/i18n/navigation"
import { Space_Grotesk } from "next/font/google"
import { useTranslations } from "next-intl"
import LanguageSwitcher from "./language-switcher"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
})

export default function Navbar() {
  const t = useTranslations("nav")

  return (
    <nav className="mb-8 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <span className={`${spaceGrotesk.className} text-2xl font-bold tracking-tight text-white`}>
          finko
        </span>
        <span className="hidden text-xs text-gray-600 sm:block">
          {t("tagline")}
        </span>
      </Link>
      <LanguageSwitcher />
    </nav>
  )
}
