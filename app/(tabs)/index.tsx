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
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import CoordinateModal from "../../componentsV/coordInput";
import ForecastList from "../../componentsV/ForecastList";
import { useWeatherViewModel } from "../../hooksVM/useWeatherViewModel";

export default function HomeScreen() {
  const vm = useWeatherViewModel();

  useEffect(() => { vm.refresh(); }, []);

  return (
    <View style={{ flex: 1, padding: 16, paddingTop: 60, position: "relative" }}>

      <Text style={{ fontSize: 22, fontWeight: "600", textAlign: 'center' }}>
        7-Day Forecast
      </Text>

      {vm.loading && <ActivityIndicator size='large'/>}  
      {vm.error && <Text style={{ color: "red" }}>{vm.error}</Text>}
      {!vm.isOnline && <Text style={{ color: "orange" }}>Offline</Text>}

      <ForecastList days={vm.days} /> 

      {/* Floating button + modal */}
      <CoordinateModal />
    </View>
  );
}


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