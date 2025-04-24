import ActionButton from "@/src/components/global/ActionButton";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import Input from "../components/global/Input";
import useTheme from "../hooks/useTheme";
import Checkbox from "../components/global/Checkbox";
import WebLink from "../components/global/WebLink";
import { Link, router } from "expo-router";
import useAuth from "../hooks/useAuth";
import Env from "../constants/Env";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [identity, setIdentity] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [conditionsAccepted, setConditionsAccepted] = useState(false);

  const { parseColor } = useTheme();
  const { login: authLogin } = useAuth();

  async function login() {
    if (!identity || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (!conditionsAccepted) {
      setError("Veuillez accepter les conditions d'utilisation.");
      return;
    }

    setError(null);

    const user = await authLogin(identity, password);

    if (!user) {
      setError("Identifiant ou mot de passe incorrect.");
      return;
    }

    router.push("/");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <View style={styles.fields}>
        <View>
          <Text style={styles.fieldLabel}>Identifiant</Text>
          <Input
            value={identity}
            onChangeText={setIdentity}
            autoCapitalize="none"
            autoComplete="username"
            autoCorrect={false}
            textContentType="username"
            minLength={3}
            maxLength={20}
            regex={/^[a-z]+$/}
          />
        </View>
        <View>
          <Text style={styles.fieldLabel}>Mot de passe</Text>
          <Input
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            needsLowercase
            needsNumber
            needsUppercase
            needsSpecial
            autoComplete="password"
            autoCapitalize="none"
            autoCorrect={false}
            minLength={8}
          />
          <Link style={styles.forgotPassword} href="/reset-password">
            Mot de passe oublié ?
          </Link>
        </View>
      </View>
      <Checkbox
        style={styles.acceptCheckbox}
        onChange={setConditionsAccepted}
        checked={conditionsAccepted}
      >
        <Text style={styles.acceptText}>J'accepte les </Text>
        <WebLink
          url={Env.EXPO_PUBLIC_TOS_URL}
          hideIcon
          style={styles.acceptText}
        >
          conditions d'utilisation
        </WebLink>
      </Checkbox>
      {error && (
        <View style={styles.errorRow}>
          <FontAwesome
            name="exclamation-circle"
            size={16}
            color={parseColor("danger")}
          />
          <Text style={{ color: parseColor("danger") }}>{error}</Text>
        </View>
      )}
      <ActionButton
        type="primary"
        style={styles.connectButton}
        icon={<Entypo name="login" />}
        onPress={login}
      >
        Se connecter
      </ActionButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#fff",
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 5,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "#444444",
    lineHeight: 24,
    marginLeft: 5,
  },
  connectButton: {
    marginTop: 50,
  },
  fields: {
    gap: 15,
  },
  fieldLabel: {
    fontSize: 15,
    color: "#333333",
    marginBottom: 5,
    marginLeft: 5,
  },
  forgotPassword: {
    fontSize: 14,
    marginTop: 8,
  },
  acceptCheckbox: {
    marginTop: 25,
  },
  acceptText: {
    fontSize: 14,
  },
});
