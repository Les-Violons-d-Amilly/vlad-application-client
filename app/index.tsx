import Navbar from "@/components/Navbar";
import { View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
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
