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
import { deleteAvatar, uploadAvatar } from "@/src/api/user";
import Levels from "@/src/constants/Levels";
import { ProgressChart, LineChart } from "react-native-chart-kit";
import { Page, type PageProps } from "@/src/routes";
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";

const { width } = Dimensions.get("window");

const imageOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: "images",
  allowsEditing: true,
  aspect: [1, 1],
  quality: 1,
  allowsMultipleSelection: false,
};

const hours = [5.3, 2.2, 7.2, 6.3, 3.4, 0.4, 5.6];

export default function Account(props: PageProps) {
  const { user, accessToken, setUser } = useAuth();
  const { parseColor } = useTheme();

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
    if (!filename) return;

    setUser((user) => ({
      ...user!,
      avatar: filename,
    }));

    closeChangeAvatarMenu();
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted)
      return alert("Permission to access camera is required!");

    const result = await ImagePicker.launchCameraAsync(imageOptions);
    if (result.canceled) return;

    const filename = await uploadAvatar(accessToken!, result.assets[0].uri);
    if (!filename) return;

    setUser((user) => ({
      ...user!,
      avatar: filename,
    }));

    closeChangeAvatarMenu();
  };

  const removeAvatar = async () => {
    deleteAvatar(accessToken!);
    setUser((user) => ({ ...user!, avatar: null }));
    closeChangeAvatarMenu();
  };

  const totalMinutes = hours.reduce((acc, val) => acc + val * 60, 0);
  const duration = moment.duration(totalMinutes, "minutes");

  if (!user) return null;

  return (
    <ScrollView>
      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <RipplePressable
            style={styles.avatarChangeMenuButton}
            rippleColor={parseColor("textPrimary", 0.05)}
            onPress={openChangeAvatarMenu}
          >
            <UserIcon size={100} />
          </RipplePressable>
          <View
            style={[
              styles.onlineIndicator,
              { backgroundColor: "#2fad51", borderColor: "#30c959" },
            ]}
          />
        </View>
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
                onPress={removeAvatar}
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
        <Text
          style={[styles.userGroup, { color: parseColor("textSecondary") }]}
        >
          {user.group}
        </Text>
      </View>
      <RipplePressable
        style={styles.settingsButton}
        href="/settings"
        rippleColor={parseColor("textPrimary", 0.05)}
      >
        <FontAwesome name="cog" size={24} color={parseColor("textSecondary")} />
      </RipplePressable>
      <View style={styles.profileContent}>
        <Text
          style={[styles.sectionTitle, { color: parseColor("textPrimary") }]}
        >
          Progression
        </Text>
        <Text
          style={[
            styles.sectionSubtitle,
            { color: parseColor("textSecondary") },
          ]}
        >
          {Levels.reduce((acc, category) => acc + category.currentLevel, 0)}/
          {Levels.reduce((acc, category) => acc + category.levelsCount, 0)} (
          {(
            Levels.reduce((acc, category) => acc + category.currentLevel, 0) /
            Levels.reduce((acc, category) => acc + category.levelsCount, 0)
          ).toLocaleString("fr-FR", {
            style: "percent",
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
          })}{" "}
          complété)
        </Text>
        <View style={styles.chart}>
          <View>
            <ProgressChart
              data={{
                labels: Levels.map((category) => category.name),
                data: Levels.map((category) => category.progress),
              }}
              width={(width - 20) * 0.6}
              height={(width - 20) * 0.6}
              strokeWidth={14}
              radius={16}
              chartConfig={{
                backgroundGradientFromOpacity: 0,
                backgroundGradientToOpacity: 0,
                color: (opacity = 1, index = 0) =>
                  Levels[index].color +
                  Math.round(opacity * 255)
                    .toString(16)
                    .padStart(2, "0"),
              }}
              hideLegend
            />
          </View>
          <View style={styles.categoryButtons}>
            {Levels.map((category, index) => (
              <RipplePressable
                key={index}
                style={[
                  styles.categoryButton,
                  { backgroundColor: category.color },
                ]}
                rippleColor="#ffffff22"
                onPress={() => props.setTab(Page.Map)}
              >
                <Text style={styles.categoryButtonCategoryName}>
                  {category.name}
                </Text>
                <Text style={styles.categoryButtonCategoryProgress}>
                  {category.currentLevel}/{category.levelsCount} (
                  {(
                    category.currentLevel / category.levelsCount
                  ).toLocaleString("fr-FR", {
                    style: "percent",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 1,
                  })}
                  )
                </Text>
              </RipplePressable>
            ))}
          </View>
        </View>
        <View
          style={[
            styles.separator,
            { backgroundColor: parseColor("backgroundSecondary") },
          ]}
        />
        <View style={styles.profileContent}>
          <Text
            style={[styles.sectionTitle, { color: parseColor("textPrimary") }]}
          >
            Temps de jeu
          </Text>
          <Text
            style={[
              styles.sectionSubtitle,
              { color: parseColor("textSecondary") },
            ]}
          >
            {Math.floor(duration.asHours())} heures et {duration.minutes()}{" "}
            minutes
          </Text>
          <LineChart
            data={{
              labels: Array.from({ length: 7 }, (_, i) =>
                moment().subtract(i, "days").format("ddd")
              ).toReversed(),
              datasets: [
                {
                  data: hours,
                  color: (opacity = 1) => parseColor("primary", opacity),
                },
              ],
            }}
            fromZero
            withVerticalLines={false}
            bezier
            width={width - 40}
            height={(width - 40) * 0.5}
            chartConfig={{
              backgroundGradientFromOpacity: 0,
              backgroundGradientToOpacity: 0,
              fillShadowGradientFromOpacity: 0.2,
              fillShadowGradientToOpacity: 0,
              color: (opacity = 1) => parseColor("primary", opacity),
              labelColor: (opacity = 1) => parseColor("textSecondary", opacity),
            }}
            formatYLabel={(value) => parseInt(value).toString() + "h"}
            style={{ marginVertical: 25 }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    width: width,
    height: width * 0.65,
    justifyContent: "center",
    alignItems: "center",
    marginTop: StatusBar.currentHeight! + 20,
    marginBottom: 20,
  },
  userName: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  userGroup: {
    fontSize: 14,
  },
  settingsButton: {
    position: "absolute",
    right: 20,
    top: StatusBar.currentHeight! + 10,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {},
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
  profileContent: {
    width: width,
  },
  chart: {
    flexDirection: "row",
    alignItems: "center",
  },
  separator: {
    width: width - 40,
    height: 1,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 30,
    marginTop: 10,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginTop: 5,
    marginLeft: 30,
  },
  categoryButtons: {
    flex: 1,
    paddingRight: 25,
  },
  categoryButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  categoryButtonCategoryName: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 12,
  },
  categoryButtonCategoryProgress: {
    color: "#ffffffaa",
    fontSize: 11,
  },
  avatarChangeMenuButton: {
    width: 125,
    height: 125,
    borderRadius: 125,
    position: "relative",
  },
  onlineIndicator: {
    position: "absolute",
    height: 28,
    width: 28,
    borderRadius: 14,
    right: 5,
    bottom: 5,
    borderWidth: 6,
  },
});
