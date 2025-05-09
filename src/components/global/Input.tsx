import useTheme from "@/src/hooks/useTheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import OutsidePressHandler from "react-native-outside-press";

type ValidationFunctionOutput = [boolean, string | null];

type ValidationFunction = (
  value: string
) => ValidationFunctionOutput | Promise<ValidationFunctionOutput>;

type InputProps = Readonly<
  TextInputProps & {
    label?: string;
    regex?: RegExp;
    needsNumber?: boolean;
    needsUppercase?: boolean;
    needsLowercase?: boolean;
    needsSpecial?: boolean;
    minLength?: number;
    validationFunction?: ValidationFunction;
  }
>;

export default forwardRef<TextInput, InputProps>(function Input(props, ref) {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<string>(props.value ?? "");

  const inputRef = useRef<TextInput>(null);

  const { parseColor } = useTheme();

  const blur = () => {
    if (!inputRef.current) return;
    inputRef.current.blur();
  };

  const changeValue = (value: string) => {
    setValue(value);

    if (props.onChangeText) {
      props.onChangeText(value);
    }
  };

  useImperativeHandle(ref, () => inputRef.current!, [inputRef]);

  const validate = async () => {
    if (props.needsNumber && !/\d/.test(value)) {
      setError("La valeur de ce champ doit contenir au moins un chiffre");
      return false;
    }

    if (props.needsUppercase && !/[A-Z]/.test(value)) {
      setError("La valeur de ce champ doit contenir au moins une majuscule");
      return false;
    }

    if (props.needsLowercase && !/[a-z]/.test(value)) {
      setError("La valeur de ce champ doit contenir au moins une minuscule");
      return false;
    }

    if (props.needsSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      setError(
        "La valeur de ce champ doit contenir au moins un caractère spécial"
      );
      return false;
    }

    if (props.minLength && value.length < props.minLength) {
      setError(
        `La valeur de ce champ doit contenir au moins ${props.minLength} caractères`
      );
      return false;
    }

    if (props.regex && !props.regex.test(value)) {
      setError("La valeur de ce champ ne correspond pas au format requis");
      return false;
    }

    if (props.validationFunction) {
      const [isValid, error] = await props.validationFunction(value);

      if (!isValid) {
        setError(error ?? "La valeur de ce champ est invalide");
        return false;
      }
    }

    setError(null);
    return true;
  };

  return (
    <OutsidePressHandler onOutsidePress={blur}>
      {props.label && (
        <Text
          style={[styles.fieldLabel, { color: parseColor("textSecondary") }]}
        >
          {props.label}
        </Text>
      )}
      <View
        style={[
          styles.field,
          { borderColor: error ? "#dc3545" : parseColor("border") },
        ]}
      >
        <TextInput
          {...props}
          style={[
            props.style,
            { color: parseColor("textPrimary") },
            styles.input,
          ]}
          secureTextEntry={props.secureTextEntry && !visible}
          spellCheck={!props.secureTextEntry}
          autoCorrect={!props.secureTextEntry}
          onChangeText={changeValue}
          value={value}
          onBlur={validate}
          ref={inputRef}
        />
        {props.secureTextEntry && (
          <Pressable onPress={() => setVisible(!visible)}>
            <MaterialCommunityIcons
              name={visible ? "eye" : "eye-off"}
              size={18}
              color={parseColor("textSecondary")}
              style={styles.icon}
            />
          </Pressable>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </OutsidePressHandler>
  );
});

const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    paddingLeft: 14,
    paddingBlock: 12,
    fontSize: 16,
    textAlign: "left",
    textAlignVertical: "center",
  },
  icon: {
    marginRight: 14,
  },
  error: {
    color: "#dc3545",
    fontSize: 14,
    margin: 5,
    lineHeight: 20,
  },
  fieldLabel: {
    fontSize: 15,
    marginBottom: 5,
    marginLeft: 5,
  },
});
