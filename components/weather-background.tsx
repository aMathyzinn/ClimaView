"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface WeatherBackgroundProps {
  weatherCondition?: string
}

export function WeatherBackground({ weatherCondition }: WeatherBackgroundProps) {
  const [particles, setParticles] = useState<Array<{ id: number; style: React.CSSProperties }>>([])

  useEffect(() => {
    // Generate particles based on weather condition
    const generateParticles = () => {
      const count = weatherCondition === "Rain" ? 50 : weatherCondition === "Snow" ? 30 : 0
      const newParticles = Array.from({ length: count }, (_, i) => ({
        id: i,
        style: {
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${3 + Math.random() * 2}s`,
        },
      }))
      setParticles(newParticles)
    }

    generateParticles()
  }, [weatherCondition])

  const getBackgroundClass = () => {
    switch (weatherCondition) {
      case "Clear":
        return "bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950"
      case "Clouds":
        return "bg-gradient-to-br from-slate-300 via-gray-400 to-slate-500 dark:from-slate-800 dark:via-slate-900 dark:to-gray-950"
      case "Rain":
      case "Drizzle":
        return "bg-gradient-to-br from-slate-500 via-slate-600 to-blue-900 dark:from-slate-900 dark:via-slate-950 dark:to-black"
      case "Snow":
        return "bg-gradient-to-br from-blue-100 via-slate-200 to-cyan-200 dark:from-slate-800 dark:via-slate-900 dark:to-blue-950"
      case "Thunderstorm":
        return "bg-gradient-to-br from-slate-700 via-purple-900 to-slate-900 dark:from-black dark:via-purple-950 dark:to-black"
      default:
        return "bg-gradient-to-br from-blue-100 via-sky-200 to-blue-300 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950"
    }
  }

  return (
    <>
      <div className={`fixed inset-0 ${getBackgroundClass()}`} />

      {/* Animated particles for rain/snow */}
      {(weatherCondition === "Rain" || weatherCondition === "Snow") && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute ${
                weatherCondition === "Rain"
                  ? "w-1 h-10 bg-blue-300/50"
                  : "h-3 w-3 rounded-full bg-white/70"
              } animate-fall`}
              style={particle.style}
            />
          ))}
        </div>
      )}
    </>
  )
}
