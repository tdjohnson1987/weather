
// app/(tabs)/index.tsx OR screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ScrollView, useColorScheme } from "react-native";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";

import CoordinateModal from "../../componentsV/coordInput";
import CurrentWeatherCard from "../../componentsV/CurrentWeatherCard";
import DailyList from "../../componentsV/DailyList";
import { useWeatherViewModel } from "../../hooksVM/useWeatherViewModel";

export default function HomeScreen() {
  const vm = useWeatherViewModel();
  const isDark = useColorScheme() === "dark";

  const textColor = isDark ? "#f9fafb" : "#111827";
  const borderColor = isDark ? "#374151" : "#d1d5db";

  // NEW — this controls the split animation
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Load weather on mount
  useEffect(() => {
    vm.refresh();
  }, []);

  const hourly = vm.selectedDayHourly;


  return (
    <View style={{ flex: 1, paddingTop: 60, paddingHorizontal: 16 }}>

      {/* Title */}
      <Text style={{ fontSize: 22, fontWeight: "600", textAlign: "center", color: textColor }}>
        7-Day Forecast
      </Text>

      {/* Loading Indicator */}
      {vm.loading && (
        <View style={{ marginTop: 16 }}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {/* Error message */}
      {vm.error && (
        <Text style={{ color: "red", marginTop: 8 }}>
          {vm.error}
        </Text>
      )}

      {/* Offline warning */}
      {!vm.isOnline && (
        <Text style={{ color: "orange", marginTop: 8 }}>
          Offline Mode
        </Text>
      )}

      {/* Current weather */}
      {vm.current && <CurrentWeatherCard current={vm.current} />}

      {/* BODY */}
      <Animated.View style={{ flex: 1, marginTop: 16 }} layout={Layout.springify()}>

        {/* DAILY LIST */}
        {vm.daily && expandedIndex === null && (
          <DailyList
            daily={vm.daily}
            onSelectDay={(index) => {
              vm.setSelectedDayIndex(index);  // ditt egna val
              setExpandedIndex(index);        // animationen
            }}
          />
        )}

        {/* EXPANDED HOURLY VIEW */}
        {expandedIndex !== null && hourly && (
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: isDark ? "#1f2937" : "#fff",
              borderRadius: 16,
              padding: 16,
            }}
            entering={FadeIn.duration(250)}
            exiting={FadeOut.duration(200)}
            layout={Layout.springify()}
          >
            <TouchableOpacity
              onPress={() => setExpandedIndex(null)}
              style={{ marginBottom: 12 }}
            >
              <Text style={{ color: "#007AFF", fontSize: 16 }}>← Back</Text>
            </TouchableOpacity>

            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Hourly Breakdown
            </Text>

            {/* 👇 Här använder vi ScrollView */}
            <ScrollView style={{ flex: 1 }}>
              {hourly.map((h, i) => (
                <View key={i} style={[styles.hourRow, { borderColor }]}>
                  <Text style={{ color: textColor }}>{h.time.getHours()}:00</Text>
                  <Text style={{ color: textColor }}>{Math.round(h.temperature)}°C</Text>
                  <Text style={{ color: textColor }}>{h.precipitation} mm</Text>
                </View>
              ))}
            </ScrollView>
          </Animated.View>
        )}

      </Animated.View>

      {/* Floating coordinate modal */}
      <CoordinateModal />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 8,
  },
  hourRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
});
