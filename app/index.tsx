import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const mode = process.env.EXPO_PUBLIC_APP_MODE;

    const timeout = setTimeout(() => {
      switch (mode) {
        case "student":
          router.replace("/student");
          break;
        case "teacher":
          router.replace("/teacher");
          break;
        default:
          //TODO page d'erreur ?
          throw new Error("Choix d'environement invalide.");
      }
    }, 50);

    return () => clearTimeout(timeout);
  }, []);

  return null;
}
