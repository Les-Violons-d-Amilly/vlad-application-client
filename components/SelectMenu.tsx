import { Picker } from "@react-native-picker/picker";
import { PickerProps } from "@react-native-picker/picker";
import { StyleSheet } from "react-native";

export default function SelectMenu(props: PickerProps<String>) {
  return (
    <Picker {...props} style={styles.container}>
      {props.children}
    </Picker>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
  },
});
