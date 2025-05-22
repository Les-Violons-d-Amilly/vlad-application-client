import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function () {
  return (
    <React.Fragment>
      <View style={styles.pageContent}>
        <Pressable>
          <Text>Bonjour</Text>
        </Pressable>
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  pageContent: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
