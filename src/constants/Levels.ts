import { Href } from "expo-router";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const PADDING = 20;
const ITEM_SIZE = 75;
const TRUE_PADDING = PADDING + ITEM_SIZE / 2;
const TOLERABLE_WIDTH = width - TRUE_PADDING * 2;
const COLUMNS = 4;

export type Level = {
  key: number;
  x: number;
  stars: number;
  title: string;
  description: string;
  rules: string;
  href: Href;
};

export type LevelCategory = {
  name: string;
  color: string;
  levels: Level[];
  seedFunction: (i: number) => number;
};

export enum LevelCategoryName {
  Category1,
  Category2,
}

function applyLayout(x: number) {
  x *= TOLERABLE_WIDTH;
  x /= COLUMNS - 1;
  x %= COLUMNS - 1;
  x = Math.round(x);
  x *= TOLERABLE_WIDTH / (COLUMNS - 1);
  x += TRUE_PADDING;

  return x;
}
export default [
  {
    name: "Catégorie 1",
    color: "#f22447",
    seedFunction: (i) =>
      0.5 + i / 2 + i / 3 + i / 4 + i / 5 + i / 7 + i / 11 + i / 13 + i / 17,
    get levels() {
      return Array.from({ length: 26 }, (_, i) => ({
        key: i,
        x: applyLayout(this.seedFunction(i)),
        stars: i === 25 ? 0 : (i % 3) + 1,
        href: {
          pathname: `/(level)/${i + 1}`,
          params: { level: `${i + 1}` },
        },
        title: "Lorem ipsum",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        rules:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      }));
    },
  },
  {
    name: "Catégorie 2",
    color: "#6c24f2",
    seedFunction: (i) =>
      0.7 +
      i / 2.1 +
      i / 3.05 +
      i / 4.2 +
      i / 4.6 +
      i / 7 +
      i / 11 +
      i / 13.2 +
      i / 17,
    get levels() {
      return Array.from({ length: 35 }, (_, i) => ({
        key: i,
        x: applyLayout(this.seedFunction(i)),
        stars: i === 34 ? 0 : (i % 3) + 1,
        href: {
          pathname: `/(level)/${i + 1}`,
          params: { level: `${i + 1}` },
        },
        title: "Lorem ipsum",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        rules:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      }));
    },
  },
] as LevelCategory[];
