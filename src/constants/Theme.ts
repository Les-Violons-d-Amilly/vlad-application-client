import schema from "../themes/light.json";

import LightTheme from "../themes/light.json";
import DarkTheme from "../themes/dark.json";

export const Themes = Object.freeze({
  [LightTheme.id]: LightTheme,
  [DarkTheme.id]: DarkTheme,
});

export type ThemeColors = typeof schema.colors;
export type ThemeColorName = keyof ThemeColors;

export type ThemeStructure = Readonly<{
  id: string;
  name: string;
  colors: ThemeColors;
}>;

export enum Theme {
  System = "system",
  Light = "light",
  Dark = "dark",
}
