import { Level } from "@/src/constants/Levels";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import OutsidePressHandler from "react-native-outside-press";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ActionButton from "../../global/ActionButton";
import { MaterialIcons } from "@expo/vector-icons";
import { Note } from "./note";
import { darken } from "@/src/utils/colors";
import useTheme from "@/src/hooks/useTheme";

type LevelModalProps = Readonly<{
  level: Level | null;
  closeModal: () => void;
}>;

const ANIMATION_DURATION = 200;

const { width } = Dimensions.get("window");

export default function LevelModal(props: LevelModalProps) {
  const [level, setLevel] = useState<Level | null>(props.level);

  const { parseColor } = useTheme();

  const animatedValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedValue.value,
      transform: [
        { translateY: animatedValue.value * 150 - 150 },
        { scale: animatedValue.value * 0.2 + 0.8 },
      ],
    };
  });

  function setVisible(value: boolean) {
    animatedValue.value = withTiming(value ? 1 : 0, {
      duration: ANIMATION_DURATION,
    });
  }

  useEffect(() => {
    if (!!props.level) setLevel(props.level);

    setVisible(!!props.level);

    if (!props.level) {
      setTimeout(() => setLevel(null), ANIMATION_DURATION);
    }
  }, [props.level]);

  if (!level) {
    return null;
  }

  return (
    <Animated.View style={[styles.animatedContainer, animatedStyle]}>
      <OutsidePressHandler
        onOutsidePress={props.closeModal}
        style={[
          styles.container,
          { backgroundColor: parseColor("backgroundPrimary") },
        ]}
      >
        <Text style={[styles.levelTitle, { color: parseColor("textPrimary") }]}>
          Niveau {level.key + 1}
        </Text>
        <Text
          style={[styles.levelSubtitle, { color: parseColor("textSecondary") }]}
        >
          {level.title}
        </Text>
        <View style={styles.note}>
          {Array.from({ length: 3 }, (_, i) => {
            return (
              <Note
                key={i}
                size={16}
                color={
                  i < level.stars
                    ? "#f5ce62"
                    : darken(parseColor("backgroundPrimary"), 5)
                }
              />
            );
          })}
        </View>
        <Text
          style={[styles.description, { color: parseColor("textTertiary") }]}
        >
          {level.description}
        </Text>
        <View style={styles.buttonRow}>
          <ActionButton
            onPress={props.closeModal}
            type="secondary"
            icon={<MaterialIcons name="close" />}
            style={styles.closeButton}
          />
          <ActionButton
            href={level.href}
            type="primary"
            icon={
              level.stars > 0 ? (
                <MaterialIcons name="refresh" />
              ) : (
                <MaterialIcons name="play-arrow" />
              )
            }
            style={styles.playButton}
          >
            {level.stars > 0 ? "Rejouer" : "Jouer"}
          </ActionButton>
        </View>
      </OutsidePressHandler>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    position: "absolute",
    height: width - 50,
    width: width - 50,
    top: "50%",
    left: "50%",
    transform: [
      { translateX: -((width - 50) / 2) },
      { translateY: -((width - 50) / 2) },
    ],
    zIndex: 999,
    borderRadius: 25,
    padding: 15,
    borderColor: "#202021",
    borderWidth: 6,
    borderTopWidth: 4,
    borderBottomWidth: 8,
  },
  levelTitle: {
    fontSize: 30,
    color: "#333333",
    fontFamily: "Archivo-Black",
    textAlign: "center",
  },
  levelSubtitle: {
    fontSize: 18,
    color: "#888888",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 20,
    fontStyle: "italic",
  },
  description: {
    fontSize: 14,
    color: "#555555",
    fontFamily: "Noto-Sans",
    textAlign: "center",
    marginBlock: "auto",
    lineHeight: 25,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: "auto",
    gap: 15,
  },
  playButton: {
    flex: 0.85,
  },
  closeButton: {
    flex: 0.15,
  },
  note: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 15,
  },
});
