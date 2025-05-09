import Env from "@/src/constants/Env";
import useAuth from "@/src/hooks/useAuth";
import useTheme from "@/src/hooks/useTheme";
import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, View, Image } from "react-native";

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
    <View
      style={[
        styles.avatarContainer,
        {
          height: (props.size ?? 24) * 1.25,
          width: (props.size ?? 24) * 1.25,
          borderRadius: ((props.size ?? 24) / 2) * 1.25,
          padding: Math.ceil(((props.size ?? 24) / 2) * 0.1),
          borderColor: props.color
            ? props.color
            : parseColor("backgroundSecondary"),
        },
      ]}
    >
      <Image
        source={{ uri: `${Env.EXPO_PUBLIC_AVATAR_URL}/${user.avatar}` }}
        style={[
          {
            borderRadius: ((props.size ?? 24) / 2) * 1.25,
          },
          styles.avatar,
        ]}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  iconCircle: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {
    borderWidth: 1,
  },
  avatar: {
    objectFit: "cover",
    height: "100%",
    width: "100%",
  },
});
