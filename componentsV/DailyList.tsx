import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { cloudIconFromWeatherCode } from "../constants/weatherIcons";
import { ForecastDaily } from "../dataM/WeatherModels";

interface DailyListProps {
  daily: ForecastDaily[];
  onSelectDay: (index: number) => void;
}

export default function DailyList({ daily, onSelectDay }: DailyListProps) {
  return (
    <FlatList
      data={daily}
      keyExtractor={(_, i) => i.toString()}
      contentContainerStyle={{ paddingBottom: 12 }}
      renderItem={({ item, index }) => (
        <TouchableOpacity onPress={() => onSelectDay(index)}>
          <View style={styles.row}>

            {/* Left side – Date */}
            <View style={{ flex: 1 }}>
              <Text style={styles.day}>
                {item.time.toLocaleDateString("en-GB", {
                  weekday: "short",
                })}
              </Text>
              <Text style={styles.date}>
                {item.time.toLocaleDateString("en-GB", {
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </View>

            {/* Cloud icon */}
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>
                {cloudIconFromWeatherCode(item.weatherCode)}
              </Text>
            </View>

            {/* Temperature */}
            <Text style={styles.temp}>
              {Math.round(item.tempMax ?? 0)}°
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 10,

    // Light shadow
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },

  day: { fontSize: 16, fontWeight: "600" },
  date: { fontSize: 13, color: "#777" },

  iconContainer: {
    width: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 28,
  },

  temp: {
    fontSize: 20,
    fontWeight: "700",
    width: 60,
    textAlign: "right",
    color: "#333",
  },
});
