import { Ionicons } from "@expo/vector-icons"; // Uncomment if using icons
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


interface CloudIndicatorProps {
    percentCloudCover: number;
    showLabel?: boolean;
}

export default function CloudIndicator({ percentCloudCover, showLabel = false}: CloudIndicatorProps) {
  
  const safePercent = Math.min(100, Math.max(0, percentCloudCover));

  // välj ikon baserat på molntäcket
  let iconName: keyof typeof Ionicons.glyphMap = "sunny";
  if (safePercent > 80) iconName = "cloud";
  else if (safePercent > 40) iconName = "partly-sunny";
  else iconName = "sunny";

  // välj färg baserat på procent molnighet
  const cloudColor =
    safePercent < 50
      ? `rgba(135,206,235,${1 - safePercent / 100})` // ljusblå när det är klart
      : `rgba(150,150,150,${safePercent / 100})`;    // gråare när det är molnigt

  return (
        <View style={styles.container}>
            <Ionicons name={iconName} size={24} color={cloudColor} /> 
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