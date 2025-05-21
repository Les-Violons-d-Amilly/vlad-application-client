import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

type BtScore = {
  value: number;
  missed: number;
  clicked: boolean;
};

const DEFAULT_BUTTON_COLOR = "#346eeb";
const BEAT_BUTTON_COLOR = "#f0952e";

const INTERVAL_DURATION = Math.round(1000 / 24);
const BEAT_DURATION = 5;

const bps = [0.5, 1];

export default function () {
  const [bgc, setBgc] = useState([DEFAULT_BUTTON_COLOR, DEFAULT_BUTTON_COLOR]);

  const [btScores, setBtScores] = useState<BtScore[]>(
    new Array(bps.length)
      .fill(null)
      .map(() => ({ value: 0, missed: 0, clicked: false }))
  );

  const buttonIsActive = (indexOrColor: number | string) => {
    return typeof indexOrColor === "string"
      ? indexOrColor
      : bgc[indexOrColor] === BEAT_BUTTON_COLOR;
  };

  useEffect(() => {
    let onCount = new Array(bps.length).fill(0);
    let lastBeat = [...onCount];
    let now = 0;

    const interval = setInterval(() => {
      now += INTERVAL_DURATION;

      for (let i = 0; i < bps.length; i++) {
        let currentBgc = bgc[i];

        const setCurrentBgc = (color: string) => {
          currentBgc = color;

          setBgc((prev) => {
            const newBgc = [...prev];
            newBgc[i] = color;
            return newBgc;
          });

          setBtScores((prev) => {
            const newScores = [...prev];
            newScores[i].clicked = false;
            return newScores;
          });
        };

        if (now - lastBeat[i] >= Math.round(1000 / bps[i])) {
          lastBeat[i] = now;
          setCurrentBgc(BEAT_BUTTON_COLOR);
          onCount[i] = 0;
        }

        if (buttonIsActive(currentBgc)) {
          onCount[i]++;
          if (onCount[i] >= BEAT_DURATION) setCurrentBgc(DEFAULT_BUTTON_COLOR);
        }
      }
    }, INTERVAL_DURATION);

    return () => clearInterval(interval);
  }, []);

  const pressRythm = (index: number) => {
    const newScores = [...btScores];

    if (buttonIsActive(index) && !btScores[index].clicked) {
      newScores[index].value++;
    } else {
      newScores[index].missed++;
    }

    newScores[index].clicked = true;

    setBtScores(newScores);
    console.log(newScores.map((score) => `${score.value} - ${score.missed}`));
  };

  return (
    <React.Fragment>
      <View style={styles.rythmButtonRow}>
        {Array.from({ length: bps.length }, (_, i) => (
          <Pressable
            key={i}
            style={[styles.rythmButton, { backgroundColor: bgc[i] }]}
            onPress={() => pressRythm(i)}
          />
        ))}
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  rythmButtonRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  rythmButton: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
});
