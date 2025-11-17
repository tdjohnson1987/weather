// dataM/WeatherApi.ts
import axios from "axios";
import { fetchWeatherApi } from "openmeteo";
import { WeatherProvider } from "./WeatherProvider";

const SMHI_URL =
  "https://maceo.sth.kth.se/weather/forecast?lonLat=lon/14.333/lat/60.383";

export async function fetchWeather(
  provider: WeatherProvider,
  lat: number,
  lon: number
): Promise<any> {
  console.log("🌍 fetchWeather() called");
  console.log("Provider:", provider, "Lat:", lat, "Lon:", lon);

  if (provider === WeatherProvider.SMHI) {
    console.log("📡 Calling SMHI...");
    try {
      const res = await axios.get(SMHI_URL);
      console.log("✅ SMHI response OK");
      return res.data;
    } catch (err) {
      console.error("❌ SMHI request failed:", err);
      throw err;
    }
  }

  console.log("📡 Calling Open-Meteo CLIENT…");
  const params = {
    latitude: [lat],
    longitude: [lon],
    current:
      "temperature_2m,weather_code,wind_speed_10m,wind_direction_10m",
    hourly: "temperature_2m,precipitation",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    timezone: "auto",
  };

  const url = "https://api.open-meteo.com/v1/forecast";

  try {
    const responses = await fetchWeatherApi(url, params);
    const model = responses[0];

    console.log("Open-Meteo raw client model:", model);
    console.log("🔎 Has current()? ->", typeof model.current === "function");
    console.log("🔎 Has hourly()? ->", typeof model.hourly === "function");
    console.log("🔎 Has daily()? ->", typeof model.daily === "function");

    return model;
  } catch (err) {
    console.error("❌ Open-Meteo client FAILED:", err);
    throw err;
  }
}
