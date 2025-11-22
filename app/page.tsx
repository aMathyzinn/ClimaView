"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { SearchBar } from "@/components/search-bar"
import { WeatherCard } from "@/components/weather-card"
import { ForecastChart } from "@/components/forecast-chart"
import { ForecastCards } from "@/components/forecast-cards"
import { WeatherBackground } from "@/components/weather-background"
import { IndicesPanel } from "@/components/indices-panel"
import { Card } from "@/components/ui/card"
import { fetchWeather } from "./actions"

export default function Home() {
  const [city, setCity] = useState("São Paulo")
  const [weatherData, setWeatherData] = useState<any>(null)
  const [forecastData, setForecastData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const isDarkInitial = stored ? stored === "dark" : systemDark
    setIsDark(isDarkInitial)
    if (isDarkInitial) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  useEffect(() => {
    loadWeatherData(city)
    // Auto-refresh every 10 minutes
    const interval = setInterval(() => {
      loadWeatherData(city)
    }, 600000)
    return () => clearInterval(interval)
  }, [city])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle("dark")
    try {
      localStorage.setItem("theme", next ? "dark" : "light")
    } catch {}
  }

  const loadWeatherData = async (cityName: string) => {
    setLoading(true)
    setError(null)
    try {
      console.log("Loading weather data for:", cityName)
      const result = await fetchWeather(cityName)

      if ("error" in result) {
        setError(result.error || null)
        setWeatherData(null)
        setForecastData(null)
      } else {
        setWeatherData(result.weather)
        setForecastData(result.forecast)
        console.log("Weather data loaded successfully")
      }
    } catch (err) {
      setError("Erro ao buscar dados do clima")
      console.log("Error loading weather data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchCity: string) => {
    if (searchCity.trim()) {
      setCity(searchCity)
    }
  }

  const getWeatherConditionFromCode = (code: number) => {
    if (code === 0 || code === 1) return "Clear"
    if (code === 2 || code === 3) return "Clouds"
    if (code >= 51 && code <= 67) return "Rain"
    if (code >= 71 && code <= 77) return "Snow"
    if (code >= 80 && code <= 82) return "Rain"
    if (code >= 85 && code <= 86) return "Snow"
    if (code >= 95 && code <= 99) return "Thunderstorm"
    return "Clouds"
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <WeatherBackground
        weatherCondition={weatherData ? getWeatherConditionFromCode(weatherData.current.weather_code) : undefined}
      />

      

      <div className="relative z-10">
        <Navbar isDark={isDark} onToggleTheme={toggleTheme} />

        <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <Card className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
            <SearchBar onSearch={handleSearch} loading={loading} />

          {error && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
                <p className="font-medium text-destructive">{error}</p>
              </div>
            </div>
          )}

          {weatherData && !error ? (
            <>
              <WeatherCard data={weatherData} />

              <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 sm:gap-6 items-start">
                {weatherData && <ForecastChart data={weatherData} />}
                <IndicesPanel data={weatherData} />
              </div>
              {weatherData && <ForecastCards data={weatherData} />}
            </>
          ) : (
            !loading &&
            !error && (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground">Digite uma cidade para ver o clima</p>
              </div>
            )
          )}

          {loading && (
            <div className="text-center py-20">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="text-lg text-muted-foreground mt-4">Carregando dados do clima...</p>
            </div>
          )}
          </Card>
        </main>
      </div>
    </div>
  )
}
