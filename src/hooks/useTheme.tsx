import { createContext, useContext, useEffect, useState } from "react";
import { Theme, ThemeColorName, Themes } from "../constants/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

type ThemeProviderProps = Readonly<{
  children: React.ReactNode;
}>;

type ThemeContextProps = Readonly<{
  theme: Theme;
  parseColor: <T extends ThemeColorName | undefined>(
    colorName: T,
    opacity?: number
  ) => T;
  setTheme: (theme: Theme) => void;
}>;

const ThemeContext = createContext<ThemeContextProps>({
  theme: Theme.System,
  parseColor: <T extends ThemeColorName | undefined>() => undefined as T,
  setTheme: () => {},
});

export function ThemeProvider(props: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(Theme.System);

  const isSystemDarkMode = useColorScheme() === "dark";

  useEffect(() => {
    async function loadTheme() {
      const storedTheme = (await AsyncStorage.getItem(
        "@theme"
      )) as Theme | null;

      setTheme(storedTheme ?? Theme.System);
    }

    loadTheme();
  }, []);

  function parseColor<T extends ThemeColorName | undefined>(
    colorName: T,
    opacity?: number
  ) {
    let color = undefined as T;
    if (!colorName) return color;

    if (theme === Theme.System) {
      color = Themes[isSystemDarkMode ? "dark" : "light"].colors[
        colorName
      ] as T;
    } else {
      color = Themes[theme].colors[colorName] as T;
    }

    if (opacity) {
      color = `${color}${Math.round(opacity * 255)
        .toString(16)
        .padStart(2, "0")}` as T;
    }

    return color;
  }

  async function changeTheme(theme: Theme) {
    await AsyncStorage.setItem("@theme", theme);
    setTheme(theme);
  }

  return (
    <ThemeContext.Provider value={{ theme, parseColor, setTheme: changeTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export default function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
