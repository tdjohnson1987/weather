// dataM/WeatherRepo.ts
import { fetchWeather } from "./WeatherApi";
import { ForecastBundle } from "./WeatherModels";
import { parseOpenMeteo, parseSMHI, RawSMHIResponse } from "./WeatherParser";
import { WeatherProvider } from "./WeatherProvider";

export async function getWeather(
  provider: WeatherProvider,
  lat: number,
  lon: number
): Promise<ForecastBundle> {

  const raw = await fetchWeather(provider, lat, lon);

  if (provider === WeatherProvider.OPEN_METEO) {
    return parseSMHI(raw as RawSMHIResponse);
  } else {
    return parseOpenMeteo(raw);
  }
}
