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
  levelsCount: number;
  currentLevel: number;
  seedFunction: (i: number) => number;
  readonly levels: Level[];
  readonly progress: number;
};

export enum LevelCategoryName {
  Listening,
  Reading,
  Rhythm,
  Theory,
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

const Levels: LevelCategory[] = [
  {
    name: "Écoute",
    color: "#f22447",
    seedFunction: (i) =>
      0.5 + i / 2 + i / 3 + i / 4 + i / 5 + i / 7 + i / 11 + i / 13 + i / 17,
    levelsCount: 26,
    currentLevel: 19,
    get levels() {
      return Array.from({ length: this.levelsCount }, (_, i) => ({
        key: i,
        x: applyLayout(this.seedFunction(i)),
        stars: i > this.currentLevel ? 0 : (i % 3) + 1,
        href: {
          pathname: `/(level)/(listening)/${i + 1}`,
          params: {
            level: `${i + 1}`,
            category: "" + LevelCategoryName.Listening,
          },
        } as Href,
        title: "Lorem ipsum",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        rules:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      }));
    },
    get progress() {
      return this.currentLevel / this.levelsCount;
    },
  },
  {
    name: "Lecture",
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
    levelsCount: 35,
    currentLevel: 21,
    get levels() {
      return Array.from({ length: this.levelsCount }, (_, i) => ({
        key: i,
        x: applyLayout(this.seedFunction(i)),
        stars: i > this.currentLevel ? 0 : (i % 3) + 1,
        href: {
          pathname: `/(level)/(reading)/${i + 1}`,
          params: {
            level: `${i + 1}`,
            category: "" + LevelCategoryName.Reading,
          },
        } as Href,
        title: "Lorem ipsum",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        rules:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      }));
    },
    get progress() {
      return this.currentLevel / this.levelsCount;
    },
  },
  {
    name: "Rythme",
    color: "#2dda94",
    seedFunction: (i) =>
      0.5 +
      i / 2.1 +
      i / 3.05 +
      i / 4.2 +
      i / 4.6 +
      i / 7 +
      i / 11 +
      i / 13.2 +
      i / 17,
    levelsCount: 41,
    currentLevel: 34,
    get levels() {
      return Array.from({ length: this.levelsCount }, (_, i) => ({
        key: i,
        x: applyLayout(this.seedFunction(i)),
        stars: i > this.currentLevel ? 0 : (i % 3) + 1,
        href: {
          pathname: `/(level)/(rythm)/${i + 1}`,
          params: {
            level: `${i + 1}`,
            category: "" + LevelCategoryName.Rhythm,
          },
        } as Href,
        title: "Lorem ipsum",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        rules:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      }));
    },
    get progress() {
      return this.currentLevel / this.levelsCount;
    },
  },
  {
    name: "Théorie",
    color: "#24a9f2",
    seedFunction: (i) =>
      0.5 +
      i / 2.1 +
      i / 3.05 +
      i / 4.2 +
      i / 4.6 +
      i / 7 +
      i / 11.1 +
      i / 13.2 +
      i / 17,
    levelsCount: 19,
    currentLevel: 12,
    get levels() {
      return Array.from({ length: this.levelsCount }, (_, i) => ({
        key: i,
        x: applyLayout(this.seedFunction(i)),
        stars: i > this.currentLevel ? 0 : (i % 3) + 1,
        href: {
          pathname: `/(level)/(theory)/${i + 1}`,
          params: {
            level: `${i + 1}`,
            category: "" + LevelCategoryName.Theory,
          },
        } as Href,
        title: "Lorem ipsum",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        rules:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      }));
    },
    get progress() {
      return this.currentLevel / this.levelsCount;
    },
  },
];

export default Levels;
