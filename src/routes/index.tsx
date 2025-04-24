import React, { useState } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import Map from "../components/route-specific/home/map";
import Navbar from "@/src/components/global/Navbar";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import Messages from "../components/route-specific/home/messages";
import Animated, {
  scrollTo,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import Account from "../components/route-specific/home/account";
import UserIcon from "../components/global/UserIcon";
import useTheme from "../hooks/useTheme";
import { Redirect } from "expo-router";
import useAuth from "../hooks/useAuth";

const { width } = Dimensions.get("window");

enum Page {
  Map,
  Account,
  Messages,
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState(Page.Map);

  const { parseColor } = useTheme();
  const auth = useAuth();

  const scrollViewAnimatedRef = useAnimatedRef<Animated.ScrollView>();
  const scrollX = useSharedValue(0);

  function onPageScroll(event: any) {
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offsetX / width);
    setCurrentPage(pageIndex);
  }

  function onTabPress(index: number) {
    scrollX.value = index * width;
  }

  useDerivedValue(() => {
    scrollTo(scrollViewAnimatedRef, scrollX.value, 0, true);
  });

  if (!auth.user) return <Redirect href="/authentication" />;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: parseColor("backgroundPrimary") },
      ]}
    >
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onPageScroll}
        ref={scrollViewAnimatedRef}
      >
        <View children={<Map />} style={styles.page} />
        <View children={<Account />} style={styles.page} />
        <View children={<Messages />} style={styles.page} />
      </Animated.ScrollView>
      <Navbar>
        <Navbar.Tab
          icon={<FontAwesome6 name="map-location-dot" />}
          selected={currentPage === Page.Map}
          onPress={() => onTabPress(Page.Map)}
        />
        <Navbar.Tab
          icon={<UserIcon />}
          selected={currentPage === Page.Account}
          onPress={() => onTabPress(Page.Account)}
        />
        <Navbar.Tab
          icon={<MaterialCommunityIcons name="message-processing" />}
          selected={currentPage === Page.Messages}
          onPress={() => onTabPress(Page.Messages)}
        />
      </Navbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    width,
    flex: 1,
  },
});
