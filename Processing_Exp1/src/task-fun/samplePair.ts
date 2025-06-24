
import { random } from "@coglabuzh/webpsy.js"
import { expInfo } from "../settings";
let {OBJECTS} = expInfo;

/**
 * Sample a pair of images from the pool.
 * The function returns an array of two image objects 
 * including the image name and the image size.
 * 
 * @param pool [object] the pool of images
 * @param memory [object] the memory of images that have been used over previous trials
 * @param interval [number] the interval between the two images [default: 2]
 * @returns [array] an array of two image objects
 */
export function samplePair(
    pool: { [key: string]: number },
    memory: { [key: number]: object },
    interval: number = 2,
    trialIndex: string = "",
    fix = false
): object {
  // image pool (exclude the control object from the pool)
  let imagePool = Object.keys(pool).filter(
    (image) => image !== OBJECTS.CONTROL_OBJECT
  );

  let secondImagePool: any[] = [];
  let firstImage: string;
  let firstSize: number;
  let i = 0;

  // initialize the memory for the current trial index
  memory[trialIndex] = memory[trialIndex] || {};

  if (fix) {
    // read the first image from the memory
    firstImage = OBJECTS.CONTROL_OBJECT;
    firstSize = pool[firstImage];

    // create a temporary larger pool for the second image
    let largerPool = imagePool.filter(
      (image) => pool[image] >= firstSize + interval
    );
    // create a temporary smaller pool for the second image
    let smallerPool = imagePool.filter(
      (image) => pool[image] <= firstSize - interval
    );

    // if there is no image in the larger pool, sample the second image from the smaller pool
    let smallerPoolSize: number;

    // correct the sampling bias
    smallerPoolSize = largerPool.length === 0 ? 1 : largerPool.length;

    // sample the second image from the larger and smaller pool
    smallerPool = random.sample(smallerPool, smallerPoolSize);

    secondImagePool = largerPool.concat(smallerPool);

    // print warning if the second image pool is empty
    if (secondImagePool.length === 0) {
      console.warn(
        "The second image pool is empty in the fix condition. Please check the pool and memory."
      );
    }
  } else {
    do {
      // sample the first image
      /**
       * because the number of images whose size is 2 is much larger than other images,
       * it makes the other images whose size is larger than 4 more likely to be sampled as the second image.
       * to avoid this, we sample the first image from the images whose size is not 2.
       * it makes the other images whose size is 1 or 3 can be used more often.
       */
      firstImage = random.sample(
        imagePool.filter((image) => pool[image] !== 2),
        1
      )[0];

      // get the size of the first image
      firstSize = pool[firstImage];

      // create a temporary pool for the second image
      secondImagePool = imagePool.filter(
        (image) => Math.abs(pool[image] - firstSize) >= interval
      );

      i++;
    } while (secondImagePool.length === 0 && i < 200);

    // print warning if the second image pool is empty
    if (secondImagePool.length === 0 && i > 100) {
      console.warn(
        "The second image pool is empty. Please check the pool and memory."
      );
    }
  }

  // sample the second image
  let secondImage = random.sample(secondImagePool, 1)[0];

  // get the size of the second image
  let secondSize = pool[secondImage];

  // move the first image to the memory and delete it from the pool
  if (!fix) memory[trialIndex][firstImage] = firstSize;
  if (!fix) delete pool[firstImage];

  // move the second image to the memory and delete it from the pool
  memory[trialIndex][secondImage] = secondSize;
  delete pool[secondImage];

  let returnOBj1 = {
    left: { image: firstImage, size: firstSize },
    right: { image: secondImage, size: secondSize },
  };

  let returnOBj2 = {
    left: { image: secondImage, size: secondSize },
    right: { image: firstImage, size: firstSize },
  };

  if (random.random() > 0.5) {
    return returnOBj1;
  } else {
    return returnOBj2;
  }
}