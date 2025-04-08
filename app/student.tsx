import { StatusBar, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
      <Text>Student</Text>
    </View>
  );
}
