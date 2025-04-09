import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StatusBar as StatusBarRN } from "react-native";
import Selector from "@/components/Selector";
import { FontAwesome } from "@expo/vector-icons";
import { EventProvider as OutsideClickEventProvider } from "react-native-outside-press";

export default function RootLayout() {
  return (
    <OutsideClickEventProvider style={{ flex: 1 }}>
      <GestureHandlerRootView
        style={{
          flex: 1,
          padding: 10,
          paddingTop: StatusBarRN.currentHeight! + 10,
        }}
      >
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
      </GestureHandlerRootView>
    </OutsideClickEventProvider>
  );
}
