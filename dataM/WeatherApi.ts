/// dataM/WeatherApi.ts

import axios from "axios";
import { WeatherProvider } from "./WeatherProvider";

// Typer / interfaces för Open-Meteo-svar

export interface OpenMeteoCurrent {
  temperature_2m: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
}

export interface OpenMeteoHourly {
  time: string[];
  temperature_2m: number[];
  precipitation: number[];
}

export interface OpenMeteoDaily {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather: OpenMeteoCurrent;
  hourly: OpenMeteoHourly;
  daily: OpenMeteoDaily;
}

// Typer för SMHI-svar kan definieras beroende på vad SMHI-API returnerar.
// Generiskt `any`, kan bytas ut det mot en konkret typ när behövs.
export type SmhiForecast = any;

// Bas-url för SMHI
const SMHI_URL =
  "https://maceo.sth.kth.se/weather/forecast?lonLat=lon/14.333/lat/60.383";

// Bas-url för Open-Meteo
const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Hämtar väderdata från vald provider (SMHI eller Open-Meteo)
 * @param provider - vilken väderleverantör du vill använda
 * @param lat - latitud
 * @param lon - longitud
 * @returns Väderdatan som ett JavaScript-objekt
 */
export async function fetchWeather(
  provider: WeatherProvider,
  lat: number,
  lon: number
): Promise<OpenMeteoResponse | SmhiForecast> {
  console.log("🌍 fetchWeather() called", { provider, lat, lon });

  if (provider === WeatherProvider.SMHI) {
    console.log("📡 Calling SMHI...");
    try {
      const response = await axios.get<SmhiForecast>(SMHI_URL);
      console.log("✅ SMHI response OK");
      return response.data;
    } catch (error) {
      console.error("❌ SMHI request failed:", error);
      throw error;
    }
  } else {
    console.log("📡 Calling Open-Meteo (axios)…");

    try {
      const response = await axios.get<OpenMeteoResponse>(OPEN_METEO_URL, {
        params: {
          latitude: lat,
          longitude: lon,
          current_weather: true,
          hourly: "temperature_2m,precipitation",
          daily: "weather_code,temperature_2m_max,temperature_2m_min",
          timezone: "auto",
        },
      });

      console.log("✅ Open-Meteo response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Open-Meteo request failed:", error);
      throw error;
    }
  }
}
