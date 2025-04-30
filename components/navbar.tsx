"use client"

import Link from "next/link"
import Image from "next/image"

export default function Navbar() {
  return (
    <nav className="mb-8 flex items-center justify-between rounded-full bg-white px-6 py-3 shadow-sm">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/finko.png" alt="finko logo" width={120} height={32} priority className="h-8 w-auto" />
      </Link>
    </nav>
  )
}
