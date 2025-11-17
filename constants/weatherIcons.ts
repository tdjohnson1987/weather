// Weather codes → icons
export function cloudIconFromWeatherCode(code: number): string {
  if (code === 0) return "☀️";               // Clear sky
  if (code <= 3) return "🌤️";               // Mostly clear / partly cloudy
  if (code <= 45) return "🌫️";              // Fog / mist
  if (code <= 55) return "🌦️";              // Drizzle / light rain
  if (code <= 65) return "🌧️";              // Rain
  if (code <= 75) return "❄️";              // Snow
  if (code <= 95) return "⛈️";              // Thunderstorm
  return "☁️";                              // Default cloud
}

export function windDirectionFromDegrees(deg: number): string {
  if (deg >= 337.5 || deg < 22.5) return "⬆️";      // N
  if (deg >= 22.5 && deg < 67.5) return "↗️";       // NE
  if (deg >= 67.5 && deg < 112.5) return "➡️";      // E
  if (deg >= 112.5 && deg < 157.5) return "↘️";     // SE
  if (deg >= 157.5 && deg < 202.5) return "⬇️";     // S
  if (deg >= 202.5 && deg < 247.5) return "↙️";     // SW
  if (deg >= 247.5 && deg < 292.5) return "⬅️";     // W
  if (deg >= 292.5 && deg < 337.5) return "↖️";     // NW
  return "❓";                                      // Unknown
}   

