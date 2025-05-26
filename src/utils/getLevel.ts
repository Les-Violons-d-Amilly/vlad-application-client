import Levels, { Level, LevelCategoryName } from "../constants/Levels";

export default function getLevel(
  category: LevelCategoryName,
  levelNum: number
): Level | null {
  if (isNaN(category) || isNaN(levelNum)) {
    return null;
  }

  const step = Levels[category].steps[levelNum - 1] ?? null;

  if (step instanceof Level) return step;
  return null;
}
