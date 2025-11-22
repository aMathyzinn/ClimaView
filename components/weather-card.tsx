import { Card } from "@/components/ui/card"
import { Thermometer, Droplets, Wind, Gauge } from "lucide-react"
import { getWeatherDescription } from "@/lib/weather"

interface WeatherCardProps {
  data: any
}

export function WeatherCard({ data }: WeatherCardProps) {
  const getWeatherIcon = (code: number, isDay: number) => {
    if (code === 0) return isDay ? "☀️" : "🌙"
    if (code === 1) return isDay ? "🌤️" : "🌙"
    if (code === 2) return "⛅"
    if (code === 3) return "☁️"
    if (code === 45 || code === 48) return "🌫️"
    if (code >= 51 && code <= 67) return "🌧️"
    if (code >= 71 && code <= 77) return "❄️"
    if (code >= 80 && code <= 82) return "🌦️"
    if (code >= 85 && code <= 86) return "🌨️"
    if (code >= 95 && code <= 99) return "⛈️"
    return "🌤️"
  }

  const { location, current } = data

  const getPeriodData = () => {
    const hourly = data.hourly
    const times: Date[] = (hourly?.time || []).map((t: string) => new Date(t))
    const today = new Date()
    const isSameDay = (d: Date) => d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate()

    const filterHours = (start: number, end: number) => {
      const indexes = times
        .map((d, i) => ({ d, i }))
        .filter(({ d }) => isSameDay(d) && d.getHours() >= start && d.getHours() < end)
        .map(({ i }) => i)
      const temps = indexes.map((i) => hourly.temperature_2m?.[i])
      const codes = indexes.map((i) => hourly.weather_code?.[i])
      const avgTemp = Math.round(temps.reduce((a: number, b: number) => a + b, 0) / Math.max(temps.length, 1))
      const freq: Record<number, number> = {}
      codes.forEach((c) => { if (typeof c === "number") freq[c] = (freq[c] || 0) + 1 })
      const weatherCode = Number(Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? current.weather_code)
      return { avgTemp, weatherCode }
    }

    return [
      { label: "Madrugada", ...filterHours(0, 6) },
      { label: "Manhã", ...filterHours(6, 12) },
      { label: "Tarde", ...filterHours(12, 18) },
      { label: "Noite", ...filterHours(18, 24) },
    ]
  }

  const periods = getPeriodData()

  return (
    <div className="max-w-6xl mx-auto">
      <div>
        <Card className="p-6 bg-card border-border rounded-2xl">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Main Weather Display */}
            <div className="flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6">
              <div className="text-5xl sm:text-7xl">
                {getWeatherIcon(current.weather_code, current.is_day)}
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl sm:text-5xl font-bold text-balance">
                  {location.name}
                  {location.region && `, ${location.region}`}
                </h2>
                <p className="text-sm text-muted-foreground font-medium tracking-wide uppercase">{location.country}</p>
                <p className="text-5xl sm:text-6xl font-black text-foreground">
                  {Math.round(current.temp)}°C
                </p>
                <p className="text-lg sm:text-2xl text-muted-foreground capitalize font-medium">
                  {getWeatherDescription(current.weather_code, current.is_day)}
                </p>
              </div>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="rounded-2xl p-6 border">
                <div className="flex items-center gap-3 text-sky-600 dark:text-sky-400 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                    <Thermometer className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-sm uppercase tracking-wide">Sensação</span>
                </div>
                <p className="text-4xl font-black">{Math.round(current.feels_like)}°C</p>
              </div>

              <div className="rounded-2xl p-6 border">
                <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                    <Droplets className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-sm uppercase tracking-wide">Umidade</span>
                </div>
                <p className="text-3xl sm:text-4xl font-black">{current.humidity}%</p>
              </div>

              <div className="rounded-2xl p-6 border">
                <div className="flex items-center gap-3 text-cyan-600 dark:text-cyan-400 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                    <Wind className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-sm uppercase tracking-wide">Vento</span>
                </div>
                <p className="text-3xl sm:text-4xl font-black">{Math.round(current.wind_speed)} km/h</p>
              </div>

              <div className="rounded-2xl p-6 border">
                <div className="flex items-center gap-3 text-teal-600 dark:text-teal-400 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                    <Gauge className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-sm uppercase tracking-wide">Pressão</span>
                </div>
                <p className="text-3xl sm:text-4xl font-black">{Math.round(current.pressure)} hPa</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-6">
          <Card className="p-6 bg-card border rounded-2xl">
            <div className="flex items-center justify-between">
              {periods.map((p) => (
                <div key={p.label} className="flex flex-col items-center gap-2">
                  <div className="text-2xl">
                    {getWeatherIcon(p.weatherCode, 1)}
                  </div>
                  <p className="text-sm font-semibold">{p.label}</p>
                  <p className="text-sm text-muted-foreground">{isNaN(p.avgTemp) ? "--" : `${p.avgTemp}°C`}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
