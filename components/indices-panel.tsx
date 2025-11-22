import { Card } from "@/components/ui/card"
import { Flame, Bug, CloudDrizzle, Droplets, ShieldAlert, Sun } from "lucide-react"

interface IndicesPanelProps {
  data: any
}

function classifyUV(uv: number) {
  if (uv >= 11) return { label: "Extremo", color: "bg-red-500" }
  if (uv >= 8) return { label: "Muito alto", color: "bg-orange-500" }
  if (uv >= 6) return { label: "Alto", color: "bg-amber-500" }
  if (uv >= 3) return { label: "Moderado", color: "bg-yellow-500" }
  return { label: "Baixo", color: "bg-green-500" }
}

function avg(values: number[]) {
  if (!values?.length) return 0
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
}

export function IndicesPanel({ data }: IndicesPanelProps) {
  const daily = data?.daily
  const hourly = data?.hourly
  const current = data?.current

  const times: Date[] = (hourly?.time || []).map((t: string) => new Date(t))
  const now = new Date()
  const currentIdx = (() => {
    if (!times.length) return 0
    let min = Number.MAX_SAFE_INTEGER
    let idx = 0
    for (let i = 0; i < times.length; i++) {
      const d = Math.abs(times[i].getTime() - now.getTime())
      if (d < min) {
        min = d
        idx = i
      }
    }
    return idx
  })()

  const next6Precip = (hourly?.precipitation_probability || []).slice(currentIdx, currentIdx + 6)
  const precipSoon = next6Precip.length ? Math.round(avg(next6Precip)) : (daily?.precipitation_probability_max?.[0] ?? 0)
  const tempNow = Math.round(current?.temp ?? 0)
  const humNow = Math.round(current?.humidity ?? 0)
  const windNow = Math.round(current?.wind_speed ?? 0)
  const uvNow = (() => {
    const hv = hourly?.uv_index?.[currentIdx]
    if (typeof hv === "number") return hv
    return daily?.uv_index_max?.[0] ?? 0
  })()

  const churrasco = (() => {
    if (precipSoon < 10 && windNow < 15 && tempNow >= 24 && tempNow <= 30) return { label: "Perfeito agora", color: "bg-green-500" }
    if (precipSoon < 20 && windNow < 20 && tempNow >= 22 && tempNow <= 32) return { label: "Bom", color: "bg-green-400" }
    if (precipSoon < 40 && windNow < 25 && tempNow >= 18 && tempNow <= 34) return { label: "Regular", color: "bg-yellow-500" }
    return { label: "Ruim", color: "bg-orange-500" }
  })()

  const mosquitos = (() => {
    if (tempNow >= 24 && humNow >= 65) return { label: "Alto", color: "bg-orange-500" }
    if (tempNow >= 20 && humNow >= 55) return { label: "Médio", color: "bg-yellow-500" }
    return { label: "Baixo", color: "bg-green-500" }
  })()

  const frizz = (() => {
    if (humNow >= 70) return { label: "Alto", color: "bg-orange-500" }
    if (humNow >= 50) return { label: "Moderado", color: "bg-yellow-500" }
    return { label: "Baixo", color: "bg-green-500" }
  })()

  const skin = (() => {
    if (humNow <= 30) return { label: "Alto", color: "bg-orange-500" }
    if (humNow <= 45) return { label: "Médio", color: "bg-yellow-500" }
    return { label: "Nenhum alerta", color: "bg-green-500" }
  })()

  const flu = (() => {
    const tmin = daily?.temperature_2m_min?.[0] ?? tempNow
    const tmax = daily?.temperature_2m_max?.[0] ?? tempNow
    const swing = Math.abs((tmax ?? tempNow) - (tmin ?? tempNow))
    if (tempNow <= 17 || (swing >= 10 && windNow >= 20)) return { label: "Alto", color: "bg-orange-500" }
    if (tempNow <= 20 || swing >= 7) return { label: "Médio", color: "bg-yellow-500" }
    return { label: "Baixo", color: "bg-green-500" }
  })()

  const uv = classifyUV(uvNow)

  const items = [
    { key: "churrasco", title: "Churrasco", meta: churrasco, icon: Flame },
    { key: "mosquitos", title: "Mosquitos", meta: mosquitos, icon: Bug },
    { key: "frizz", title: "Frizz", meta: frizz, icon: CloudDrizzle },
    { key: "skin", title: "Ressecamento da Pele", meta: skin, icon: Droplets },
    { key: "flu", title: "Gripe e Resfriado", meta: flu, icon: ShieldAlert },
    { key: "uv", title: "Índice UV", meta: uv, icon: Sun },
  ]

  return (
    <div className="w-full">
      <Card className="p-6 bg-card border rounded-2xl">
        <h3 className="text-xl font-bold mb-4">Índices</h3>
        <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-1">
          <div className="flex md:block gap-3 overflow-x-auto pb-2">
          {items.map((it) => {
            const Icon = it.icon
            return (
              <div key={it.key} className="flex items-center justify-between gap-3 rounded-xl p-3 border min-w-[220px] md:min-w-0">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{it.title}</p>
                    <p className="text-xs text-muted-foreground">{it.meta.label}</p>
                  </div>
                </div>
                <span className={`h-3 w-3 rounded-full ${it.meta.color}`} />
              </div>
            )
          })}
          </div>
        </div>
      </Card>
    </div>
  )
}