import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { ForecastDay } from "../dataM/WeatherParser";
import { WeatherProvider } from "../dataM/WeatherProvider";
import { getForecast } from "../dataM/WeatherRepo";
import useNetworkMonitor from "./useNetworkMonitor";

export function useWeatherViewModel() { // ViewModel hook for weather forecast
  const isOnline = useNetworkMonitor(); // Network status
  const colorScheme = useColorScheme(); 
  const isDarkMode = colorScheme === "dark"; 

  const [days, setDays] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  const [lat, setLat] = useState(59.33); // Stockholm
  const [lon, setLon] = useState(18.06); // Stockholm

  async function refresh() {
    setLoading(true);
    setError(null);

    try {
      // ✅ Choose provider: SMHI (test server), OPEN_METEO (for web)
      const provider =
        typeof window !== "undefined"
          ? WeatherProvider.OPEN_METEO // browser: Open-Meteo 
          : WeatherProvider.SMHI;       // native: SMHI (test server)

      const data = await getForecast(provider, lat, lon);
      console.log("ViewModel received days:", data.length);
      setDays(data);
    } catch (err) {
      console.error("Refresh error:", err);
      if (!isOnline) setError("Offline — showing cached data.");
      else setError("Failed to load forecast.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return {
    days,
    loading,
    error,
    isOnline,
    lon,
    lat,
    setLon,
    setLat,
    refresh,
    isDarkMode,
  };
}
