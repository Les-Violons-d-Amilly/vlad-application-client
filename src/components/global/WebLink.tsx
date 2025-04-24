import useTheme from "@/src/hooks/useTheme";
import { FontAwesome } from "@expo/vector-icons";
import { Linking, Pressable, StyleSheet, Text, TextProps } from "react-native";

type WebLinkProps = Readonly<
  TextProps & {
    url: string;
    children?: string;
    hideIcon?: boolean;
  }
>;

export default function WebLink(props: WebLinkProps) {
  const { parseColor } = useTheme();

  function openLink() {
    if (props.url) {
      // Open the URL in the default browser
      Linking.openURL(props.url).catch((err) =>
        console.error("Failed to open URL:", err)
      );
    }
  }

  return (
    <Pressable onPress={openLink} style={styles.link}>
      {!props.hideIcon && (
        <FontAwesome
          name="external-link"
          size={16}
          color={parseColor("primary")}
          style={styles.icon}
        />
      )}
      <Text
        {...props}
        style={[styles.linkText, props.style, { color: parseColor("primary") }]}
      >
        {props.children ?? props.url}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginRight: 4,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  linkText: {
    textDecorationLine: "underline",
    fontSize: 16,
  },
});
