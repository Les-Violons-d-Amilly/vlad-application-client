import { Href, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type NavbarProps = {
  children: React.ReactElement[];
};

type TabProps = {
  icon: React.ReactElement;
  label: string;
  href?: Href;
};

function Navbar(props: NavbarProps) {
  return (
    <View style={styles.row}>
      {props.children?.map((child, index) =>
        React.cloneElement(child, { key: index })
      )}
    </View>
  );
}

Navbar.Tab = function (props: TabProps) {
  const router = useRouter();

  const icon = useCallback(() => {
    // Adding style to the icon
    return React.cloneElement(props.icon, {
      size: 24,
      color: "#666",
    });
  }, [props.icon]);

  const onPress = () => {
    if (!props.href) return;
    // Redirect to the href when the tab is pressed
    router.navigate(props.href);
    console.log("Navigating to:", props.href);
  };

  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      {icon()}
      <Text style={styles.label}>{props.label}</Text>
    </Pressable>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 68,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  pressable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    gap: 4,
  },
  label: {
    color: "#222",
    fontSize: 14,
  },
});
