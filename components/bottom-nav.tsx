"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconHome, IconCalculator, IconFileText, IconCreditCard, IconCurrencyDollar } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

export default function BottomNav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  // Detectar scroll para cambiar la apariencia
  useEffect(() => {
    // Verificar que estamos en el cliente
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
    {
      name: "Inicio",
      href: "/",
      icon: IconHome,
    },
    {
      name: "Calculadora",
      href: "/calculadora",
      icon: IconCalculator,
    },
    {
      name: "Presupuestos",
      href: "/presupuestos",
      icon: IconFileText,
    },
    {
      name: "Recibos",
      href: "/recibos",
      icon: IconCreditCard,
    },
    {
      name: "Pagos",
      href: "/pagos-exterior",
      icon: IconCurrencyDollar,
    },
  ]

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 mx-auto w-full max-w-md px-4">
      <div
        className={cn(
          "mx-auto grid h-16 grid-cols-5 rounded-2xl border border-white/20 py-1 backdrop-blur-md transition-all duration-300",
          scrolled ? "bg-white/85 shadow-lg" : "bg-white/75 shadow-md",
        )}
      >
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

          return (
            <Link key={item.name} href={item.href} className="group flex flex-col items-center justify-center">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-gray-500 group-hover:bg-brand-50 group-hover:text-brand-500",
                )}
              >
                <item.icon className="h-[18px] w-[18px]" stroke={isActive ? 2 : 1.5} />
              </div>
              <span
                className={cn(
                  "mt-1 text-[10px] font-medium transition-colors duration-200",
                  isActive ? "text-brand-600" : "text-gray-500 group-hover:text-brand-400",
                )}
              >
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
