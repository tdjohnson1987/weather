import React, { useState } from "react";
import { Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useWeatherViewModel } from "../hooksVM/useWeatherViewModel";

export default function CoordinateModal() {
  const vm = useWeatherViewModel();
  const [visible, setVisible] = useState(false);
  const [latInput, setLatInput] = useState(String(vm.lat));
  const [lonInput, setLonInput] = useState(String(vm.lon));

  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);

  const onSubmit = () => {
    const parsedLat = parseFloat(latInput);
    const parsedLon = parseFloat(lonInput);

    if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
      vm.setLat(parsedLat);
      vm.setLon(parsedLon);
      closeModal(); // ✅ stänger modalen
    } else {
      alert("Please write coordinates");
  }
  };

  return (
    <>
      {/* Floating button */}
      <TouchableOpacity style={styles.fab} onPress={openModal}>
        <Text style={styles.fabText}>📍</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={{ fontSize: 18, marginBottom: 12 }}>Ange nya koordinater</Text>

            <Text>Latitud:</Text>
            <TextInput
              value={latInput}
              onChangeText={setLatInput}
              keyboardType="numeric"
              style={styles.input}
            />

            <Text>Longitud:</Text>
            <TextInput
              value={lonInput}
              onChangeText={setLonInput}
              keyboardType="numeric"
              style={styles.input}
            />

            <Button title="Hämta väder" onPress={onSubmit} />
            <Button title="Avbryt" onPress={closeModal} color="#888" />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    zIndex: 999,
  },
  fabText: {
    fontSize: 24,
    color: "#fff",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 24,
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
});