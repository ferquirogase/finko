async function getFiatRates(): Promise<Record<string, number> | null> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const data = await res.json()
    if (data?.result !== "success" || !data?.rates) return null
    return data.rates
  } catch {
    return null
  }
}

async function getArsBlue(): Promise<number | null> {
  try {
    const res = await fetch("https://api.bluelytics.com.ar/v2/latest", {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.blue?.value_avg ?? null
  } catch {
    return null
  }
}

async function getUsdtPrice(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd",
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data?.tether?.usd ?? null
  } catch {
    return null
  }
}

function fmt(value: unknown): string {
  if (typeof value !== "number" || isNaN(value)) return "—"
  if (value >= 1000) return value.toLocaleString("en-US", { maximumFractionDigits: 0 })
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default async function InfoBar() {
  const [fiat, arsBlue, usdt] = await Promise.all([getFiatRates(), getArsBlue(), getUsdtPrice()])

  const items: { label: string; value: string; flag: string }[] = []

  if (arsBlue != null) items.push({ label: "ARS (blue)", value: `$${fmt(arsBlue)}`, flag: "🇦🇷" })
  if (fiat?.COP != null) items.push({ label: "COP", value: `$${fmt(fiat.COP)}`, flag: "🇨🇴" })
  if (fiat?.MXN != null) items.push({ label: "MXN", value: `$${fmt(fiat.MXN)}`, flag: "🇲🇽" })
  if (fiat?.VES != null) items.push({ label: "VES", value: `Bs.${fmt(fiat.VES)}`, flag: "🇻🇪" })
  if (usdt != null) items.push({ label: "USDT", value: `$${fmt(usdt)}`, flag: "₮" })

  if (items.length === 0) return null

  return (
    <div className="w-full border-b border-white/5 bg-white/[0.03] backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-center gap-6 overflow-x-auto px-4 py-2 scrollbar-none">
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-brand-400">
          1 USD =
        </span>
        {items.map((item, i) => (
          <div key={item.label} className="flex shrink-0 items-center gap-4">
            {i > 0 && <span className="text-white/10">·</span>}
            <div className="flex items-center gap-1.5">
              <span className="text-sm leading-none">{item.flag}</span>
              <span className="text-[11px] font-semibold text-white">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
