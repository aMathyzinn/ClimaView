"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface ForecastChartProps {
  data: any
}

export function ForecastChart({ data }: ForecastChartProps) {
  const tempChartRef = useRef<HTMLCanvasElement>(null)
  const humidityChartRef = useRef<HTMLCanvasElement>(null)
  const tempChartInstance = useRef<Chart | null>(null)
  const humidityChartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!data || !data.daily || !tempChartRef.current || !humidityChartRef.current) return

    const labels = data.daily.time.slice(0, 7).map((dateStr: string) => {
      const date = new Date(dateStr)
      return date.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric" })
    })

    const maxTemps = data.daily.temperature_2m_max.slice(0, 7).map(Math.round)
    const minTemps = data.daily.temperature_2m_min.slice(0, 7).map(Math.round)
    const avgTemps = maxTemps.map((max: number, i: number) => Math.round((max + minTemps[i]) / 2))

    // Calculate average humidity from hourly data for each day
    const humidity = labels.map((_: string, dayIndex: number) => {
      const startHour = dayIndex * 24
      const endHour = startHour + 24
      const dayHumidity = data.hourly.relative_humidity_2m.slice(startHour, endHour)
      return Math.round(dayHumidity.reduce((a: number, b: number) => a + b, 0) / dayHumidity.length)
    })

    const tempCtx = tempChartRef.current.getContext("2d")
    if (tempCtx) {
      if (!tempChartInstance.current) {
        const gradient = tempCtx.createLinearGradient(0, 0, 0, 400)
        gradient.addColorStop(0, "rgba(14, 165, 233, 0.3)")
        gradient.addColorStop(1, "rgba(14, 165, 233, 0.01)")
        tempChartInstance.current = new Chart(tempCtx, {
          type: "line",
          data: {
            labels,
            datasets: [
              {
                label: "Temperatura Média (°C)",
                data: avgTemps,
                borderColor: "rgb(14, 165, 233)",
                backgroundColor: gradient,
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 9,
                pointBackgroundColor: "rgb(14, 165, 233)",
                pointBorderColor: "#fff",
                pointBorderWidth: 3,
                pointHoverBackgroundColor: "rgb(14, 165, 233)",
                pointHoverBorderColor: "#fff",
                pointHoverBorderWidth: 4,
                borderWidth: 3,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                padding: 16,
                titleFont: { size: 15, weight: "bold" },
                bodyFont: { size: 14 },
                borderColor: "rgba(14, 165, 233, 0.3)",
                borderWidth: 1,
                cornerRadius: 12,
                displayColors: false,
              },
            },
            scales: {
              y: {
                beginAtZero: false,
              grid: {
                color: "rgba(148, 163, 184, 0.1)",
              },
              ticks: {
                font: { size: 13, weight: 500 },
                color: "rgb(100, 116, 139)",
                padding: 10,
              },
            },
            x: {
              grid: { display: false },
              ticks: {
                font: { size: 13, weight: 500 },
                color: "rgb(100, 116, 139)",
                padding: 8,
              },
            },
          },
        },
      })
      } else {
        tempChartInstance.current.data.labels = labels
        tempChartInstance.current.data.datasets[0].data = avgTemps
        tempChartInstance.current.update()
      }
    }

    // Humidity Chart
    const humidityCtx = humidityChartRef.current.getContext("2d")
    if (humidityCtx) {
      if (!humidityChartInstance.current) {
        humidityChartInstance.current = new Chart(humidityCtx, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: "Umidade (%)",
                data: humidity,
                backgroundColor: "rgba(59, 130, 246, 0.7)",
                borderColor: "rgb(59, 130, 246)",
                borderWidth: 2,
                borderRadius: 12,
                hoverBackgroundColor: "rgba(59, 130, 246, 0.9)",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                padding: 16,
                titleFont: { size: 15, weight: "bold" },
                bodyFont: { size: 14 },
                borderColor: "rgba(59, 130, 246, 0.3)",
                borderWidth: 1,
                cornerRadius: 12,
                displayColors: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
              grid: {
                color: "rgba(148, 163, 184, 0.1)",
              },
              ticks: {
                font: { size: 13, weight: 500 },
                color: "rgb(100, 116, 139)",
                padding: 10,
              },
            },
            x: {
              grid: { display: false },
              ticks: {
                font: { size: 13, weight: 500 },
                color: "rgb(100, 116, 139)",
                padding: 8,
              },
            },
            },
          },
        })
      } else {
        humidityChartInstance.current.data.labels = labels
        humidityChartInstance.current.data.datasets[0].data = humidity
        humidityChartInstance.current.update()
      }
    }

    return () => {
      if (tempChartInstance.current) {
        tempChartInstance.current.destroy()
        tempChartInstance.current = null
      }
      if (humidityChartInstance.current) {
        humidityChartInstance.current.destroy()
        humidityChartInstance.current = null
      }
    }
  }, [data])

  return (
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
      <div>
        <Card className="p-6 bg-card border rounded-2xl">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="text-3xl">📈</span>
            <span className="text-foreground">Temperatura da Semana</span>
          </h3>
          <div className="h-56 sm:h-64 md:h-72">
            <canvas ref={tempChartRef}></canvas>
          </div>
        </Card>
      </div>

      <div>
        <Card className="p-6 bg-card border rounded-2xl">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="text-3xl">💧</span>
            <span className="text-foreground">Umidade Diária</span>
          </h3>
          <div className="h-56 sm:h-64 md:h-72">
            <canvas ref={humidityChartRef}></canvas>
          </div>
        </Card>
      </div>
    </div>
  )
}
