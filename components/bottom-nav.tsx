"use client"

import { Link, usePathname } from "@/i18n/navigation"
import { IconHome, IconCalculator, IconFileText, IconCreditCard, IconCurrencyDollar } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"

export default function BottomNav() {
  const pathname = usePathname()
  const t = useTranslations("nav")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrolled])

  const navItems = [
    { nameKey: "home",       href: "/",               icon: IconHome },
    { nameKey: "calculator", href: "/calculadora",    icon: IconCalculator },
    { nameKey: "budgets",    href: "/presupuestos",   icon: IconFileText },
    { nameKey: "receipts",   href: "/recibos",        icon: IconCreditCard },
    { nameKey: "payments",   href: "/pagos-exterior", icon: IconCurrencyDollar },
  ]

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 mx-auto w-full max-w-md px-4">
      <div
        className={cn(
          "mx-auto grid h-16 grid-cols-5 rounded-2xl border border-white/10 py-1 backdrop-blur-md transition-all duration-300",
          scrolled ? "bg-gray-900/90 shadow-lg shadow-black/30" : "bg-gray-900/80 shadow-md shadow-black/20",
        )}
      >
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

          return (
            <Link key={item.nameKey} href={item.href} className="group flex flex-col items-center justify-center">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-brand-500 text-white shadow-sm shadow-brand-500/30"
                    : "text-gray-500 group-hover:bg-gray-800 group-hover:text-brand-400",
                )}
              >
                <item.icon className="h-[18px] w-[18px]" stroke={isActive ? 2 : 1.5} />
              </div>
              <span
                className={cn(
                  "mt-1 text-[10px] font-medium transition-colors duration-200",
                  isActive ? "text-brand-400" : "text-gray-500 group-hover:text-brand-400",
                )}
              >
                {t(item.nameKey as any)}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
