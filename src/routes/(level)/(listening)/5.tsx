import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Audio } from "expo-av";

const NOTES = ["fa", "sol", "la"];
const NOTE_SOUNDS: Record<string, any> = {
  fa: require("../../../../assets/sounds/fa.wav"),
  sol: require("../../../../assets/sounds/sol.wav"),
  la: require("../../../../assets/sounds/la.wav"),
};

export default function NoteRecognitionGame() {
  const [targetNote, setTargetNote] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [testNumbers, setTestNumbers] = useState(10);
  const playRandomNote = async () => {
    const random = NOTES[Math.floor(Math.random() * NOTES.length)];
    setTargetNote(random);

    const { sound } = await Audio.Sound.createAsync(NOTE_SOUNDS[random]);
    await sound.playAsync();
  };

  const replayNote = async () => {
    if (targetNote) {
      const { sound } = await Audio.Sound.createAsync(NOTE_SOUNDS[targetNote]);
      await sound.playAsync();
    }
  };

  const handlePress = (note: string) => {
    if (note === targetNote) {
      setScore(score + 1);
    }
    if (testNumbers <= 1) {
      alert("Résultat : " + score);
      return;
    }
    setTestNumbers(testNumbers - 1);
    playRandomNote();
  };

  useEffect(() => {
    playRandomNote();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score : {score}</Text>
      <View style={styles.button}>
        <Pressable onPress={replayNote}>
          <Text style={styles.buttonText}>réécouter</Text>
        </Pressable>
      </View>
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
