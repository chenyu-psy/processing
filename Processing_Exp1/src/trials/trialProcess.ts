// jsPsych official plugin
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import Psychophysics from "@kurokida/jspsych-psychophysics";

// Basic Functions
import { random } from "@coglabuzh/webpsy.js";

// Task functions
import {
  createButtonMatrix,
  createAlterButtons,
} from "../task-fun/responseMatrix";
import { generateColors } from "./trialStim";
import { samplePair } from "../task-fun/samplePair";
import { returnImages } from "../task-fun/returnImages";
import { drawImageObject } from "./elements";

// Global variables
import { jsPsych } from "../jsp";
import { expInfo, varSystem } from "../settings";
let { OBJECTS, TIMING, COLORS, DESIGN } = expInfo;

// screens
import { trial_start_screen } from "../instructions/InstrTrial";

class createTrialBody {
  length: number;
  condition: string;
  question: string;
  correctJudge: string[];
  blockID: number;
  trialID: number;
  trialIndex: string;
  canW: number;
  canH: number;
  center: number[];

  colorList: string[];
  distractorColorList: string[];
  cueList: string[];
  consistencyList: string[];
  objectObj: object;
  responseList: string[];
  retrievalInfo: object;
  markers: string[];
  seqColorList: string[];

  constructor(condition, question, blockID, trialID) {
    // trial information
    this.condition = condition;
    this.question = question;
    this.blockID = blockID;
    this.trialID = trialID;
    this.trialIndex = "id" + Math.random().toString(16).slice(2);
    this.length = DESIGN.SETSIZE;
    this.retrievalInfo = {};

    // center of the canvas
    this.canW = varSystem.CANVAS_WIDTH;
    this.canH = varSystem.CANVAS_HEIGHT;
    this.center = [this.canW / 2, this.canH / 2];

    // generate target colors
    this.colorList = generateColors(
      DESIGN.SETSIZE,
      COLORS.S_RANGE,
      COLORS.L_RANGE
    );
    random.shuffle(this.colorList);

    // define fixObject
    let fixObject = true;

    // cue list
    this.cueList = random.sample(["left", "right"], this.length, true);

    // random select the objects and assign colors and positions to them
    this.objectObj = {};
    this.correctJudge = [];
    for (let i = 0; i < this.length; i++) {
      let pair = samplePair(
        OBJECTS.POOL,
        OBJECTS.MEMORY,
        DESIGN.INTERVAL,
        this.trialIndex,
        fixObject
      );
      this.objectObj[i] = pair;

      // correct judgement
      if (this.question === "smaller") {
        this.correctJudge[i] =
          this.objectObj[i].left.size < this.objectObj[i].right.size
            ? "left"
            : "right";
      } else {
        this.correctJudge[i] =
          this.objectObj[i].left.size > this.objectObj[i].right.size
            ? "left"
            : "right";
      }

      // check if the left object is the control object
      let isLeftFix = this.objectObj[i].left.image === OBJECTS.CONTROL_OBJECT;

      // cue color
      let cueColor = this.colorList[i];

      // assign white color to the control object
      this.objectObj[i].left.color = isLeftFix ? "#FFFFFF" : cueColor;
      this.objectObj[i].right.color = isLeftFix ? cueColor : "#FFFFFF";

      // create a new object in the retrieval info
      this.retrievalInfo[cueColor] = {};
      // assign the object
      this.retrievalInfo[cueColor].object = isLeftFix
        ? this.objectObj[i].right.image
        : this.objectObj[i].left.image;
      // assign the cue
      this.retrievalInfo[cueColor].cue = isLeftFix
        ? "right"
        : "left";
      // assign the judge
      this.retrievalInfo[cueColor].judge = this.correctJudge[i];
      // assign the congruency
      this.retrievalInfo[cueColor].congruency =
        this.correctJudge[i] === this.cueList[i] ? "congruent" : "incongruent";


      // assign positions
      this.objectObj[i].left.position = [this.canW * 0.38, this.canH / 2];
      this.objectObj[i].right.position = [this.canW * 0.62, this.canH / 2];
      // assign image path
      this.objectObj[i].left.imagePath =
        OBJECTS.imagePath + this.objectObj[i].left.image + ".png";
      this.objectObj[i].right.imagePath =
        OBJECTS.imagePath + this.objectObj[i].right.image + ".png";
      // assign image scale
      this.objectObj[i].left.width = this.canH * 0.18;
      this.objectObj[i].right.width = this.canH * 0.18;
    }

    // random select six not presented objects
    let nNPL = 12 - this.length; // number of not presented objects
    this.responseList = random.sample(
      Object.keys(OBJECTS.POOL).filter(
        (image) => image !== OBJECTS.CONTROL_OBJECT
      ),
      nNPL,
      false
    );

    // add these objects to the memory and remove them from the pool
    for (let image of this.responseList) {
      OBJECTS.MEMORY[this.trialIndex][image] = OBJECTS.POOL[image];
      delete OBJECTS.POOL[image];
    }

    // put the used objects into the response list
    for (let i = 0; i < this.length; i++) {
      let left_image = this.objectObj[i].left.image;
      let right_image = this.objectObj[i].right.image;

      if (!(left_image === OBJECTS.CONTROL_OBJECT))
        this.responseList.push(left_image);
      if (!(right_image === OBJECTS.CONTROL_OBJECT))
        this.responseList.push(right_image);
    }
    // shuffle the response list
    random.shuffle(this.responseList);

    // return the images
    returnImages(OBJECTS.POOL, OBJECTS.MEMORY, DESIGN.RETURN_IMAGES, OBJECTS.CONTROL_OBJECT);
  }

