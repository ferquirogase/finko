import Link from "next/link"
import { Space_Grotesk } from "next/font/google"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
})

export default function Navbar() {
  return (
    <nav className="mb-8 flex items-center">
      <Link href="/" className="flex items-center gap-3">
        <span className={`${spaceGrotesk.className} text-2xl font-bold tracking-tight text-white`}>
          finko
        </span>
        <span className="hidden text-xs text-gray-600 sm:block">
          hecho por freelancers, para freelancers
        </span>
      </Link>
    </nav>
  )
}
