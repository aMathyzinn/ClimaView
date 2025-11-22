"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Loader2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  onSearch: (city: string) => void
  loading?: boolean
}

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [value, setValue] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.length < 2) {
        setSuggestions([])
        return
      }

      setLoadingSuggestions(true)
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(value)}&count=5&language=pt&format=json`,
        )
        const data = await response.json()
        setSuggestions(data.results || [])
      } catch (error) {
        console.error("Error fetching suggestions:", error)
        setSuggestions([])
      } finally {
        setLoadingSuggestions(false)
      }
    }

    const timer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timer)
  }, [value])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onSearch(value)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: any) => {
    const cityName = suggestion.name
    setValue(cityName)
    onSearch(cityName)
    setShowSuggestions(false)
    setSuggestions([])
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-blue-600/20 rounded-2xl blur-xl" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
          <Input
            type="text"
            placeholder="Digite o nome de uma cidade..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="relative pl-12 pr-4 h-14 text-lg bg-card/80 backdrop-blur-xl border-border/50 rounded-2xl shadow-lg transition-all focus:bg-card focus:border-primary/50 focus:shadow-xl"
          />

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full mt-3 w-full bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden z-50">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-5 py-4 text-left hover:bg-accent/80 transition-all flex items-center gap-3 border-b border-border/30 last:border-0 group"
                >
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate text-foreground">{suggestion.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {suggestion.admin1 && `${suggestion.admin1}, `}
                      {suggestion.country}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={loading || !value.trim()}
          className="px-10 h-14 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 transition-all hover:scale-105 hover:shadow-xl shadow-lg font-semibold text-base"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Buscar"}
        </Button>
      </div>
    </form>
  )
}
