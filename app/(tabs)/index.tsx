// import { Image } from 'expo-image';
// import { Platform, StyleSheet } from 'react-native';

// import { HelloWave } from '@/components/hello-wave';
// import ParallaxScrollView from '@/components/parallax-scroll-view';
// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { Link } from 'expo-router';

/*
import React, { useEffect } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";
import ForecastList from "../../componentsV/ForecastList";
import { useWeatherViewModel } from "../../hooksVM/useWeatherViewModel";

export default function HomeScreen() {
  const vm = useWeatherViewModel();

  useEffect(() => {
   vm.refresh();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "600", textAlign: 'center' }}>Stockholm 7-Day Forecast</Text>


      {vm.loading && <ActivityIndicator size='large'/>}  
      {vm.error && <Text style={{ color: "red" }}>{vm.error}</Text>}
      {!vm.isOnline && <Text style={{ color: "orange" }}>Offline</Text>}

    

      <ForecastList days={vm.days} />
      <Button title="Refresh" onPress={vm.refresh} />
    </View>
  );
}*/
// app/(tabs)/index.tsx OR screens/HomeScreen.tsx

import React, { useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useColorScheme } from "react-native";
import CoordinateModal from "../../componentsV/coordInput";
import CurrentWeatherCard from "../../componentsV/CurrentWeatherCard";
import DailyList from "../../componentsV/DailyList";
import { useWeatherViewModel } from "../../hooksVM/useWeatherViewModel";

export default function HomeScreen() {
  const vm = useWeatherViewModel();
  const isDark = useColorScheme() === "dark";

  const textColor = isDark ? "#f9fafb" : "#111827";
  const borderColor = isDark ? "#374151" : "#d1d5db";

  // Load weather on mount
  useEffect(() => {
    vm.refresh();
  }, []);

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

      {/* Current weather card */}
      {vm.current && (
        <CurrentWeatherCard current={vm.current} />
      )}

      {/* ------- DAILY LIST + HOURLY BREAKDOWN ------- */}
      <View style={{ flex: 1, marginTop: 16 }}>

        {/* Daily list (FlatList) */}
        {vm.daily && (
          <DailyList
            daily={vm.daily}
            onSelectDay={(index) => vm.setSelectedDayIndex(index)}
          />
        )}

      {/* Hourly breakdown */}
      {vm.selectedDayHourly && vm.selectedDayHourly.length > 0 && (
        <>
          {/* Back button */}
        <TouchableOpacity
          style={{ marginBottom: 12 }}
          onPress={() => vm.setSelectedDayIndex(null)}
        >
          <Text style={{ color: "#007AFF", fontSize: 16 }}>← Back to forecast</Text>
        </TouchableOpacity>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Hourly Breakdown
          </Text>

          {vm.selectedDayHourly.map((h, i) => (
            <View key={i} style={[styles.hourRow, { borderColor }]}>
              <Text style={{ color: textColor }}>{h.time.getHours()}:00</Text>
              <Text style={{ color: textColor }}>
                {Math.round(h.temperature)}°C
              </Text>
              <Text style={{ color: textColor }}>{h.precipitation} mm</Text>
            </View>
          ))}
        </>
      )}


      </View>

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


//   return (
//     <ThemedView style={{ flex: 1 }}>
//       <ParallaxScrollView
//         headerImage={require('../../assets/images/weather-header.png')}
//         headerImageStyle={styles.headerImage}
//         title="Welcome to the Weather App"
//       >
//         <View style={styles.titleContainer}>;





// fetch weather data from the view model

// display loading, error, or offline status

// show the list of forecast days

// button to refresh data

// );   
// }
// const styles = StyleSheet.create({
//   titleContainer: {
//     marginBottom: 12,
//   },
//   headerImage: {
//     alignSelf: 'center',
//     marginTop: Platform.select({ ios: 60, default: 30 }),
//     marginBottom: Platform.select({ ios: 20, default: 10 }),
//     opacity: 0.1,
//   },
// });  

//       <ThemedText>This app includes example code to help you get started.</ThemedText> 
//       <HelloWave />
//       <Link href="/(tabs)/explore">
//         <ThemedText type="link">Go to Explore screen</ThemedText>
//       </Link>