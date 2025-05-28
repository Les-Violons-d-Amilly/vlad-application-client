import Levels, { Course, Level, LevelCategoryName } from "../constants/Levels";

export function getLevel(
  category: LevelCategoryName,
  levelNum: number
): Level | null {
  if (isNaN(category) || isNaN(levelNum)) {
    return null;
  }

  const step = Levels[category].steps[levelNum] ?? null;

  if (step instanceof Level) return step;
  return null;
}

export function getCourse(
  category: LevelCategoryName,
  courseNum: number
): Course | null {
  if (isNaN(category) || isNaN(courseNum)) {
    return null;
  }

  const step = Levels[category].steps[courseNum] ?? null;

  if (step instanceof Course) return step;
  return null;
}
