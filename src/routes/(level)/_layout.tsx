import { LevelCategoryName } from "@/src/constants/Levels";
import getLevel from "@/src/utils/getLevel";
import { Slot, useGlobalSearchParams } from "expo-router";
import React from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";

type SearchParams = {
  category: string;
  level: string;
};

export default function Layout() {
  const params: SearchParams = useGlobalSearchParams();

  const level = getLevel(
    parseInt(params.category) as LevelCategoryName,
    parseInt(params.level)
  );

  if (!level) {
    return <Text>Level not found</Text>;
  }

  return (
    <React.Fragment>
      <View style={styles.header}>
        <Text>Niveau {level.key + 1}</Text>
        <Text>{level.title}</Text>
      </View>
      <Slot />
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: StatusBar.currentHeight,
  },
});
