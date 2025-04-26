const EnvKeys = [
  "EXPO_PUBLIC_API_URL",
  "EXPO_PUBLIC_TOS_URL",
  "EXPO_PUBLIC_AVATAR_URL",
] as const;

const Env = (<unknown>process.env) as Record<(typeof EnvKeys)[number], string>;

for (const key of EnvKeys) {
  if (!(key in Env)) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

export default Env;
