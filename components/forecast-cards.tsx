import { Card } from "@/components/ui/card"
import { getWeatherDescription } from "@/lib/weather"

interface ForecastCardsProps {
  data: any
}

export function ForecastCards({ data }: ForecastCardsProps) {
  type DailyForecast = { date: Date; weather_code: number; temp_max: number; temp_min: number }
  const dailyForecasts: DailyForecast[] = data.daily.time.slice(1, 6).map((dateStr: string, index: number) => ({
    date: new Date(dateStr),
    weather_code: data.daily.weather_code[index + 1],
    temp_max: data.daily.temperature_2m_max[index + 1],
    temp_min: data.daily.temperature_2m_min[index + 1],
  }))

  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return "☀️"
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

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Previsão dos Próximos Dias</h2>
      <div className="md:grid md:grid-cols-5 gap-5 flex md:flex-none overflow-x-auto md:overflow-visible gap-4 md:gap-5 pb-2 md:pb-0 snap-x">
        {dailyForecasts.map((forecast: DailyForecast, index: number) => {
          const dayName = forecast.date.toLocaleDateString("pt-BR", { weekday: "short" })
          const dayNumber = forecast.date.getDate()

          return (
            <div key={index} className="min-w-[160px] md:min-w-0 snap-center">
              <Card className="p-4 sm:p-6 text-center bg-card border rounded-2xl">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{dayName}</p>
                <p className="text-2xl sm:text-3xl font-black mb-4 text-foreground">{dayNumber}</p>
                <div className="text-5xl sm:text-6xl mb-4">
                  {getWeatherIcon(forecast.weather_code)}
                </div>
                <div className="space-y-2">
                  <p className="text-2xl sm:text-3xl font-black text-foreground">{Math.round(forecast.temp_max)}°C</p>
                  <p className="text-sm sm:text-base text-muted-foreground font-semibold">{Math.round(forecast.temp_min)}°C</p>
                  <p className="text-xs text-muted-foreground capitalize leading-tight px-2">
                    {getWeatherDescription(forecast.weather_code)}
                  </p>
                </div>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
