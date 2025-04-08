import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { AppMode, getAppMode } from "@/utils/getAppMode";
import Navbar from "@/components/Navbar";
import { FontAwesome } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{ headerShown: false }}
        initialRouteName={getAppMode()}
      >
        <Stack.Screen name="student" />
        <Stack.Screen name="teacher" />
      </Stack>
      <Navbar>
        <Navbar.Tab
          icon={<FontAwesome name="user" />}
          label="Student"
          href="/student"
        />
        <Navbar.Tab
          icon={<FontAwesome name="user-secret" />}
          label="Teacher"
          href="/teacher"
        />
      </Navbar>
    </GestureHandlerRootView>
  );
}
