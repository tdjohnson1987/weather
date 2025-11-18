// componentsV/CurrentWeatherCard.tsx
import React from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { cloudIconFromWeatherCode } from "../constants/weatherIcons";
import { ForecastCurrent } from "../dataM/WeatherModels";

interface Props {
  current: ForecastCurrent;
}

export default function CurrentWeatherCard({ current }: Props) {
  const theme = useColorScheme();
  const isDark = theme === "dark";

  const bg = isDark ? "#1f2933" : "#ffffff";
  const textPrimary = isDark ? "#f9fafb" : "#111827";
  const textSecondary = isDark ? "#d1d5db" : "#4b5563";

  return (
    <View style={[styles.card, { backgroundColor: bg }]}>
      <Text style={[styles.title, { color: textSecondary }]}>Now</Text>

      <Text style={[styles.temp, { color: textPrimary }]}>
        {Math.round(current.temperature)}°C
      </Text>

      <Text style={[styles.meta, { color: textSecondary }]}>
        Wind: {Math.round(current.windSpeed)} m/s · Dir:{" "}
        {Math.round(current.windDirection)}°
      </Text>

      <Text style={[styles.time, { color: textSecondary }]}>
        Updated: {current.time.toLocaleString()}
      </Text>

      {/* Cloud icon */}
      <View style={styles.iconContainer}>
          <Text style={styles.icon}>
          {cloudIconFromWeatherCode(current.weatherCode)}
          </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 12,
  },
  title: {
    fontSize: 14,
  },
  temp: {
    fontSize: 40,
    fontWeight: "700",
    marginVertical: 4,
  },
  meta: {
    fontSize: 16,
    marginTop: 8,
  },
  time: {
    fontSize: 12,
    marginTop: 6,
  },
   iconContainer: {
    width: 48,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  icon: {
    fontSize: 48,
    alignContent: "space-evenly",
  },
});
