
import { imageObj } from "./task-fun/imageObject";
import { random } from "@coglabuzh/webpsy.js";



export const expInfo = {
  // settings for the experiment
  TITLE: "Processing Exp1", // the title of the experiment
  RESEARCHER: "Chenyu Li", // researcher's name
  EMAIL: "chenyu.li@uzh.ch", // researcher's email
  DURATION: 40, // duration of the experiment in minutes
  LANG: "en", // the language of the experiment

  // experiment design
  DESIGN: {
    nPRACTICE: 2, // number of practice trials
    nTRIALS: 20, // number of experiment trials for each condition
    CONDITION: ["Sspan", "Cspan"], // conditions
    SETSIZE: 4, // set size
    QUESTION: random.sample(["smaller", "larger"], 1)[0], // questions
    RETURN_IMAGES: 12, // number of the trials that the images will not be reused
    INTERVAL: 2, // the interval between the two images
  },

  OBJECTS: {
    imagePath: "assets/images/objects/",
    CONTROL_OBJECT: "image26",
    POOL: Object.assign({}, imageObj),
    MEMORY: {} as { [key: number]: object },
  },

  COLORS: {
    BG_NAME: "grey",
    BACKGROUND: "#bababa",
    S_RANGE: [30, 90],
    L_RANGE: [30, 60],
  },

  // settings for each trial
  TIMING: {
    STIMULUS: 2000, // presentation time of each stimulus in milliseconds
    PRECUE: 700, // time for the precue in milliseconds
    RETROCUE: 1500, // time for the retrocue in milliseconds
    START: 10 * 1000, // time for the countdown before a new trial starts
    BREAK: 30, // break duration in seconds
    RETRIEVAL: 10 * 1000, // time for retrieval
    DEBRIEF: 2000, // time for feedback
  },

  SIZE: {
    WINDOW_RATIO: 16 / 9,
  },

  // when using Prolific, you can set customized completion codes for different situations
  // e.g., when participants complete the experiment, or when they fail the attention check
  // you can set them here and use them in the end of the experiment (jsp.ts)
  CODES: {
    SUCCESS: "CTD4J4F4", // the code for a successfully completion of the experiment
    OFFLINE: "CTD4J4F4", // the code for the offline situation
    FAILED_ATTENTION: "CPVIDZYN", // the code for the failed experiment
    FAILED_OTHERS: "C1GYHZYN", // the code for other failed situations (e.g., failed to resize the window)
    // You can specify the codes for different situations here.
  },

  // Running environment variables
  RUN_JATOS: false, // a switch to run the experiment on JATOS
};

let maxWidth = Math.min(screen.width, screen.height * expInfo.SIZE.WINDOW_RATIO)

// Global variables for the system. Normally, you don't need to change them.
export const varSystem = {
  TRACK: false, // a switch to track participants' interactions with the browser
  nBLUR: 0, // use to count how many times participants left the browser
  MAX_BLUR: 3, // the maximum number of times participants can leave the browser
  FAILED_ATTENTION_CHECK: false,
  CANVAS_WIDTH: maxWidth * 0.95,
  CANVAS_HEIGHT: maxWidth * 0.95 / expInfo.SIZE.WINDOW_RATIO,
  PAGE_WIDTH: Math.min(maxWidth, 1300) * 0.95,
  STATUS: "success" // the status of the experiment
};

