import { Ionicons } from "@expo/vector-icons"; // Uncomment if using icons
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


interface CloudIndicatorProps {
    percentCloudCover: number;
    showLabel?: boolean;
}

export default function CloudIndicator({ percentCloudCover, showLabel = false}: CloudIndicatorProps) {
  let iconName: keyof typeof Ionicons.glyphMap = "sunny";

  if (percentCloudCover > 80) iconName = "cloud";
  else if (percentCloudCover > 40) iconName = "partly-sunny";
  else iconName = "sunny";

//     const cloudColor = safePercent < 50
//   ? `rgba(135,206,235,${1 - safePercent / 100})`  // bluish when clear
//   : `rgba(150,150,150,${safePercent / 100})`;      // grayish when cloudy

// const icon = safePercent > 80 ? "cloud" : safePercent > 30 ? "partly-sunny" : "sunny";
// <Ionicons name={icon} size={24} color={cloudColor} />;

    return (
        <View style={styles.container}>
            <Ionicons name={iconName} size={24} color="#888" /> 
            {showLabel && 
            <Text 
            style={styles.label}>{Math.round(percentCloudCover)}%
            </Text>}
        </View>
    );
}

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  label: { fontSize: 12, color: "#666" },
});