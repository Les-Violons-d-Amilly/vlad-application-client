import Levels, { Level, LevelCategoryName } from "../constants/Levels";

export default function getLevel(
  category: LevelCategoryName,
  levelNum: number
): Level | null {
  return Levels[category].levels[levelNum - 1] ?? null;
}
