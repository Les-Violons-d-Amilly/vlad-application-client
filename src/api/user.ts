import Env from "../constants/Env";

type AvatarData = {
  message: string;
  avatar: string;
};

export async function deleteAvatar(accessToken: string) {
  await fetch(`${Env.EXPO_PUBLIC_API_URL}/students/@me/avatar`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
}

export async function uploadAvatar(accessToken: string, avatarUri: string) {
  const filename = avatarUri.split("/").pop();
  const match = /\.(\w+)$/.exec(filename!);
  const type = match ? `image/${match[1]}` : "image";

  const formData = new FormData();
  formData.append("avatar", {
    uri: avatarUri,
    name: filename,
    type,
  } as any);

  const res = await fetch(`${Env.EXPO_PUBLIC_API_URL}/students/@me/avatar`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });

  console.log(res.status);
  if (!res.ok) return null;
  const data: AvatarData = await res.json();
  return data?.avatar ?? null;
}
