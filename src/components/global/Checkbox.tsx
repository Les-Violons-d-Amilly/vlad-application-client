import useTheme from "@/src/hooks/useTheme";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type CheckboxProps = Readonly<{
  onChange?: (checked: boolean) => void;
  checked?: boolean;
  children: React.ReactNode | string;
  style?: StyleProp<ViewStyle>;
}>;

export default function Checkbox(props: CheckboxProps) {
  const [checked, setChecked] = useState(props.checked ?? false);

  const { parseColor } = useTheme();

  const rippleAnimation = useSharedValue(0);

  function toggleChecked() {
    setChecked(!checked);
    props.onChange?.(!checked);
  }

  const gesture = Gesture.Tap()
    .onBegin(() => {
      rippleAnimation.value = 0;
      rippleAnimation.value = withTiming(1, {
        duration: 200,
      });
    })
    .onEnd(() => {
      runOnJS(toggleChecked)();
      rippleAnimation.value = withTiming(0);
    })
    .onFinalize(() => {
      rippleAnimation.value = withTiming(0);
    });

  const rippleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: rippleAnimation.value * 1.5 }],
      opacity: rippleAnimation.value * 0.2,
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <View style={[styles.checkboxContainer, props.style]}>
        <MaterialIcons
          name={checked ? "check-box" : "check-box-outline-blank"}
          size={24}
          color={checked ? parseColor("primary") : "#666666"}
        />
        <Animated.View
          style={[
            styles.ripple,
            rippleAnimatedStyle,
            { backgroundColor: parseColor("primary") },
          ]}
        />
        <View style={styles.labelContainer}>
          {typeof props.children === "string" ? (
            <Text style={styles.label}>{props.children}</Text>
          ) : (
            props.children
          )}
        </View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  labelContainer: {
    flexDirection: "row",
  },
  label: {
    fontSize: 16,
    color: "#333333",
  },
  ripple: {
    position: "absolute",
    height: 24,
    width: 24,
    borderRadius: 12,
    opacity: 0.2,
  },
});
