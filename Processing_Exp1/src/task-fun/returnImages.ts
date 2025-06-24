
/**
 * return the images back to the pool after several trials
 * 
 * @param pool [object] the pool of images
 * @param memory [object] the memory of images that have been used over previous trials
 * @param afterTrials  [number] the number of trials after which the images are returned back to the pool
 * 
 * @returns void
 */
export function returnImages(
    pool: { [key: string]: number },
    memory: { [key: number]: object },
    afterTrials: number = 10,
    exclusion: string = "image5"
){

  // check the length of the memory
  let memoryLength = Object.keys(memory).length;

  // number of the trials that the images will not be reused
  let nReturn = memoryLength - afterTrials;

  if (nReturn > 0) {
    // Extract only the first `n` elements from the sorted list
    let imageList = Object.keys(memory)
      .sort() // Sort alphabetically
      .slice(0, nReturn); // Extract first `n` elements

    // iterate through the memory
    for (let key of imageList) {
      // get the images from the memory
      let images = memory[key];

      // return the images back to the pool
      for (let image of Object.keys(images)) {
        if (image !== exclusion) pool[image] = images[image];
      }

      // delete the memory
      delete memory[key];

      // break the loop if the length of the memory is less than the threshold
      if (Object.keys(memory).length <= afterTrials) break;
    }
  }

}