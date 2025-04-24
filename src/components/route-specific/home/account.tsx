import { Dimensions, StatusBar, StyleSheet, Text, View } from "react-native";
import UserIcon from "../../global/UserIcon";
import useAuth from "@/src/hooks/useAuth";
import useTheme from "@/src/hooks/useTheme";
import RipplePressable from "../../global/RipplePressable";
import { FontAwesome } from "@expo/vector-icons";
import OutsidePressHandler from "react-native-outside-press";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import { uploadAvatar } from "@/src/api/user";
import { useState } from "react";

const { width } = Dimensions.get("window");

const imageOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: "images",
  allowsEditing: true,
  aspect: [1, 1],
  quality: 1,
  allowsMultipleSelection: false,
};

export default function Account() {
  const { user, accessToken } = useAuth();
  const { parseColor } = useTheme();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user?.avatar ?? null
  );

  const animatedValue = useSharedValue(0);

  const changeAvatarMenuAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedValue.value,
      transform: [{ translateY: animatedValue.value * 25 - 25 }],
    };
  });

  const openChangeAvatarMenu = () => {
    if (animatedValue.value !== 0) return;
    animatedValue.value = withTiming(1, { duration: 200 });
  };

  const closeChangeAvatarMenu = () => {
    animatedValue.value = withTiming(0, { duration: 200 });
  };

  const openImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted)
      return alert("Permission to access camera roll is required!");

    const result = await ImagePicker.launchImageLibraryAsync(imageOptions);
    if (result.canceled) return;

    const filename = await uploadAvatar(accessToken!, result.assets[0].uri);
    console.log(filename);
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted)
      return alert("Permission to access camera is required!");

    const result = await ImagePicker.launchCameraAsync(imageOptions);
    if (result.canceled) return;

    const filename = await uploadAvatar(accessToken!, result.assets[0].uri);
    console.log(filename);
  };

  if (!user) return null;

  return (
    <View>
      <View style={styles.profileContainer}>
        <RipplePressable
          style={{ width: 125, height: 125, borderRadius: 125 }}
          rippleColor={parseColor("textPrimary", 0.05)}
          onPress={openChangeAvatarMenu}
        >
          <UserIcon size={100} />
        </RipplePressable>
        <Animated.View
          style={[
            changeAvatarMenuAnimatedStyle,
            styles.changeAvatarMenu,
            { backgroundColor: parseColor("backgroundSecondary") },
          ]}
        >
          <OutsidePressHandler onOutsidePress={closeChangeAvatarMenu}>
            <Text
              style={[
                styles.changeAvatarMenuTitle,
                {
                  color: parseColor("textPrimary"),
                  backgroundColor: parseColor("backgroundTertiary"),
                },
              ]}
            >
              Changer l'avatar
            </Text>
            <RipplePressable
              style={styles.changeAvatarMenuButton}
              rippleColor={parseColor("textPrimary", 0.05)}
              onPress={openImagePicker}
            >
              <FontAwesome
                name="image"
                size={16}
                color={parseColor("textSecondary")}
              />
              <Text style={{ color: parseColor("textPrimary") }}>Gallerie</Text>
            </RipplePressable>
            <RipplePressable
              style={styles.changeAvatarMenuButton}
              rippleColor={parseColor("textPrimary", 0.05)}
              onPress={openCamera}
            >
              <FontAwesome
                name="camera"
                size={16}
                color={parseColor("textSecondary")}
              />
              <Text style={{ color: parseColor("textPrimary") }}>
                Prendre une photo
              </Text>
            </RipplePressable>
            {user.avatar && (
              <RipplePressable
                style={styles.changeAvatarMenuButton}
                rippleColor={parseColor("textPrimary", 0.05)}
              >
                <FontAwesome
                  name="close"
                  size={22}
                  color={parseColor("textSecondary")}
                />
                <Text style={{ color: parseColor("textPrimary") }}>
                  Supprimer
                </Text>
              </RipplePressable>
            )}
          </OutsidePressHandler>
        </Animated.View>
        <Text style={[styles.userName, { color: parseColor("textPrimary") }]}>
          {user.firstName} {user.lastName}
        </Text>
      </View>
      <RipplePressable
        style={styles.settingsButton}
        href="/settings"
        rippleColor={parseColor("textPrimary", 0.05)}
      >
        <FontAwesome name="cog" size={24} color={parseColor("textSecondary")} />
      </RipplePressable>
    </View>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    width: width,
    height: width * 0.65,
    justifyContent: "center",
    alignItems: "center",
    marginTop: StatusBar.currentHeight,
    gap: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  settingsButton: {
    position: "absolute",
    right: 20,
    top: StatusBar.currentHeight!,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  changeAvatarMenu: {
    position: "absolute",
    overflow: "hidden",
    borderRadius: 10,
    zIndex: 999,
    top: 180,
  },
  changeAvatarMenuTitle: {
    paddingInline: 15,
    paddingBlock: 10,
    fontSize: 16,
    fontWeight: "600",
    textTransform: "capitalize",
    textAlign: "center",
  },
  changeAvatarMenuButton: {
    paddingInline: 15,
    paddingBlock: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
