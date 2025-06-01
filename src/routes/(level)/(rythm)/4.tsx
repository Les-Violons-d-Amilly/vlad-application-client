import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import useTheme from "@/src/hooks/useTheme";
import { Audio } from "expo-av";
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from "react-native-gesture-handler";
import ActionButton from "@/src/components/global/ActionButton";

function gcd(a: number, b: number) {
  for (let temp = b; b !== 0; ) {
    b = a % b;
    a = temp;
    temp = b;
  }

  return a;
}

function lcm(a: number, b: number) {
  const gcdValue = gcd(a, b);
  return (a * b) / gcdValue;
}

type Drum = {
  correct: number;
  missed: number;
  on: boolean;
  clicked: boolean;
};

const METRONOME = require("../../../../assets/sounds/metronome.wav");

const DRUMS: Drum[] = new Array(2)
  .fill(null)
  .map(() => ({ correct: 0, missed: 0, on: false, clicked: false }));

// props
const bps = [2, 2];
const LEVEL_DURATION = 30;

const BEAT_DURATION = 5;

let miss = 0;
let correct = 0;

export default function () {
  const { parseColor } = useTheme();
  const [information, setInformation] = useState("4");
  const [endGame, setEndGame] = useState(false);

  const lcmValue = lcm(bps[0], bps[1]) * 2;

  const INTERVAL_DURATION = Math.round(1000 / lcmValue);

  const DEFAULT_BUTTON_COLOR = parseColor("primary");
  const BEAT_BUTTON_COLOR = parseColor("success");

  const [bgc, setBgc] = useState([DEFAULT_BUTTON_COLOR, DEFAULT_BUTTON_COLOR]);

  const changeBgc = () => {
    setBgc([
      DRUMS[0].on ? BEAT_BUTTON_COLOR : DEFAULT_BUTTON_COLOR,
      DRUMS[1].on ? BEAT_BUTTON_COLOR : DEFAULT_BUTTON_COLOR,
    ]);
  };

  const scoreHandler = (i: number) => {
    if (DRUMS[i].on) {
      if (DRUMS[(i + 1) % 2].on) {
        if (DRUMS[i].clicked && DRUMS[(i + 1) % 2].clicked) {
          correct++;
          DRUMS[i].clicked = false;
          DRUMS[(i + 1) % 2].clicked = false;
          setInformation("Parfait !");
        } else {
          miss++;
          setInformation("Raté !");
        }
        DRUMS[i].on = false;
        DRUMS[(i + 1) % 2].on = false;
      } else {
        if (DRUMS[i].clicked) {
          correct++;
          DRUMS[i].clicked = false;
          setInformation("Parfait !");
        } else {
          miss++;
          setInformation("Raté !");
        }
        DRUMS[i].on = false;
      }
    } else {
      if (DRUMS[i].clicked) {
        miss++;
        setInformation("Trop rapide !");
        DRUMS[i].clicked = false;
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let sound: Audio.Sound;

    const polyrythme = async () => {
      let now = 0;
      let beat = 0;
      let count = 0;
      let newCountdown = parseInt(information);

      try {
        sound = (await Audio.Sound.createAsync(METRONOME)).sound;

        interval = setInterval(() => {
          //Level duration
          if (beat >= LEVEL_DURATION + 4) {
            setInformation("Terminé !");
            clearInterval(interval);
            setEndGame(true);
            return;
          }

          //Metronome
          if (now >= beat * 1000) {
            sound.replayAsync();
            beat++;
            if (newCountdown > 0) {
              newCountdown--;
              setInformation(newCountdown.toString());
              if (newCountdown === 0) {
                setInformation("C'est parti !");
              }
            }
          }

          //Game logic
          if (now >= 3000) {
            for (let i = 0; i < 2; i++) {
              scoreHandler(i);

              if (count % (lcmValue / bps[i]) == 0) {
                DRUMS[i].on = true;
              } else {
                DRUMS[i].on = false;
              }
              changeBgc();
            }
            count++;
            if (count >= lcmValue) count = 0;
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

  const activeGame = (
    <GestureHandlerRootView style={styles.pageContent}>
      <View style={styles.informationView}>
        <Text style={styles.information}>{information}</Text>
      </View>
      <View style={styles.rythmButtonRow}>
        <TapGestureHandler onBegan={() => (DRUMS[0].clicked = true)}>
          <Pressable style={[styles.rythmButton, { backgroundColor: bgc[0] }]}>
            <Text style={styles.rythmButtonText}>{bps[0]}</Text>
          </Pressable>
        </TapGestureHandler>
        <TapGestureHandler onBegan={() => (DRUMS[1].clicked = true)}>
          <Pressable style={[styles.rythmButton, { backgroundColor: bgc[1] }]}>
            <Text style={styles.rythmButtonText}>{bps[1]}</Text>
          </Pressable>
        </TapGestureHandler>
      </View>
    </GestureHandlerRootView>
  );

  const endPage = (
    <View>
      <View>
        <Text style={styles.information}>réussie : {correct}</Text>
        <Text style={styles.information}>erreurs : {miss}</Text>
        <ActionButton size="large" href={"/"}>
          Retour au menu
        </ActionButton>
      </View>
    </View>
  );

  return <React.Fragment>{endGame ? endPage : activeGame}</React.Fragment>;
}

const styles = StyleSheet.create({
  pageContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 60,
  },
  informationView: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  information: {
    fontSize: 60,
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  rythmButtonText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  scoreView: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: 20,
  },
});
