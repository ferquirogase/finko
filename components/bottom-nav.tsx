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
    <div className="fixed bottom-4 left-0 right-0 z-50 mx-auto w-full max-w-3xl px-4">
      <div
        className={cn(
          "mx-auto grid h-18 grid-cols-5 rounded-full transition-all duration-300 py-1",
          scrolled ? "bg-white/90 backdrop-blur-md shadow-lg" : "bg-white/70 backdrop-blur-sm shadow-sm",
        )}
      >
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

          return (
            <Link key={item.name} href={item.href} className="flex flex-col items-center justify-center group">
              <div
                className={cn(
                  "flex items-center justify-center mb-1 w-10 h-10 rounded-full transition-all duration-300 ease-in-out transform",
                  isActive
                    ? "bg-purple-600 scale-100"
                    : "bg-transparent hover:bg-purple-100 scale-90 group-hover:scale-95",
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-all duration-300 ease-in-out",
                    isActive ? "text-white" : "text-gray-500 group-hover:text-purple-500",
                  )}
                  stroke={1.5}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium leading-tight transition-colors duration-300 ease-in-out",
                  isActive ? "text-purple-600" : "text-gray-500 group-hover:text-purple-400",
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
