"use client"

import Image from "next/image"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  isDark: boolean
  onToggleTheme: () => void
}

export function Navbar({ isDark, onToggleTheme }: NavbarProps) {
  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <Image src="/logo.png" alt="ClimaView" width={64} height={64} className="rounded-xl sm:w-[72px] sm:h-[72px]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              ClimaView
            </h1>
            <p className="hidden sm:block text-xs text-muted-foreground mt-0.5">Previsão em tempo real</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={onToggleTheme}
          className="rounded-xl h-11 w-11"
        >
          {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
        </Button>
      </div>
    </nav>
  )
}
