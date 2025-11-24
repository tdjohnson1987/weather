// VM to save favorite location for later uses with the app 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const FAVORITE_KEY = "@favorite_location";

export function useFavoriteLocation() {
  const [favorite, setFavorite] = useState<{
    lat: number;
    lon: number;
    name?: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(FAVORITE_KEY);
      if (saved) setFavorite(JSON.parse(saved));
    })();
  }, []);

  const saveFavorite = async (loc: { lat: number; lon: number; name?: string }) => {
    setFavorite(loc);
    await AsyncStorage.setItem(FAVORITE_KEY, JSON.stringify(loc));
  };

  const clearFavorite = async () => {
    setFavorite(null);
    await AsyncStorage.removeItem(FAVORITE_KEY);
  };

  return { favorite, saveFavorite, clearFavorite };
}
