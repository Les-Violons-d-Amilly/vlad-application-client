import { StatusBar, StyleSheet, Text, View } from "react-native";
import useTheme from "../hooks/useTheme";
import RipplePressable from "../components/global/RipplePressable";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { Theme, Themes } from "../constants/Theme";
import { lighten } from "../utils/colors";
import ActionButton from "../components/global/ActionButton";
import useAuth from "../hooks/useAuth";

export default function Settings() {
  const { parseColor, setTheme, theme } = useTheme();
  const { logout } = useAuth();

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
        <RipplePressable
          style={[
            styles.backButton,
            { backgroundColor: parseColor("backgroundTertiary") },
          ]}
          rippleColor={parseColor("textPrimary", 0.05)}
          onPress={router.back}
        >
          <FontAwesome
            name="caret-left"
            size={24}
            color={parseColor("textSecondary")}
          />
        </RipplePressable>
        <Text
          style={[styles.headerTitle, { color: parseColor("textPrimary") }]}
        >
          Paramètres
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.settingsContainer}>
        <Text style={[styles.label, { color: parseColor("textPrimary") }]}>
          Compte
        </Text>
        <ActionButton
          type="secondary"
          style={{ marginInline: 20, marginTop: 10 }}
          size="small"
          icon={<FontAwesome5 name="key" />}
        >
          Réinitialiser le Mot de Passe
        </ActionButton>
        <ActionButton
          type="danger"
          style={{ marginInline: 20, marginTop: 10 }}
          size="small"
          icon={<FontAwesome5 name="sign-out-alt" />}
          onPress={logout}
        >
          Se déconnecter
        </ActionButton>
        <Text style={[styles.label, { color: parseColor("textPrimary") }]}>
          Apparence
        </Text>
        <Text style={[styles.subLabel, { color: parseColor("textPrimary") }]}>
          Thème
        </Text>
        <Text
          style={[
            styles.subLabelDescription,
            { color: parseColor("textSecondary") },
          ]}
        >
          Choisissez un thème pour l'application. Le thème système est le thème
          par défaut de votre appareil.
        </Text>
        <ScrollView
          contentContainerStyle={styles.themeContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.themeElement}>
            <RipplePressable
              onPress={() => setTheme(Theme.System)}
              style={[
                styles.themeButton,
                styles.themeButtonSystem,
                {
                  borderColor:
                    theme === Theme.System
                      ? parseColor("primary")
                      : parseColor("border"),
                },
              ]}
            >
              <View
                style={[
                  styles.themeContentLeft,
                  { backgroundColor: Themes.light.colors.backgroundPrimary },
                ]}
              />
              <View
                style={[
                  styles.themeContentRight,
                  { backgroundColor: Themes.dark.colors.backgroundPrimary },
                ]}
              />
            </RipplePressable>
            <Text
              style={[
                styles.themeName,
                {
                  color:
                    theme === Theme.System
                      ? lighten(parseColor("primary"), -10)
                      : parseColor("textSecondary"),
                },
              ]}
            >
              Système
            </Text>
          </View>
          {Object.entries(Themes).map(([name, value]) => (
            <View key={name} style={styles.themeElement}>
              <RipplePressable
                onPress={() => setTheme(name as Theme)}
                style={[
                  styles.themeButton,
                  {
                    borderColor:
                      theme === name
                        ? parseColor("primary")
                        : parseColor("border"),
                  },
                ]}
              >
                <View
                  style={[
                    styles.themeContent,
                    { backgroundColor: value.colors.backgroundPrimary },
                  ]}
                />
              </RipplePressable>
              <Text
                style={[
                  styles.themeName,
                  {
                    color:
                      theme === name
                        ? lighten(parseColor("primary"), -10)
                        : parseColor("textSecondary"),
                  },
                ]}
              >
                {value.name}
              </Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: StatusBar.currentHeight,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
  },
  backButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsContainer: {
    flexGrow: 1,
    paddingBlock: 20,
    gap: 10,
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
    paddingTop: 30,
    paddingLeft: 25,
  },
  subLabel: {
    fontSize: 18,
    fontWeight: "bold",
    paddingTop: 20,
    paddingLeft: 25,
  },
  subLabelDescription: {
    fontSize: 14,
    paddingLeft: 25,
    paddingRight: 25,
    lineHeight: 20,
    marginBottom: 20,
  },
  themeButton: {
    height: 70,
    width: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderWidth: 1,
    backgroundColor: "#00000022",
    flexDirection: "row",
  },
  themeButtonSystem: {
    transform: [{ rotateZ: "45deg" }],
  },
  themeContent: {
    flex: 1,
    borderRadius: 30,
    height: 60,
    width: 60,
  },
  themeContentLeft: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    height: 60,
    width: 30,
  },
  themeContentRight: {
    flex: 1,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    height: 60,
    width: 30,
  },
  themeName: {
    width: 65,
    textAlign: "center",
    lineHeight: 20,
  },
  themeContainer: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-around",
    width: "100%",
  },
  themeElement: {
    alignItems: "center",
    gap: 10,
  },
});
