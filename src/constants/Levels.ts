import { Href } from "expo-router";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const PADDING = 20;
const ITEM_SIZE = 75;
const TRUE_PADDING = PADDING + ITEM_SIZE / 2;
const TOLERABLE_WIDTH = width - TRUE_PADDING * 2;
const COLUMNS = 4;

export enum LevelCategoryName {
  Listening,
  Reading,
  Rhythm,
  Theory,
}

type LevelSettings = {
  title: string;
  description: string;
  rules: string;
};

const seedFunctions = [
  (i: number) =>
    // prettier-ignore
    0.5 + i / 2 + i / 3 + i / 4 + i / 5 + i / 7 + i / 11 + i / 13 + i / 17,
  (i: number) =>
    // prettier-ignore
    0.7 + i / 2.1 + i / 3.05 + i / 4.2 + i / 4.6 + i / 7 + i / 11 + i / 13.2 + i / 17,
  (i: number) =>
    // prettier-ignore
    0.8 + i / 2 + i / 3.05 + i / 4.23 + i / 4.6 + i / 7 + i / 11 + i / 13.2 + i / 17,
  (i: number) =>
    // prettier-ignore
    0.2 + i / 2.1 + i / 3.05 + i / 4.2 + i / 4.6 + i / 7 + i / 11.1 + i / 13.2 + i / 17,
];

function applyLayout(x: number) {
  x *= TOLERABLE_WIDTH;
  x /= COLUMNS - 1;
  x %= COLUMNS - 1;
  x = Math.round(x);
  x *= TOLERABLE_WIDTH / (COLUMNS - 1);
  x += TRUE_PADDING;

  return x;
}

export class Step {
  public number: number;
  public x: number;
  public category: LevelCategoryName;

  constructor(number: number, category: LevelCategoryName) {
    this.number = number;
    this.category = category;
    this.x = applyLayout(seedFunctions[category](number));
  }
}

export class Course extends Step {
  public title: string;

  constructor(number: number, category: LevelCategoryName, title: string) {
    super(number, category);
    this.title = title;
  }
}

export class Level extends Step implements LevelSettings {
  public stars: number;

  public title: string;
  public description: string;
  public rules: string;

  constructor(
    number: number,
    category: LevelCategoryName,
    settings: LevelSettings
  ) {
    super(number, category);
    this.stars = (number % 3) + 1;

    this.title = settings.title;
    this.description = settings.description;
    this.rules = settings.rules;
  }

  get href(): Href {
    let subfolder: string;

    switch (this.category) {
      case LevelCategoryName.Listening:
        subfolder = "listening";
        break;
      case LevelCategoryName.Reading:
        subfolder = "reading";
        break;
      case LevelCategoryName.Rhythm:
        subfolder = "rythm";
        break;
      case LevelCategoryName.Theory:
        subfolder = "theory";
        break;
    }

    return {
      pathname: `/(level)/(${subfolder})/${this.number}`,
      params: {
        level: this.number.toString(),
        category: this.category.toString(),
      },
    } as Href;
  }
}

export class Category {
  public readonly id: LevelCategoryName;
  public name: string;
  public color: string;
  public currentLevel: number = 0;
  public steps: Step[] = [];

  constructor(id: LevelCategoryName, color: string) {
    this.id = id;
    this.color = color;

    switch (id) {
      case LevelCategoryName.Listening:
        this.name = "Écoute";
        break;
      case LevelCategoryName.Reading:
        this.name = "Lecture";
        break;
      case LevelCategoryName.Rhythm:
        this.name = "Rythme";
        break;
      case LevelCategoryName.Theory:
        this.name = "Théorie";
        break;
    }
  }

  get stepsCount(): number {
    return this.steps.length;
  }

  get progress(): number {
    return this.currentLevel / this.stepsCount;
  }

  public addLevel(level: LevelSettings) {
    this.steps.push(new Level(this.stepsCount + 1, this.id, level));
    return this;
  }

  public addCourse(title: string) {
    this.steps.push(new Course(this.stepsCount + 1, this.id, title));
    return this;
  }
}

const Levels: Category[] = [
  new Category(LevelCategoryName.Listening, "#6c24f2").addCourse("Cassoulet"),
  new Category(LevelCategoryName.Listening, "#6c24f2")
    .addLevel({
      title: "Reconnaissance des notes",
      description: "Reconnaissance des notes do, ré, mi",
      rules: "Touchez la note qui correspond à la note jouée.",
    })
    .addLevel({
      title: "Reconnaissance des notes",
      description: "Reconnaissance des notes sur la portée",
      rules: "Touchez la note qui correspond à la note jouée.",
    }),
  new Category(LevelCategoryName.Reading, "#f22447").addLevel({
    title: "Placement des notes",
    description: "Placement des notes sur la portée",
    rules: "Déplacez les notes sur la portée pour les placer correctement.",
  }),
  new Category(LevelCategoryName.Rhythm, "#2dda94").addLevel({
    title: "Polyrythme",
    description: "Deux cercles de rythme à jouer en même temps",
    rules: "Jouez les deux cercles de rythme en même temps.",
  }),
  new Category(LevelCategoryName.Theory, "#24a9f2"),
];

export default Levels;
