import Link from "next/link"
import Image from "next/image"
import { Dancing_Script } from "next/font/google"

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
})

export default function Navbar() {
  return (
    <nav className="mb-8 flex items-center">
      <Link href="/" className="flex items-center">
        <div className="relative h-8 w-32">
          <Image src="/finko.png" alt="finko logo" fill style={{ objectFit: "contain" }} priority />
        </div>
        <div className={`${dancingScript.className} ml-2 text-brand-600 text-lg italic`}>
          hecho por freelancers, para freelancers
        </div>
      </Link>
    </nav>
  )
}
