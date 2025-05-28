import { LevelCategoryName } from "@/src/constants/Levels";
import useTheme from "@/src/hooks/useTheme";
import { getCourse } from "@/src/utils/getStep";
import { useGlobalSearchParams } from "expo-router";
import { StatusBar, StyleSheet, Text, View } from "react-native";

type SearchParams = {
  category: string;
  step: string;
};

export default function Layout() {
  const params: SearchParams = useGlobalSearchParams();

  const course = getCourse(
    parseInt(params.category) as LevelCategoryName,
    parseInt(params.step)
  );

  const { parseColor } = useTheme();

  if (!course) throw new Error("Course not found");

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: parseColor("backgroundPrimary") },
      ]}
    >
      <View
        style={[
          styles.header,
          { backgroundColor: parseColor("backgroundSecondary") },
        ]}
      >
        <Text style={[styles.levelLabel, { color: parseColor("textPrimary") }]}>
          Cours #{course.number}
        </Text>
        <Text
          style={[styles.levelTitle, { color: parseColor("textSecondary") }]}
        >
          {course.title}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 10,
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight! + 10,
    flexDirection: "row",
    alignItems: "baseline",
    position: "relative",
  },
  levelLabel: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
    color: "#000",
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});
