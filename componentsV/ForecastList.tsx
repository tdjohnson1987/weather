import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { ForecastDay } from "../dataM/WeatherParser";
import CloudIndicator from "./CloudIndicator";

interface ForecastListProps {
  days: ForecastDay[];
}

export default function ForecastList({ days }: ForecastListProps) {
  if (!days || days.length === 0) { // no data available
        return (
          <View style={styles.empty}>
            <Text>No forecast data available.</Text>
          </View>
      );
    }

  return (
         <FlatList // list of forecast days
           data={days}
           keyExtractor={(item) => item.date}
           showsVerticalScrollIndicator ={false}
           contentContainerStyle={styles.list}
           renderItem={({ item }) => {
            const date = new Date(item.date);
            const dayName = date.toLocaleDateString("en-GB", { weekday: 'short' });
            const dayMonth = date.toLocaleDateString("en-GB", { month: 'short', day: 'numeric' });
            return (
             <View style={styles.row}>
            {/* Day + date */}
            <View style={{ flex: 1 }}>
              <Text style={styles.day}>{dayName}</Text>
              <Text style={styles.date}>{dayMonth}</Text>
            </View>

            {/* Cloud indicator */}
            <CloudIndicator percentCloudCover={item.cloudCover} showLabel />
            
            {/* Temperature */}
            <Text style={styles.temp}>{Math.round(item.temperature)}°C</Text>
          </View>
        );
      }}
    />
  );
}
     const styles = StyleSheet.create({

  list: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  day: {
    fontWeight: "600",
    fontSize: 16,
  },
  date: {
    color: "#666",
    fontSize: 13,
  },
  temp: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    width: 60,
    textAlign: "right",
  },
  empty: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    color: "#888",
  },
});