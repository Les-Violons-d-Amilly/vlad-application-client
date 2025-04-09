import { StatusBar } from "expo-status-bar";
import { StatusBar as StatusBarRN, StyleSheet } from "react-native";
import Selector from "@/components/Selector";
import { FontAwesome } from "@expo/vector-icons";
import RootProviders from "./_rootProviders";

export default function RootLayout() {
  return (
    <RootProviders style={styles.root}>
      <StatusBar style="dark" />
      <Selector
        items={[
          {
            label: "Item 1",
            value: "item1",
            icon: <FontAwesome name="home" />,
          },
          {
            label: "Item 2",
            value: "item2",
            icon: <FontAwesome name="user" />,
          },
          {
            label: "Item 3",
            value: "item3",
            icon: <FontAwesome name="cog" />,
          },
        ]}
      />
    </RootProviders>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: 10,
    paddingTop: StatusBarRN.currentHeight! + 10,
  },
});