  // display the memory phase
  displayMemoryPhase() {}

  // ask participants to recall the color
  displayRetrievalPhase() {}

  // display the feedback
  displayFeedbackPhase(results: string = "memory") {}
}

/**
 * Display the memory phase
 */
createTrialBody.prototype.displayMemoryPhase = function () {
  let screen_line: any[] = [];

  for (let i = 0; i < this.length; i++) {

    // empty text
    const emptyText = {
      obj_type: "text",
      content: "",
      font: `bold ${this.canH * 0.15}px Arial`,
    };

    // pre-cue screen
    const preCueScreen = {
      type: Psychophysics,
      canvas_width: this.canW,
      canvas_height: this.canH,
      background_color: COLORS.BACKGROUND,
      stimuli: [emptyText],
      trial_duration: TIMING.PRECUE,
      data: {
        screenID: "preStim",
        blockID: this.blockID,
        trialID: this.trialID,
        condition: this.condition,
        question: this.question,
      },
    };

    // add the pre-cue screen to the screen line
    screen_line.push(preCueScreen);

    let memoryScreen: object;
    let stepImages = this.objectObj[i];

    if (this.question === "null") {
      // draw the image objects
      const elementList = drawImageObject([stepImages.left, stepImages.right]);

      // memory screen
      memoryScreen = {
        type: Psychophysics,
        canvas_width: this.canW,
        canvas_height: this.canH,
        background_color: COLORS.BACKGROUND,
        stimuli: elementList,
        response_type: "key",
        choices: "NO_KEYS",
        trial_duration: TIMING.STIMULUS,
        data: {
          screenID: "memory",
          blockID: this.blockID,
          trialID: this.trialID,
          stepID: i + 1,
          condition: this.condition,
          cue: this.cueList[i],
          leftColor: stepImages.left.color,
          rightColor: stepImages.right.color,
          leftImage: stepImages.left.image,
          rightImage: stepImages.right.image,
          leftSize: stepImages.left.size,
          rightSize: stepImages.right.size,
        },
      };
    } else {
      let questionContent = `Which object is ${this.question}?`;

      // draw a question mark
      const questionMark = {
        obj_type: "text",
        content: questionContent,
        font: `bold ${this.canH * 0.05}px Arial`,
        text_color: "#000000",
        startX: this.center[0],
        startY: this.center[1] * 0.2,
      };

      // create the button html for the current screen
      let buttonHtmlIndex = `${this.condition}${this.blockID}${this.trialID}${i}`;
      const buttonHtml = createAlterButtons(
        stepImages.left,
        stepImages.right,
        buttonHtmlIndex
      );

      // memory screen
      memoryScreen = {
        type: Psychophysics,
        canvas_width: this.canW,
        canvas_height: this.canH,
        background_color: COLORS.BACKGROUND,
        stimuli: [questionMark],
        response_type: "button",
        button_choices: [stepImages.left.imagePath, stepImages.right.imagePath],
        button_html: buttonHtml,
        trial_duration: TIMING.STIMULUS,
        data: {
          screenID: "memory",
          blockID: this.blockID,
          trialID: this.trialID,
          stepID: i + 1,
          condition: this.condition,
          cue: this.cueList[i],
          leftColor: stepImages.left.color,
          rightColor: stepImages.right.color,
          leftImage: stepImages.left.image,
          rightImage: stepImages.right.image,
          leftSize: stepImages.left.size,
          rightSize: stepImages.right.size,
          correctJudge: this.correctJudge[i],
        },
        on_finish: function (data) {
          // congruency
          data.congruency =
            data.cue === data.correctJudge ? "congruent" : "incongruent";

          // transform the response
          data.response =
            data.response === null ? "null" : ["left", "right"][data.response];

          // accuracy
          data.acc = data.response === data.correctJudge ? true : false;
        },
      };
    }

    // add the memory screen to the screen line
    screen_line.push(memoryScreen);

    // retro-cue screen
    const retroCueScreen = {
      type: Psychophysics,
      canvas_width: this.canW,
      canvas_height: this.canH,
      background_color: COLORS.BACKGROUND,
      stimuli: [emptyText],
      trial_duration: TIMING.PRECUE,
      data: {
        screenID: "retroStim",
        blockID: this.blockID,
        trialID: this.trialID,
        condition: this.condition
      },
    };

    // add the retro-cue screen to the screen line
    screen_line.push(retroCueScreen);
  }

  return screen_line;
};

