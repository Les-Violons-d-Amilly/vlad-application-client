import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { EventProvider as OutsideClickEventProvider } from "react-native-outside-press";

type RootProvidersProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function RootProviders(props: RootProvidersProps) {
  return (
    <OutsideClickEventProvider style={styles.fullScreen}>
      <GestureHandlerRootView style={styles.fullScreen}>
        <View style={props.style}>{props.children}</View>
      </GestureHandlerRootView>
    </OutsideClickEventProvider>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
});
