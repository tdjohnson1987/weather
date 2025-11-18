// import { fetchWeather } from "./WeatherApi";
// import { ForecastBundle } from "./WeatherModels";
// import { parseOpenMeteo, parseSMHI, RawSMHIResponse } from "./WeatherParser";

export enum WeatherProvider {
  SMHI = "SMHI",
  OPEN_METEO = "OPEN_METEO",
}

// export interface ProviderAdapter {
//   getWeather(lat: number, lon: number): Promise<ForecastBundle>;
// }

// const openMeteoAdapter: ProviderAdapter = {
//   async getWeather(lat, lon) {
//     const raw = await fetchWeather(WeatherProvider.OPEN_METEO, lat, lon);
//     return parseOpenMeteo(raw);
//   },
// };

// const smhiAdapter: ProviderAdapter = {
//   async getWeather(lat, lon) {
//     const raw = await fetchWeather(WeatherProvider.SMHI, lat, lon);
//     return parseSMHI(raw as RawSMHIResponse);
//   },
// };

// // simple registry
// const registry: Record<WeatherProvider, ProviderAdapter> = {
//   [WeatherProvider.OPEN_METEO]: openMeteoAdapter,
//   [WeatherProvider.SMHI]: smhiAdapter,
// };

// export function getAdapter(provider: WeatherProvider): ProviderAdapter {
//   const adapter = registry[provider];
//   if (!adapter) throw new Error(`No adapter for provider ${provider}`);
//   return adapter;
// }
