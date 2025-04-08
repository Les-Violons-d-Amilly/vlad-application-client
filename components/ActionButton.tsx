import { ParsableColor, parseColor } from "@/constants/Colors";
import React, { useCallback } from "react";
import { StyleSheet, Text, ButtonProps as ViewProps } from "react-native";
import RipplePressable from "./RipplePressable";

type ButtonProps = Omit<
  ViewProps & {
    style?: ParsableColor;
    icon?: React.ReactElement;
    label?: string;
    onPress?: () => void;
    onLongPress?: () => void;
  },
  "children" | "title"
>;

export default function ActionButton(props: ButtonProps) {
  const icon = useCallback(() => {
    if (!props.icon) return null;

    return React.cloneElement(props.icon, {
      color: "#ffffff",
    });
  }, []);

  return (
    <RipplePressable
      {...props}
      style={[styles.button, { backgroundColor: parseColor(props.style) }]}
      rippleColor="#ffffff22"
      onPress={props.onPress}
      onLongPress={props.onLongPress}
    >
      {icon()}
      {props.label && <Text style={styles.buttonText}>{props.label}</Text>}
    </RipplePressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    gap: 10,
    padding: 10,
  },
  buttonText: {
    color: "#ffffff",
  },
});
