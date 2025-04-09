import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

export default function Input(props: TextInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        style={[
          props.style,
          styles.input,
          props.secureTextEntry ? styles.password : null, //possible amélioration
        ]}
        placeholder={props.placeholder ?? "Enter your text"}
        secureTextEntry={props.secureTextEntry && !visible}
      />
      {props.secureTextEntry && (
        <Pressable onPress={() => setVisible(!visible)}>
          <FontAwesome
            name={visible ? "eye" : "eye-slash"}
            size={24}
            color="black"
            style={styles.icon}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    margin: 12,
    borderWidth: 0.3,
    padding: 10,
    borderRadius: 5,
  },
  password: {
    flex: 1,
    height: 40,
    margin: 12,
    marginEnd: 0,
    borderWidth: 0.3,
    padding: 10,
    borderRadius: 5,
  },
  icon: {
    padding: 10,
  },
});
