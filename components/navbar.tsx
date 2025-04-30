"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DollarSign } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="mb-8 flex items-center justify-between rounded-full bg-white px-6 py-3 shadow-sm">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/finko-logo.svg" alt="finko logo" width={130} height={40} priority />
      </Link>

      <Link href="/pagos-exterior">
        <Button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 rounded-full">
          <DollarSign className="h-4 w-4" />
          Cómo cobrar del exterior
        </Button>
      </Link>
    </nav>
  )
}
