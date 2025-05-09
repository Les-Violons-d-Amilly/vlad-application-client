export function lighten(color: string, amount: number) {
  const num = parseInt(color.slice(1), 16);
  const amt = Math.round(2.55 * amount);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`;
}

export function darken(color: string, amount: number) {
  const num = parseInt(color.slice(1), 16);
  const amt = Math.round(2.55 * amount);
  const R = (num >> 16) - amt;
  const G = ((num >> 8) & 0x00ff) - amt;
  const B = (num & 0x0000ff) - amt;

  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`;
}

export function mixHexColors(
  color1: string,
  color2: string,
  weight: number = 0.5
) {
  if (!color1.startsWith("#") || !color2.startsWith("#")) {
    throw new Error('Hex colors must start with "#"');
  }

  const hex = (c: string) =>
    c
      .slice(1)
      .match(/.{2}/g)!
      .map((x) => parseInt(x, 16));

  const rgb1 = hex(color1);
  const rgb2 = hex(color2);

  const mix = rgb1.map((c1, i) =>
    Math.round(c1 * (1 - weight) + rgb2[i] * weight)
  );

  const toHex = (v: number) => v.toString(16).padStart(2, "0");

  return `#${mix.map(toHex).join("")}`;
}
