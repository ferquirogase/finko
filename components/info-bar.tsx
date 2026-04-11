import type React from "react"
import { IconTrendingUp, IconCurrencyBitcoin, IconCurrencyDollar, IconCurrencyEuro } from "@tabler/icons-react"

async function getFiatRates(): Promise<Record<string, number> | null> {
  try {
    const res = await fetch("https://api.frankfurter.app/latest?from=USD&to=EUR,BRL,MXN,COP", {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const data = await res.json()
    if (!data?.rates) return null
    return data.rates
  } catch {
    return null
  }
}

async function getCryptoRates(): Promise<Record<string, Record<string, number>> | null> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether&vs_currencies=usd&include_24hr_change=true",
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    if (!data?.bitcoin) return null
    return data
  } catch {
    return null
  }
}

function formatCompact(value: unknown): string {
  if (typeof value !== "number" || isNaN(value)) return "—"
  if (value >= 1000) return value.toLocaleString("en-US", { maximumFractionDigits: 0 })
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default async function InfoBar() {
  const [fiat, crypto] = await Promise.all([getFiatRates(), getCryptoRates()])

  const items: { icon: React.ReactNode; label: string; value: string; change?: number }[] = []

  if (fiat?.EUR != null) items.push({
    icon: <IconCurrencyDollar className="h-3 w-3" stroke={2} />,
    label: "EUR", value: `€${formatCompact(fiat.EUR)}`,
  })
  if (fiat?.BRL != null) items.push({
    icon: <IconCurrencyEuro className="h-3 w-3" stroke={2} />,
    label: "BRL", value: `R$${formatCompact(fiat.BRL)}`,
  })
  if (fiat?.MXN != null) items.push({
    icon: <IconCurrencyDollar className="h-3 w-3" stroke={2} />,
    label: "MXN", value: `$${formatCompact(fiat.MXN)}`,
  })
  if (fiat?.COP != null) items.push({
    icon: <IconCurrencyDollar className="h-3 w-3" stroke={2} />,
    label: "COP", value: `$${formatCompact(fiat.COP)}`,
  })
  if (crypto?.bitcoin?.usd != null) items.push({
    icon: <IconCurrencyBitcoin className="h-3 w-3" stroke={2} />,
    label: "BTC",
    value: `$${formatCompact(crypto.bitcoin.usd)}`,
    change: typeof crypto.bitcoin.usd_24h_change === "number" ? crypto.bitcoin.usd_24h_change : undefined,
  })
  if (crypto?.tether?.usd != null) items.push({
    icon: <IconTrendingUp className="h-3 w-3" stroke={2} />,
    label: "USDT", value: `$${formatCompact(crypto.tether.usd)}`,
  })

  if (items.length === 0) return null

  return (
    <div className="w-full border-b border-white/5 bg-white/[0.03] backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center overflow-x-auto px-4 py-2 scrollbar-none">
        <span className="mr-4 shrink-0 text-[10px] font-semibold uppercase tracking-widest text-brand-400">
          1 USD =
        </span>
        <div className="flex items-center gap-5">
          {items.map((item) => (
            <div key={item.label} className="flex shrink-0 items-center gap-1.5">
              <span className="text-gray-500">{item.icon}</span>
              <span className="text-[11px] font-medium text-gray-400">{item.label}</span>
              <span className="text-[11px] font-semibold text-white">{item.value}</span>
              {item.change !== undefined && (
                <span className={`text-[10px] font-medium ${item.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {item.change >= 0 ? "+" : ""}{item.change.toFixed(1)}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
