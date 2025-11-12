import { fetchWeather } from "./WeatherApi";
import { ForecastDay, mapOpenMeteoToDays, mapSMHIToDays } from "./WeatherParser";
import { WeatherProvider } from "./WeatherProvider";

export async function getForecast(
  provider: WeatherProvider,
  lat: number,
  lon: number
): Promise<ForecastDay[]> {
  const raw = await fetchWeather(provider, lat, lon);

  return provider === WeatherProvider.SMHI
    ? mapSMHIToDays(raw as any)
    : mapOpenMeteoToDays(raw as any);
}
