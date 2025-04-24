import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { router } from "expo-router";
import { getCurrentUser, refreshTokens, login as APILogin } from "../api/auth";

type User = {
  firstName: string;
  lastName: string;
  identity: string;
  avatar: string | null;
  email: string;
};

type LoginData = {
  user: User;
  refreshToken: string;
  accessToken: string;
};

type AuthProviderProps = Readonly<{
  children: ReactNode;
}>;

type ContextPorps = Readonly<{
  user: User | null;
  ready: boolean;
  accessToken: string | null;
  login: (identity: string, password: string) => Promise<User | null>;
  logout: () => void;
  setUser: (user: User) => void;
}>;

type ContextState = {
  user: User | null;
  ready: boolean;
};

const REFRESH_TOKEN_INTERVAL = 840000;

const AuthContext = createContext<ContextPorps>({
  user: null,
  ready: false,
  accessToken: null,
  login: async () => null,
  logout: () => {},
  setUser: () => {},
});

export function AuthProvider(props: AuthProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [state, setState] = useState<ContextState>({
    user: null,
    ready: false,
  });

  async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = await AsyncStorage.getItem("@refreshToken");
    if (!refreshToken) return null;

    const tokens = await refreshTokens(refreshToken);
    if (!tokens) return null;

    setAccessToken(tokens.accessToken);
    AsyncStorage.setItem("@refreshToken", tokens.refreshToken);
    return tokens.accessToken;
  }

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadUser() {
      const [refreshToken, cachedUser] = await Promise.all([
        AsyncStorage.getItem("@refreshToken"),
        AsyncStorage.getItem("@user"),
      ]);

      if (!refreshToken) return setState({ user: null, ready: true });

      if (cachedUser) {
        setState({ user: JSON.parse(cachedUser), ready: true });
      }

      const accessToken = await refreshAccessToken();
      if (!accessToken) return setState({ user: null, ready: true });

      refreshIntervalRef.current = setInterval(
        refreshAccessToken,
        REFRESH_TOKEN_INTERVAL
      );

      const user = await getCurrentUser(accessToken);
      if (!user) return setState({ user: null, ready: true });

      setState({ user, ready: true });
      AsyncStorage.setItem("@user", JSON.stringify(user));
    }

    loadUser();

    return () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    };
  }, []);

  const login = async (identity: string, password: string) => {
    const data = await APILogin(identity, password);
    if (!data) return null;

    setState({ user: data.user, ready: true });
    setAccessToken(data.accessToken);

    AsyncStorage.setItem("@user", JSON.stringify(data.user));
    AsyncStorage.setItem("@refreshToken", data.refreshToken);

    refreshIntervalRef.current = setInterval(
      refreshAccessToken,
      REFRESH_TOKEN_INTERVAL
    );

    return data.user;
  };

  const logout = () => {
    setState({ user: null, ready: true });
    setAccessToken(null);
    AsyncStorage.removeItem("@user");
    if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    router.push("/authentication");
  };

  const setUser = (user: User) => {
    setState((prevState) => ({ ...prevState, user }));
  };

  return (
    <AuthContext.Provider
      value={{ ...state, accessToken, login, logout, setUser }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
