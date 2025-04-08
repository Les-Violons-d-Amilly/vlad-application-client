enum Colors {
  Primary = "#3372d6",
  Secondary = "#9c9ea1",
  Success = "#28a745",
  Danger = "#dc3545",
  Warning = "#ffc107",
}

export type ColorsType =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning";

export type ParsableColor = Colors | ColorsType | undefined;

export function parseColor(color: ParsableColor) {
  if (!color) return Colors.Primary;

  if (Object.values(Colors).includes(color as Colors)) {
    return color as Colors;
  }

  switch (color) {
    case "primary":
      return Colors.Primary;
    case "secondary":
      return Colors.Secondary;
    case "success":
      return Colors.Success;
    case "danger":
      return Colors.Danger;
    case "warning":
      return Colors.Warning;
    default:
      throw new Error(`Unknown color: ${color}`);
  }
}

export default Colors;
