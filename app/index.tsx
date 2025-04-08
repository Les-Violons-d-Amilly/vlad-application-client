import Navbar from "@/components/Navbar";
import { StatusBar, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import ActionButton from "@/components/ActionButton";

export default function Index() {
  return (
    <View style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
      <ActionButton
        label="Attendre"
        icon={<FontAwesome name="hourglass" />}
        style="secondary"
      />
      <Navbar>
        <Navbar.Tab icon={<FontAwesome name="home" />} label="Home" href="/" />
        <Navbar.Tab
          icon={<FontAwesome name="gamepad" />}
          label="Game"
          href="/_sitemap"
        />
      </Navbar>
    </View>
  );
}
