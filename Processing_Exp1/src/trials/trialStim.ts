import { hslToHex } from "@coglabuzh/webpsy.js";
import { random } from "@coglabuzh/webpsy.js";


/**
 * Generate a list of colors
 * 
 * @param n number of colors to generate
 * @param saturation saturation of the colors, range from 0 to 100
 * @param lightness lightness of the colors, range from 0 to 100
 * @returns a list of colors in hex format
 */
export function generateColors(
  n: number,
  saturation: number | number[] = 80,
  lightness: number | number[] = 50
) {
  const interval = 360 / n;
  const float = Math.floor(interval / 8);
  const initialValue = random.randint(0, interval);

  const angleList = Array.from(
    { length: n },
    (_, i) =>
      (i * interval + initialValue + random.randint(-float, float) + 360) % 360
  );

  const colorList = angleList.map((angle) => {
    // --- SOLUTION ---
    // Calculate saturation and lightness for EACH color individually.
    const s = Array.isArray(saturation)
      ? random.randint(saturation[0], saturation[1])
      : saturation;
    const l = Array.isArray(lightness)
      ? random.randint(lightness[0], lightness[1])
      : lightness;

    return hslToHex(angle, s, l);
  });

  return colorList;
}

