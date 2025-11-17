// hooksVM/useWeatherViewModel.ts
import { useEffect, useState } from "react";
import { extractHourlyForDay } from "../dataM/WeatherParser";

import {
  ForecastBundle,
  ForecastCurrent,
  ForecastDaily,
  ForecastHourly,
} from "../dataM/WeatherModels";

import { WeatherProvider } from "../dataM/WeatherProvider";
import { getWeather } from "../dataM/WeatherRepo";
import useNetworkMonitor from "./useNetworkMonitor";

export function useWeatherViewModel() {
  const isOnline = useNetworkMonitor();

  const [weather, setWeather] = useState<ForecastBundle | null>(null);
  const [provider, setProvider] = useState<WeatherProvider>(WeatherProvider.SMHI);
  const [lat, setLat] = useState(59.33);
  const [lon, setLon] = useState(18.06);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  const [daily, setDaily] = useState<ForecastDaily[]>([]);
  const [hourly, setHourly] = useState<ForecastHourly[]>([]);
  const [current, setCurrent] = useState<ForecastCurrent | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);

    try {
      const bundle = await getWeather(provider, lat, lon);

      setWeather(bundle);
      setDaily(bundle.daily);
      setHourly(bundle.hourly);
      setCurrent(bundle.current);

    } catch (e) {
      console.error("Failed to load weather", e);
      if (!isOnline) setError("Offline — showing cached or empty data.");
      else setError("Failed to load weather.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [provider, lat, lon]);

  // ---- Derived hourly slice for selected day ----
  let selectedDayHourly: ForecastHourly[] = [];
  if (weather && selectedDayIndex !== null) {
    selectedDayHourly = extractHourlyForDay(weather, selectedDayIndex);
  }

  return {
    // Weather data
    weather,
    current,
    hourly,
    daily,
    selectedDayHourly,
    selectedDayIndex,

    // User settings
    provider,
    setProvider,
    lat,
    lon,
    setLat,
    setLon,

    // UI state
    loading,
    error,
    isOnline,

    // Actions
    refresh,
    setSelectedDayIndex,
  };
}
