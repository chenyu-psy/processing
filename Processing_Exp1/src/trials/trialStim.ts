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
export function generateColors(n: number, saturation: number | number[] = 80, lightness: number | number[] = 50) {

    let Input_S: number = Array.isArray(saturation) ? random.randint(saturation[0], saturation[1]) : saturation
    let Input_L: number = Array.isArray(lightness)
      ? random.randint(lightness[0], lightness[1])
      : lightness;

    const interval = 360 / n;
    const float = Math.floor(interval / 8);
    const initialValue = random.randint(0, interval);
    const angleList = Array.from(
      { length: n },
      (_, i) => i * interval + initialValue + random.randint(-float, float)
    );
    const colorList = angleList.map(angle => hslToHex(angle, Input_S, Input_L));

    return colorList;

}
