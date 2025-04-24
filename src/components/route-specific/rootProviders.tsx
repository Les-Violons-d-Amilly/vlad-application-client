import React, { ReactNode, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleProp,
  StyleSheet,
  useColorScheme,
  View,
  ViewStyle,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { EventProvider as OutsideClickEventProvider } from "react-native-outside-press";
import useAuth, { AuthProvider } from "@/src/hooks/useAuth";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { ThemeProvider } from "@/src/hooks/useTheme";

type RootProvidersProps = Readonly<{
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}>;

SplashScreen.preventAutoHideAsync();

function ComponentLogic(props: RootProvidersProps) {
  const [fontLoaded, error] = useFonts({
    "Noto-Sans": require("@/assets/fonts/NotoSans.ttf"),
    "Archivo-Black": require("@/assets/fonts/ArchivoBlack.ttf"),
  });

  const { ready } = useAuth();
  const loaded = !!((fontLoaded || error) && ready);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [fontLoaded, error, ready]);

  if (!loaded) return null;

  return <View {...props} />;
}

export default function RootProviders(props: RootProvidersProps) {
  const statusBarStyle = useColorScheme() === "dark" ? "light" : "dark";

  return (
    <React.Fragment>
      <StatusBar style={statusBarStyle} />
      <AuthProvider>
        <ThemeProvider>
          <GestureHandlerRootView style={styles.fullScreen}>
            <OutsideClickEventProvider style={styles.fullScreen}>
              <ComponentLogic {...props} />
            </OutsideClickEventProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </AuthProvider>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
});
