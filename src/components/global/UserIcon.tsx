import useAuth from "@/src/hooks/useAuth";
import useTheme from "@/src/hooks/useTheme";
import { lighten } from "@/src/utils/colors";
import { FontAwesome6 } from "@expo/vector-icons";
import { Image, StyleSheet, View } from "react-native";

type UserIconProps = Readonly<{
  size?: number;
  color?: string;
}>;

export default function UserIcon(props: UserIconProps) {
  const { user } = useAuth();
  const { parseColor } = useTheme();

  if (!user?.avatar) {
    return (
      <View
        style={[
          {
            height: (props.size ?? 24) * 1.25,
            width: (props.size ?? 24) * 1.25,
            borderRadius: ((props.size ?? 24) / 2) * 1.25,
            backgroundColor: props.color
              ? props.color + "33"
              : parseColor("backgroundSecondary"),
          },
          styles.iconCircle,
        ]}
      >
        <FontAwesome6
          name="user-large"
          size={(props.size ?? 24) * 0.65}
          color={props.color ?? parseColor("textSecondary")}
        />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: user.avatar }}
      style={[
        {
          height: (props.size ?? 24) * 1.25,
          width: (props.size ?? 24) * 1.25,
          borderRadius: ((props.size ?? 24) / 2) * 1.25,
        },
        styles.avatar,
      ]}
      resizeMode="cover"
      resizeMethod="scale"
    />
  );
}

const styles = StyleSheet.create({
  iconCircle: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    objectFit: "cover",
  },
});