/**
 * Ask participants to recall the object corresponding to the color
 */
createTrialBody.prototype.displayRetrievalPhase = function () {
  // copy the information from the current object
  const info = {
    responseList: this.responseList,
  };

  const retrieval_line: any[] = [];

  // shuffle the color list
  random.shuffle(this.colorList);

  // create the button html for the current trial
  let buttonHtmlIndex = `${this.condition}${this.blockID}${this.trialID}`;
  const colorButtonHtml = createButtonMatrix(
    3,
    4, // number of rows and columns
    this.canW * 0.4,
    this.canH * 0.5, // size of the whole matrix
    [this.canW * 0.75, this.canH * 0.5], // center position of the matrix
    this.canH * 0.18, // button width
    "#FFFFFF", // color
    buttonHtmlIndex
  );

  for (let color of this.colorList) {
    let testColor: any[] = [
      {
        obj_type: "circle",
        startX: this.center[0] * 0.6,
        startY: this.center[1],
        fill_color: color,
        line_color: color,
        radius: this.canH * 0.15,
      },
    ];

    const test_screen = {
      type: Psychophysics,
      canvas_width: this.canW,
      canvas_height: this.canH,
      background_color: COLORS.BACKGROUND,
      stimuli: testColor,
      response_type: "button",
      button_choices: this.responseList.map(
        (image: any) => OBJECTS.imagePath + image + ".png"
      ),
      button_html: colorButtonHtml,
      trial_duration: TIMING.RETRIEVAL,
      data: {
        screenID: "retrieval",
        blockID: this.blockID,
        trialID: this.trialID,
        condition: this.condition,
        color: color,
        correctObject: this.retrievalInfo[color].object,
        congruency: this.retrievalInfo[color].congruency,
      },
      on_finish: function (data) {
        data.response =
          data.response === null ? "null" : info.responseList[data.response];

        data.acc = data.response === data.correctObject ? true : false;
      },
    };

    retrieval_line.push(test_screen);
  }

  return retrieval_line;
};

createTrialBody.prototype.displayFeedbackPhase = function () {

  // number of test trials
  let nTest = DESIGN.SETSIZE;

  let debriefingScreen = {
    type: htmlKeyboardResponse,
    trial_duration: TIMING.DEBRIEF,
    stimulus: function () {
      let accuracy = jsPsych.data
        .get()
        .filter({ screenID: "retrieval" })
        .last(nTest)
        .filter({ acc: true })
        .count();

      return `<div class='fb-text'>You correctly recalled ${accuracy} out of ${nTest} objects.</div>`;
    },
    choices: "NO_KEYS",
    data: {
      screenID: "debrief",
      expPart: this.expPart,
      blockID: this.blockID,
      trialID: this.trialID,
      condition: this.condition,
    },
    on_finish: function (data) {
      let accuracy = jsPsych.data
        .get()
        .filter({ screenID: "retrieval" })
        .last(nTest)
        .filter({ acc: true })
        .count();

      data.response = accuracy / nTest;
    },
  };

  return debriefingScreen;
}

  
export function createNewTrial(
  condition: string,
  question: string,
  blockID: number,
  trialID: number
) {
  let trialBody = new createTrialBody(
    condition,
    question,
    blockID,
    trialID
  );

  let trialLine: any[] = [];

  // start screen
  trialLine.push(trial_start_screen);
  // memory screen
  let memoryScreen = trialBody.displayMemoryPhase();
  trialLine = trialLine.concat(memoryScreen);
  // retrieval screen
  let retrieval_line = trialBody.displayRetrievalPhase();
  trialLine = trialLine.concat(retrieval_line);
  // debriefing screen
  let debriefingScreen = trialBody.displayFeedbackPhase();
  trialLine.push(debriefingScreen);

  return trialLine;
}
