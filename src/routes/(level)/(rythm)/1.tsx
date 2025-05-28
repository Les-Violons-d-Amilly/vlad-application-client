import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import useTheme from "@/src/hooks/useTheme";
import { Audio } from "expo-av";
import { lcm } from "mathjs";

const METRONOME = require("../../../../assets/sounds/metronome.wav");

// props
const bps = [1, 1];
const LEVEL_DURATION = 30;

const BEAT_DURATION = 5;

export default function () {
  const { parseColor } = useTheme();
  const [countdown, setCountdown] = useState(3);

  const INTERVAL_DURATION = Math.round(1000 / lcm(bps[0], bps[1]));

  const DEFAULT_BUTTON_COLOR = parseColor("primary");
  const BEAT_BUTTON_COLOR = parseColor("success");

  const [bgc, setBgc] = useState([DEFAULT_BUTTON_COLOR, DEFAULT_BUTTON_COLOR]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let sound: Audio.Sound;

    const polyrythme = async () => {
      let now = 0;
      let beat = 0;

      try {
        sound = (await Audio.Sound.createAsync(METRONOME)).sound;

        interval = setInterval(() => {
          //Level duration
          if (beat >= LEVEL_DURATION + 3) {
            clearInterval(interval);
            return;
          }

          //Metronome
          if (now >= beat * 1000) {
            sound.replayAsync();
            beat++;
            if (countdown > 0) setCountdown(countdown - 1);
          }

          //Game logic
          if (now >= 3000) {
            setBgc([DEFAULT_BUTTON_COLOR, BEAT_BUTTON_COLOR]);
          }

          now += INTERVAL_DURATION;
        }, INTERVAL_DURATION);
      } catch (e) {
        throw new Error("Failed to load sound: ");
      }
    };

    polyrythme();

    return () => {
      if (interval) clearInterval(interval);
      if (sound) sound.unloadAsync();
    };
  }, []);

  return (
    <React.Fragment>
      <View style={styles.pageContent}>
        {countdown > 0 && (
          <View style={styles.countdownView}>
            <Text style={styles.countdown}>{countdown}</Text>
          </View>
        )}
        <View style={styles.scoreView}>
          <Text>1</Text>
          <Text>-</Text>
          <Text>0</Text>
        </View>
        <View style={styles.rythmButtonRow}>
          <Pressable
            style={[styles.rythmButton, { backgroundColor: bgc[0] }]}
          />
          <Pressable
            style={[styles.rythmButton, { backgroundColor: bgc[1] }]}
          />
        </View>
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  pageContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  countdownView: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  countdown: {
    fontSize: 100,
    fontWeight: "bold",
    color: "#000",
  },
  rythmButtonRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  rythmButton: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderBottomWidth: 6,
    borderTopWidth: 2,
    borderLeftWidth: 4,
    borderRightWidth: 4,
  },
  scoreView: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: 20,
  },
});
