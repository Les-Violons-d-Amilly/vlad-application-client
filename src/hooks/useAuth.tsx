import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { router } from "expo-router";
import {
  getCurrentUser,
  refreshTokens,
  login as APILogin,
  type User,
} from "../api/auth";
import { Linking } from "react-native";

type AuthProviderProps = Readonly<{
  children: ReactNode;
}>;

type ContextPorps = Readonly<{
  user: User | null;
  ready: boolean;
  accessToken: string | null;
  login: (identity: string, password: string) => Promise<User | null>;
  logout: () => void;
  setUser: Dispatch<SetStateAction<User | null>>;
}>;

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
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

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
    async function loadUser(cachedUser?: string) {
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
        setReady(true);
      }

      const accessToken = await refreshAccessToken();

      if (!accessToken) {
        setReady(true);
        setUser(null);
        return null;
      }

      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = setInterval(
        refreshAccessToken,
        REFRESH_TOKEN_INTERVAL
      );

      const user = await getCurrentUser(accessToken);

      if (!user) {
        setReady(true);
        setUser(null);
        return null;
      }

      setUser(user);
      setReady(true);

      AsyncStorage.setItem("@user", JSON.stringify(user));

      return user._id;
    }

    AsyncStorage.getItem("@user").then(async (cachedUser) => {
      const userLoggedIn = !!(await loadUser(cachedUser ?? undefined));
      if (userLoggedIn) return;

      const initialUrl = await Linking.getInitialURL();
      if (!initialUrl) return;

      const url = new URL(initialUrl);
      const accessToken = url.searchParams.get("accessToken");
      const refreshToken = url.searchParams.get("refreshToken");
      const userId = url.searchParams.get("userId");

      if (!accessToken || !refreshToken || !userId) return;

      setAccessToken(accessToken);
      await AsyncStorage.setItem("@refreshToken", refreshToken);

      const loadedUserId = await loadUser();
      if (loadedUserId === userId) return;

      router.push("/authentication");
      AsyncStorage.removeItem("@refreshToken");
    });

    return () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    };
  }, []);

  const login = async (identity: string, password: string) => {
    const data = await APILogin(identity, password);
    if (!data) return null;

    setUser(data.user);
    setReady(true);
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
    setUser(null);
    setAccessToken(null);
    AsyncStorage.removeItem("@user");
    if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    router.push("/authentication");
  };

  return (
    <AuthContext.Provider
      value={{ user, ready, accessToken, login, logout, setUser }}
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
