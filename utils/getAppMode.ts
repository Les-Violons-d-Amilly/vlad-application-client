export enum AppMode {
  Teacher = "teacher",
  Student = "student",
}

export const getAppMode = (): AppMode => {
  const mode = process.env.EXPO_PUBLIC_APP_MODE as AppMode;
  return mode ?? AppMode.Student;
};
