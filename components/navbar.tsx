import Link from "next/link"
import Image from "next/image"

export default function Navbar() {
  return (
    <nav className="mb-8 flex items-center justify-between rounded-full bg-white px-6 py-3 shadow-sm">
      <Link href="/" className="flex items-center gap-2">
        <div className="relative h-8 w-32">
          <Image src="/finko.png" alt="finko logo" fill style={{ objectFit: "contain" }} priority />
        </div>
      </Link>
    </nav>
  )
}
