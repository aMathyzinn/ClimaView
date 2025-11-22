import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ClimaView - Dashboard de Clima Moderno",
  description: "Acompanhe o clima em tempo real com gráficos interativos e previsões detalhadas",
  icons: {
    icon: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('theme');var s=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var theme=t||s;var el=document.documentElement;if(theme==='dark'){el.classList.add('dark')}else{el.classList.remove('dark')}}catch(e){}})();`}
        </Script>
      </head>
      <body className={`font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
