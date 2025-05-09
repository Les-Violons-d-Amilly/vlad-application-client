import { Href, usePathname, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import RipplePressable from "./RipplePressable";
import useTheme from "@/src/hooks/useTheme";

type NavbarProps = Readonly<{
  children: React.ReactElement | React.ReactElement[];
}>;

type TabProps = Readonly<
  {
    icon: React.ReactElement;
    label?: string;
  } & ({ href?: Href } | { onPress?: () => void; selected?: boolean })
>;

function Navbar(props: NavbarProps) {
  const { parseColor } = useTheme();

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: parseColor("backgroundPrimary"),
          borderTopColor: parseColor("backgroundSecondary"),
        },
      ]}
    >
      {(Array.isArray(props.children) ? props.children : [props.children])?.map(
        (child, index) => React.cloneElement(child, { key: index })
      )}
    </View>
  );
}

Navbar.Tab = function (props: TabProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { parseColor } = useTheme();

  const isSelected = () => {
    return (
      ("href" in props && pathname === props.href) ||
      ("selected" in props && props.selected)
    );
  };

  const onPress = () => {
    if ("onPress" in props && props.onPress) props.onPress();
    if ("href" in props && props.href) router.navigate(props.href);
  };

  return (
    <RipplePressable
      onPress={onPress}
      style={styles.pressable}
      rippleColor="#3372d633"
    >
      {React.cloneElement(props.icon, {
        size: props.label ? 24 : 28,
        color: isSelected()
          ? parseColor("primary")
          : parseColor("textTertiary"),
      })}
      {props.label && (
        <Text
          style={[
            styles.label,
            isSelected() && { color: parseColor("primary") },
          ]}
        >
          {props.label}
        </Text>
      )}
    </RipplePressable>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 62,
    backgroundColor: "#fff",
    marginTop: "auto",
    borderTopWidth: 1,
  },
  pressable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    gap: 2,
  },
  label: {
    color: "#666666",
    fontSize: 16,
    fontFamily: "Noto-Sans",
  },
});
