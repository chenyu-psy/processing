import jss from "jss-browserify";
import { expInfo } from "../settings";

/**
 * 
 * @param nRow The number of rows in the matrix
 * @param nCol The number of columns in the matrix
 * @param matrixW The width of the matrix
 * @param matrixH The height of the matrix
 * @param fontSize The size of the font is determined by the ratio of the matrix height.
 * @returns {Array}
 */
export function createButtonMatrix(
    nRow: number,
    nCol: number,
    matrixW: number,
    matrixH: number,
    center: number[],
    imageWidth: number,
    fillColor:string,
    index: string
  ): Array<any> {
    const nTotal = nRow * nCol;
    const intervalW = nCol === 1 ? 0 : matrixW / (nCol - 1);
    const intervalH = nRow === 1 ? 0 : matrixH / (nRow - 1);
  
    let buttonCSS: string[] = [];
  
    for (let i = 0; i < nTotal; i++) {
      let buttonName = `.alter-button${i}-${index}`;
      let className = `alter-button${i}-${index}`;
  
      let buttonX = center[0] + intervalW * (Math.floor(i % nCol) - (nCol-1)/2);
      let buttonY = center[1] + intervalH * (Math.floor(i / nCol) - (nRow-1)/2);
  
      jss.set(buttonName, {
        position: "absolute",
        top: `${buttonY}px`,
        left: `${buttonX}px`,
        "-webkit-transform": "translate(-50%,-50%)",
        "-moz-transform": "translate(-50%,-50%)",
        transform: "translate(-50%,-50%)",
        "font-family": "Arial",
        "text-align": "center",
        "background-color": fillColor,
        "justify-content": "center",
      });
  
      buttonCSS.push(
        `<img class=${className} src=%choice% width=${imageWidth}px></img>`
      );
    }
  
    return buttonCSS;
  }


  export function createAlterButtons(
    left_images: object,
    right_images: object,
    index: string
  ){

    let buttonCSS:any[] = [];

    const images = {
      left: Object.assign({}, left_images),
      right: Object.assign({}, right_images)
    }

    for (let side of Object.keys(images)) {

      let img = images[side];

      // let buttonName = `.button-${side}-${index}`;
      let className = `button-${side}-${index}`;

      jss.set(`.${className}`, {
        position: "absolute",
        top: `${img.position[1] + img.width / 2}px`,
        left: `${img.position[0] + img.width / 2}px`,
        "-webkit-transform": "translate(-50%,-50%)",
        "-moz-transform": "translate(-50%,-50%)",
        transform: "translate(-50%,-50%)",
        "font-family": "Arial",
        "text-align": "center",
        "background-color": img.color,
        "justify-content": "center",
      });

      buttonCSS.push(
        `<img class=${className} src=%choice% width=${img.width}px></img>`
      );
    }

    return buttonCSS;
  }
  