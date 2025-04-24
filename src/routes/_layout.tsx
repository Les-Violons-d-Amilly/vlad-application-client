import { StyleSheet } from "react-native";
import RootProviders from "../components/route-specific/rootProviders";
import { Slot, useGlobalSearchParams, usePathname } from "expo-router";
import { useEffect } from "react";
import { AuthProvider } from "../hooks/useAuth";

export default function RootLayout() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();

  useEffect(() => {
    console.log("New Navigation:", pathname, params);
  }, [params, pathname]);

  return (
    <RootProviders style={styles.root}>
      <Slot />
    </RootProviders>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
