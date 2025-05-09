import React, { ReactElement } from "react";
import { StyleSheet, Text, ViewProps } from "react-native";
import RipplePressable from "./RipplePressable";
import { Href, router } from "expo-router";
import { ThemeColorName } from "@/src/constants/Theme";
import useTheme from "@/src/hooks/useTheme";

type ButtonProps = Readonly<
  ViewProps & {
    size?: "small" | "large";
    type?: ThemeColorName;
    icon?: ReactElement;
    children?: string;
  } & ({ onPress?: () => void } | { href: Href })
>;

export default function ActionButton(props: ButtonProps) {
  const { parseColor } = useTheme();

  function onPress() {
    if ("href" in props && props.href) {
      router.navigate(props.href);
    } else if ("onPress" in props && props.onPress) {
      props.onPress();
    }
  }

  return (
    <RipplePressable
      {...props}
      style={[
        styles.button,
        props.style,
        {
          backgroundColor: parseColor(props.type),
          paddingInline: props.size === "small" ? 10 : 16,
          paddingBlock: props.size === "small" ? 10 : 14,
        },
      ]}
      rippleColor="#ffffff22"
      onPress={onPress}
    >
      {props.icon &&
        React.cloneElement(props.icon, {
          color: props.children ? "#ffffffbb" : "#ffffff",
          size: props.size === "small" ? 16 : 20,
        })}
      {props.children && (
        <Text
          style={[
            styles.buttonText,
            { fontSize: props.size === "small" ? 15 : 17 },
          ]}
        >
          {props.children}
        </Text>
      )}
    </RipplePressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    gap: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontFamily: "Noto-Sans",
  },
});
