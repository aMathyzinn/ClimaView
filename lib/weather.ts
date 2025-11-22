export function getWeatherDescription(code: number, isDay = 1): string {
  const descriptions: { [key: number]: { day: string; night: string } } = {
    0: { day: "Céu limpo", night: "Céu limpo" },
    1: { day: "Principalmente limpo", night: "Principalmente limpo" },
    2: { day: "Parcialmente nublado", night: "Parcialmente nublado" },
    3: { day: "Nublado", night: "Nublado" },
    45: { day: "Neblina", night: "Neblina" },
    48: { day: "Neblina com geada", night: "Neblina com geada" },
    51: { day: "Garoa leve", night: "Garoa leve" },
    53: { day: "Garoa moderada", night: "Garoa moderada" },
    55: { day: "Garoa densa", night: "Garoa densa" },
    56: { day: "Garoa congelante leve", night: "Garoa congelante leve" },
    57: { day: "Garoa congelante densa", night: "Garoa congelante densa" },
    61: { day: "Chuva leve", night: "Chuva leve" },
    63: { day: "Chuva moderada", night: "Chuva moderada" },
    65: { day: "Chuva forte", night: "Chuva forte" },
    66: { day: "Chuva congelante leve", night: "Chuva congelante leve" },
    67: { day: "Chuva congelante forte", night: "Chuva congelante forte" },
    71: { day: "Neve leve", night: "Neve leve" },
    73: { day: "Neve moderada", night: "Neve moderada" },
    75: { day: "Neve forte", night: "Neve forte" },
    77: { day: "Grãos de neve", night: "Grãos de neve" },
    80: { day: "Pancadas de chuva leves", night: "Pancadas de chuva leves" },
    81: { day: "Pancadas de chuva moderadas", night: "Pancadas de chuva moderadas" },
    82: { day: "Pancadas de chuva violentas", night: "Pancadas de chuva violentas" },
    85: { day: "Pancadas de neve leves", night: "Pancadas de neve leves" },
    86: { day: "Pancadas de neve fortes", night: "Pancadas de neve fortes" },
    95: { day: "Tempestade", night: "Tempestade" },
    96: { day: "Tempestade com granizo leve", night: "Tempestade com granizo leve" },
    99: { day: "Tempestade com granizo forte", night: "Tempestade com granizo forte" },
  }

  const desc = descriptions[code] || { day: "Desconhecido", night: "Desconhecido" }
  return isDay ? desc.day : desc.night
}