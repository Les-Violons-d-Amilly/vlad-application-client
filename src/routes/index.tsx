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
import { FlatList } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");

export enum Page {
  Map,
  Account,
  Messages,
}

export type PageProps = {
  setTab: (tab: number) => void;
};

export default function Home() {
  const [currentPage, setCurrentPage] = useState(Page.Account);

  const { parseColor } = useTheme();
  const auth = useAuth();

  const scrollViewAnimatedRef = useAnimatedRef<FlatList>();
  const scrollX = useSharedValue(0);

  function onPageScroll(event: any) {
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offsetX / width);
    setCurrentPage(pageIndex);
  }

  function setTab(index: number) {
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
      <Animated.FlatList
        data={[Map, Account, Messages]}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onPageScroll}
        ref={scrollViewAnimatedRef}
        keyExtractor={(_, index) => index.toString()}
        initialScrollIndex={Page.Account}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item: Page }) => (
          <View children={<Page setTab={setTab} />} style={styles.page} />
        )}
      />
      <Navbar>
        <Navbar.Tab
          icon={<FontAwesome6 name="map-location-dot" />}
          selected={currentPage === Page.Map}
          onPress={() => setTab(Page.Map)}
        />
        <Navbar.Tab
          icon={<UserIcon />}
          selected={currentPage === Page.Account}
          onPress={() => setTab(Page.Account)}
        />
        <Navbar.Tab
          icon={<MaterialCommunityIcons name="assistant" />}
          selected={currentPage === Page.Messages}
          onPress={() => setTab(Page.Messages)}
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
