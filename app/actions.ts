"use server"

export async function fetchWeather(cityName: string) {
  try {
    console.log("Fetching weather for city:", cityName)

    // Step 1: Get coordinates from city name using Open-Meteo Geocoding API
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=pt&format=json`,
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    )

    if (!geoRes.ok) {
      console.log("Geocoding API error:", geoRes.status)
      return { error: "Erro ao buscar localização da cidade." }
    }

    const geoData = await geoRes.json()

    if (!geoData.results || geoData.results.length === 0) {
      return { error: "Cidade não encontrada. Tente outro nome." }
    }

    const { latitude, longitude, name, country, admin1 } = geoData.results[0]
    console.log("Found location:", { name, country, latitude, longitude })

    // Step 2: Get current weather and forecast using coordinates
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,uv_index_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto&forecast_days=7`,
      { next: { revalidate: 600 } },
    )

    if (!weatherRes.ok) {
      console.log("Weather API error:", weatherRes.status)
      return { error: "Erro ao buscar dados do clima." }
    }

    const weatherData = await weatherRes.json()
    console.log("Weather data fetched successfully")

    // Transform Open-Meteo data to match our component structure
    const transformed = {
      location: {
        name: name,
        country: country,
        region: admin1 || "",
        lat: latitude,
        lon: longitude,
      },
      current: {
        temp: weatherData.current.temperature_2m,
        feels_like: weatherData.current.apparent_temperature,
        humidity: weatherData.current.relative_humidity_2m,
        wind_speed: weatherData.current.wind_speed_10m,
        wind_direction: weatherData.current.wind_direction_10m,
        pressure: weatherData.current.pressure_msl,
        weather_code: weatherData.current.weather_code,
        is_day: weatherData.current.is_day,
        precipitation: weatherData.current.precipitation,
        cloud_cover: weatherData.current.cloud_cover,
      },
      hourly: weatherData.hourly,
      daily: weatherData.daily,
      timezone: weatherData.timezone,
    }

    return { weather: transformed, forecast: { daily: weatherData.daily, hourly: weatherData.hourly } }
  } catch (error) {
    console.log("Error fetching weather data:", error)
    return { error: "Erro ao buscar dados do clima. Verifique sua conexão." }
  }
}
