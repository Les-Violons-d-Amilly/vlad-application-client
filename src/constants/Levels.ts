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
  private readonly index: number;
  private readonly isCourse: boolean;

  public readonly number: number;
  public readonly x: number;
  public readonly category: Category;

  constructor(
    index: number,
    number: number,
    category: Category,
    isCourse: boolean = false
  ) {
    this.index = index;
    this.number = number;
    this.category = category;
    this.isCourse = isCourse;
    this.x = applyLayout(category.applySeed(index));
  }

  get href(): Href {
    return {
      pathname: `/(${this.isCourse ? "course" : "level"})/(${
        this.category.folderName
      })/${this.number}`,
      params: {
        step: this.index.toString(),
        category: this.category.id.toString(),
      },
    } as Href;
  }
}

export class Course extends Step {
  public title: string;

  constructor(
    index: number,
    number: number,
    category: Category,
    title: string
  ) {
    super(index, number, category, true);
    this.title = title;
  }
}

export class Level extends Step implements LevelSettings {
  public stars: number;

  public title: string;
  public description: string;
  public rules: string;

  constructor(
    index: number,
    number: number,
    category: Category,
    settings: LevelSettings
  ) {
    super(index, number, category);
    this.stars = (number % 3) + 1;

    this.title = settings.title;
    this.description = settings.description;
    this.rules = settings.rules;
  }
}

export class Category {
  public steps: Step[] = [];
  public currentLevel: number = 0;

  public readonly id: LevelCategoryName;
  public readonly name: string;
  public readonly color: string;
  public readonly folderName: string;
  public readonly applySeed: (index: number) => number;

  constructor(
    id: LevelCategoryName,
    name: string,
    folderName: string,
    color: string,
    applySeed: (index: number) => number
  ) {
    this.id = id;
    this.name = name;
    this.folderName = folderName;
    this.color = color;
    this.applySeed = applySeed;
  }

  get levelsCount(): number {
    return this.steps.filter((step) => step instanceof Level).length;
  }

  get coursesCount(): number {
    return this.steps.filter((step) => step instanceof Course).length;
  }

  get stepsCount(): number {
    return this.steps.length;
  }

  get progress(): number {
    return this.currentLevel / this.stepsCount;
  }

  public addLevel(level: LevelSettings) {
    this.steps.push(
      new Level(this.stepsCount, this.levelsCount + 1, this, level)
    );

    return this;
  }

  public addCourse(title: string) {
    this.steps.push(
      new Course(this.stepsCount, this.coursesCount + 1, this, title)
    );

    return this;
  }
}

const Levels: Category[] = [
  new Category(
    LevelCategoryName.Listening,
    "Écoute",
    "listening",
    "#6c24f2",
    (i: number) =>
      // prettier-ignore
      0.5 + i / 2.1 + i / 3.05 + i / 4.2 + i / 4.6 + i / 7 + i / 11 + i / 13.2 + i / 17
  )
    .addCourse("Cassoulet")
    .addLevel({
      title: "Reconnaissance des notes",
      description: "Reconnaissance des notes do, ré, mi",
      rules: "Touchez la note qui correspond à la note jouée.",
    })
    .addLevel({
      title: "Reconnaissance des notes",
      description: "Reconnaissance des notes fa, sol",
      rules: "Touchez la note qui correspond à la note jouée.",
    })
    .addLevel({
      title: "Reconnaissance des notes",
      description: "Reconnaissance des notes fa, sol, la",
      rules: "Touchez la note qui correspond à la note jouée.",
    })
    .addLevel({
      title: "Reconnaissance des notes",
      description: "Reconnaissance des notes mi, la",
      rules: "Touchez la note qui correspond à la note jouée.",
    })
    .addLevel({
      title: "Reconnaissance des notes",
      description: "Reconnaissance des notes mi, la et si",
      rules: "Touchez la note qui correspond à la note jouée.",
    }),
  new Category(
    LevelCategoryName.Reading,
    "Lecture",
    "reading",
    "#f22447",
    (i: number) =>
      // prettier-ignore
      0.7 + i / 2.1 + i / 3.05 + i / 4.2 + i / 4.6 + i / 7 + i / 11 + i / 13.2 + i / 17
  )
    .addCourse("Placement des Notes")
    .addLevel({
      title: "Placement des Notes",
      description: "Placement des notes sur la portée",
      rules: "Déplacez les notes sur la portée pour les placer correctement.",
    }),
  new Category(
    LevelCategoryName.Rhythm,
    "Rythme",
    "rythm",
    "#2dda94",
    (i: number) =>
      // prettier-ignore
      0.8 + i / 2 + i / 3.05 + i / 4.23 + i / 4.6 + i / 7 + i / 11 + i / 13.2 + i / 17
  ).addLevel({
    title: "Polyrythme",
    description: "Deux cercles de rythme à jouer en même temps",
    rules: "Jouez les deux cercles de rythme en même temps.",
  }),
  new Category(
    LevelCategoryName.Theory,
    "Théorie",
    "theory",
    "#24a9f2",
    (i: number) =>
      // prettier-ignore
      0.2 + i / 2.1 + i / 3.05 + i / 4.2 + i / 4.6 + i / 7 + i / 11.1 + i / 13.2 + i / 17
  ),
];

export default Levels;
