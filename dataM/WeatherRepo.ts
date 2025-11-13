import { fetchWeather } from "./WeatherApi";
import { ForecastDay, mapOpenMeteoToDays, mapSMHIToDays } from "./WeatherParser";
import { WeatherProvider } from "./WeatherProvider";

// Get forecast data from the selected provider and map to common model
export async function getForecast(
  provider: WeatherProvider,
  lat: number,
  lon: number
): Promise<ForecastDay[]> {
  const raw = await fetchWeather(provider, lat, lon);

  console.log("Got raw data keys:", Object.keys(raw));
  return provider === WeatherProvider.SMHI
    ? mapSMHIToDays(raw as any)
    : mapOpenMeteoToDays(raw as any);
}
