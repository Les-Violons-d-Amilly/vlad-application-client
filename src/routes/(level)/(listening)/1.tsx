import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Audio } from "expo-av";

const NOTES = ["do", "re", "mi", "fa", "sol", "la", "si"];
const NOTE_SOUNDS: Record<string, any> = {
  do: require("../../../../assets/sounds/do.wav"),
  re: require("../../../../assets/sounds/re.wav"),
  mi: require("../../../../assets/sounds/mi.wav"),
  fa: require("../../../../assets/sounds/fa.wav"),
  sol: require("../../../../assets/sounds/sol.wav"),
  la: require("../../../../assets/sounds/la.wav"),
  si: require("../../../../assets/sounds/si.wav"),
};

export default function NoteRecognitionGame() {
  const handlePress = async (note: string) => {
    const { sound } = await Audio.Sound.createAsync(NOTE_SOUNDS[note]);
    await sound.playAsync();
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        {NOTES.map((note) => (
          <Pressable
            key={note}
            onPress={() => handlePress(note)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{note.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  score: { fontSize: 40, marginBottom: 40 },
  buttons: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  button: {
    backgroundColor: "#8D7D9D",
    margin: 10,
    padding: 20,
    borderRadius: 20,
  },
  buttonText: { color: "#9fbfd9", fontSize: 20 },
});
