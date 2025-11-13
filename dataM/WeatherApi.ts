import axios from "axios";
import { WeatherProvider } from "./WeatherProvider";

// Base URLs
const SMHI_URL =
  "https://maceo.sth.kth.se/weather/forecast?lonLat=lon/14.333/lat/60.383";
const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

// Raw API response types from JSON, Test
export interface RawSMHIResponse { 
  timeSeries: {
    validTime: string;
    parameters: {
      name: string;
      levelType: string;
      level: number;
      unit: string;
      values: number[];
    }[];
  }[];
}

// Raw API response types from JSON, Open-Meteo
export interface RawOpenMeteoResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    cloudcover_mean: number[];
  };
}

// Fetch weather data from the selected provider
export async function fetchWeather(
  provider: WeatherProvider,
  lat: number,
  lon: number
): Promise<RawSMHIResponse | RawOpenMeteoResponse> {
  if (provider === WeatherProvider.SMHI) {
    const res = await axios.get<RawSMHIResponse>(SMHI_URL);
    return res.data;
  } else {
    const res = await axios.get<RawOpenMeteoResponse>(OPEN_METEO_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        daily:
          "temperature_2m_max,temperature_2m_min,cloudcover_mean",
        forecast_days: 7,
        timezone: "auto",
      },
    });
    console.log("Fetching forecast for provider:", provider);
    return res.data;
  }
}
