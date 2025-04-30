"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calculator, FileText, CreditCard, DollarSign, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Inicio",
      href: "/",
      icon: Home,
    },
    {
      name: "Calculadora",
      href: "/calculadora",
      icon: Calculator,
    },
    {
      name: "Presupuestos",
      href: "/presupuestos",
      icon: FileText,
    },
    {
      name: "Recibos",
      href: "/recibos",
      icon: CreditCard,
    },
    {
      name: "Pagos",
      href: "/pagos-exterior",
      icon: DollarSign,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-white">
      <div className="mx-auto grid h-16 max-w-lg grid-cols-5">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                isActive ? "text-purple-600" : "text-gray-500 hover:text-gray-900",
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-purple-600" : "text-gray-500")} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
