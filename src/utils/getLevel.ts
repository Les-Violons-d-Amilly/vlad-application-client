import Levels, { Level, LevelCategoryName } from "../constants/Levels";

export default function getLevel(
  category: LevelCategoryName,
  levelNum: number
): Level | null {
  if (isNaN(category) || isNaN(levelNum)) {
    return null;
  }

  return Levels[category].levels[levelNum - 1] ?? null;
}
