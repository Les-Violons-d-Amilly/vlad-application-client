import { Href, usePathname, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import RipplePressable from "./RipplePressable";

type NavbarProps = {
  children: React.ReactElement[];
};

type TabProps = {
  icon: React.ReactElement;
  label?: string;
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
  const pathname = usePathname();

  const icon = useCallback(() => {
    // Adding style to the icon
    return React.cloneElement(props.icon, {
      size: props.label ? 24 : 32,
      color: pathname === props.href ? "#3372d6" : "#666666",
    });
  }, [props.icon, props.label, props.href, pathname]);

  const onPress = () => {
    if (!props.href) return;
    // Redirect to the href when the tab is pressed
    router.navigate(props.href);
    console.log("Navigating to:", props.href);
  };

  return (
    <RipplePressable
      onPress={onPress}
      style={styles.pressable}
      rippleColor="#3372d622"
    >
      {icon()}
      {props.label && (
        <Text
          style={[
            styles.label,
            pathname === props.href && { color: "#3372d6" },
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
    height: 68,
    backgroundColor: "#fff",
    marginTop: "auto",
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
    fontSize: 14,
  },
});
