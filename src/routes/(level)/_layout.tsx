import RipplePressable from "@/src/components/global/RipplePressable";
import { LevelCategoryName } from "@/src/constants/Levels";
import useTheme from "@/src/hooks/useTheme";
import getLevel from "@/src/utils/getLevel";
import { Slot, useGlobalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type SearchParams = {
  category: string;
  level: string;
};

export default function Layout() {
  const [rulesShown, setRulesShown] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const headerRef = useRef<View>(null);

  const params: SearchParams = useGlobalSearchParams();

  const level = getLevel(
    parseInt(params.category) as LevelCategoryName,
    parseInt(params.level)
  );

  const { parseColor } = useTheme();

  const animatedRulesRef = useRef<Animated.View>(null);
  const rulesHeight = useSharedValue(0);
  const animatedValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const style: StyleProp<ViewStyle> = {
      opacity: Math.min(rulesHeight.value, 1),
    };

    if (rulesHeight.value) {
      style.height = withTiming(animatedValue.value * rulesHeight.value, {
        duration: 200,
      });
    }

    return style;
  });

  const measureHeader = () => {
    if (headerHeight) return;

    headerRef.current?.measure((_, __, ___, height) => {
      setHeaderHeight(height);
    });
  };

  const measureRules = () => {
    if (rulesHeight.value) return;

    animatedRulesRef.current?.measure((_, __, ___, height) => {
      rulesHeight.value = height;
    });
  };

  const toggleRules = () => {
    setRulesShown((prev) => !prev);
    animatedValue.value = rulesShown ? 0 : 1;
  };

  if (!level) throw new Error("Level not found");

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: parseColor("backgroundPrimary") },
      ]}
    >
      <View
        style={[
          styles.header,
          { backgroundColor: parseColor("backgroundSecondary") },
        ]}
        ref={headerRef}
        onLayout={measureHeader}
      >
        <Text style={[styles.levelLabel, { color: parseColor("textPrimary") }]}>
          Niveau {level.number}
        </Text>
        <Text
          style={[styles.levelTitle, { color: parseColor("textSecondary") }]}
        >
          {level.title}
        </Text>
        <RipplePressable
          onPress={toggleRules}
          style={{
            marginLeft: "auto",
            backgroundColor: parseColor(rulesShown ? "danger" : "primary"),
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 5,
          }}
          rippleColor="#ffffff22"
        >
          <Text
            style={{
              color: "#ffffffcc",
              fontWeight: "bold",
              fontSize: 12,
            }}
          >
            {rulesShown ? "Masquer les règles" : "Afficher les règles"}
          </Text>
        </RipplePressable>
      </View>
      <Animated.View
        style={[
          animatedStyle,
          {
            overflow: "hidden",
            position: "absolute",
            width: "100%",
            top: headerHeight,
            backgroundColor: parseColor("backgroundSecondary"),
          },
        ]}
        ref={animatedRulesRef}
        onLayout={measureRules}
      >
        <Text
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            color: parseColor("textSecondary"),
            borderTopWidth: 1,
            borderTopColor: parseColor("backgroundTertiary"),
          }}
        >
          {level.rules}
        </Text>
      </Animated.View>
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 10,
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight! + 10,
    flexDirection: "row",
    alignItems: "baseline",
    position: "relative",
  },
  levelLabel: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
    color: "#000",
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});
