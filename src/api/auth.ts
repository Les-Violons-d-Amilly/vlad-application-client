import Env from "../constants/Env";

export enum Sex {
  Female = "female",
  Male = "male",
}

type DurationPerDate = {
  date: string;
  duration: number;
};

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  identity: string;
  avatar: string | null;
  email: string;
  sex: Sex;
  group: string;
  online: boolean;
  lastSeen: Date | null;
  timeOnApp: DurationPerDate[];
  createdAt: Date;
  updatedAt: Date;
};

export type Tokens = {
  refreshToken: string;
  accessToken: string;
};

type LoginData = {
  user: User;
} & Tokens;

export async function getCurrentUser(accessToken: string) {
  const res = await fetch(`${Env.EXPO_PUBLIC_API_URL}/students/@me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) return null;
  const user: User | null = await res.json();
  return user ?? null;
}

export async function refreshTokens(refreshToken: string) {
  const res = await fetch(`${Env.EXPO_PUBLIC_API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) return null;
  const data: Tokens = await res.json();
  return data ?? null;
}

export async function login(identity: string, password: string) {
  const res = await fetch(`${Env.EXPO_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identity, password }),
  });

  if (!res.ok) return null;
  const data: LoginData = await res.json();
  return data ?? null;
}
