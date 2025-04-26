import { StatusBar, Text, View } from "react-native";

export default function Messages() {
  return (
    <View>
      <View style={{ paddingTop: StatusBar.currentHeight }}>
        <Text>Conversations</Text>
      </View>
    </View>
  );
}
