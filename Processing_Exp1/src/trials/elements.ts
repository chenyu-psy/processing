
interface ImageObject {
    imagePath: string;
    color?: string;
    width: number;
    position: number[];
  }

export function drawImageObject(images:ImageObject[]) {

    let objectList:any[] = [];

    images.forEach((imageObj) => {
        const { imagePath, color, width, position  } = imageObj;

        var rect_object = {
            obj_type: 'rect', // means a rectangle
            width: width,
            height: width,
            fill_color: color,
            line_color: color,
            startX: position[0],
            startY: position[1]
        }
    
        var img_object = {
            obj_type: 'image', // means a rectangle
            file: imagePath,
            image_width: width+2,
            startX: position[0],
            startY: position[1]
        }

        objectList.push(rect_object);
        objectList.push(img_object);
        
    });

    return objectList;
}