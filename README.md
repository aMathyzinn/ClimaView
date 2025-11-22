<p align="center">
  <img src="public/logo.png" alt="Preview" width="45%"/>
</p>

# ClimaView — Modern Weather Dashboard

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Geist&pause=1000&color=14A5E9&center=true&vCenter=true&width=900&lines=ClimaView+%F0%9F%8C%A1+Modern+Weather+Dashboard;Real-time+forecast+with+responsive+charts;Smooth+mobile+and+desktop+experience)](https://github.com/aMathyzinn/ClimaView)

[![Stars](https://img.shields.io/github/stars/aMathyzinn/ClimaView?style=social)](https://github.com/aMathyzinn/ClimaView/stargazers)
[![Issues](https://img.shields.io/github/issues/aMathyzinn/ClimaView?color=14A5E9)](https://github.com/aMathyzinn/ClimaView/issues)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)](https://nextjs.org/)
[![Tailwind](https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![Open‑Meteo](https://img.shields.io/badge/Open%E2%80%91Meteo-API-0EA5E9)](https://open-meteo.com/)

## Overview

ClimaView is a weather dashboard focused on usability and a clean visual design. It fetches real‑time data from Open‑Meteo, presents day‑period forecasts, weekly charts, and a dynamic indices panel (barbecue, mosquitoes, frizz, skin dryness, cold/flu, and UV) computed from current conditions and the next hours.

## Preview

<p align="center">
  <img src="public/clima.png" alt="Preview" width="85%"/>
</p>

## Features

- Responsive UI and performance with Next.js 16 + Tailwind 4
- City search with suggestions (Open‑Meteo geocoding)
- Day periods computed from `hourly`
- Weekly temperature and daily humidity charts (Chart.js)
- Dynamic indices based on temperature/humidity/wind and upcoming precipitation
- Persistent light/dark theme without flicker

## Installation

```bash
# Node 18+
npm install
npm run dev
```

- Dev: `http://localhost:3000`
- Build: `npm run build` and `npm start`
- Typecheck: `npx tsc --noEmit`

## Structure

```
app/
  actions.ts         # Server Action: fetch and transform Open‑Meteo data
  layout.tsx         # Theme and base layout
  page.tsx           # Home (content wrapper)
components/
  navbar.tsx         # Responsive header
  search-bar.tsx     # Search with suggestions
  weather-card.tsx   # Current + periods (late night/morning/afternoon/night)
  forecast-chart.tsx # Charts: weekly temperature and daily humidity
  forecast-cards.tsx # Forecast for the next days
  indices-panel.tsx  # Dynamic indices (barbecue, mosquitoes, etc.)
  weather-background.tsx # Subtle weather background
lib/
  weather.ts         # Utilities (WMO descriptions)
```

## Open‑Meteo API

- Geocoding:
  - `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=1&language=en&format=json`
- Forecast:
  - `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,wind_speed_10m_max,wind_gusts_10m_max&timezone=auto&forecast_days=7`
- Light caching via `{ next: { revalidate } }` for a good balance between freshness and performance.

### Dynamic Indices (how they’re computed)

- Barbecue: combines `tempNow`, `windNow`, and average `precipitation_probability` over the next 6h.
- Mosquitoes: favored by `tempNow ≥ 24°C` and `humNow ≥ 65%`.
- Frizz: scales with `humNow` (≥ 70 high).
- Dryness: inversely scales with `humNow` (≤ 30 high).
- Cold/Flu: depends on current cold, daily thermal amplitude, and wind.
- UV: uses the hourly index when available; otherwise daily `uv_index_max`.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm start` — serve build
- `npx tsc --noEmit` — type checking

## Customization

- Tweak colors/radii in `app/globals.css`.
- Adjust index thresholds in `components/indices-panel.tsx`.
- Edit typography/spacing in `weather-card.tsx` and `forecast-cards.tsx`.

## Contributing

1. Fork this repo
2. Create a branch: `git checkout -b feat/my-feature`
3. Commit: `git commit -m "feat: my feature"`
4. Push: `git push origin feat/my-feature`
5. Open a PR

## License

GNU GPL-3.0 — free software with copyleft; redistribution and modification under GPL‑3.0 terms. See https://www.gnu.org/licenses/gpl-3.0.html.

---

If you enjoy it, leave a ⭐ on the repo. Feedback is very welcome!

[![Repobeats](https://repobeats.axiom.co/api/embed/1101775470.svg)](https://github.com/aMathyzinn/ClimaView)
