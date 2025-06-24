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
import { newPosArray } from "../task-fun/newPosArray";

// Global variables
import { jsPsych } from "../jsp";
import { expInfo, varSystem } from "../settings";
let { OBJECTS, TIMING, COLORS, DESIGN } = expInfo;

// screens
import { trial_start_screen } from "../instructions/InstrTrial";

class createTrialBody {
  paradigm: string;
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

  constructor(paradigm, condition, question, blockID, trialID) {
    // trial information
    this.paradigm = paradigm;
    this.condition = condition;
    this.question = question;
    this.blockID = blockID;
    this.trialID = trialID;
    this.trialIndex = "id" + Math.random().toString(16).slice(2);
    this.length =
      paradigm === "sequential" ? DESIGN.SETSIZE * 2 : DESIGN.SETSIZE;
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

    // mark memoranda and distractors (for the sequential paradigm)
    this.markers = Array(DESIGN.SETSIZE)
      .fill(["memorandum", "distractor"])
      .flat();
    random.shuffle(this.markers);

    // randomize the distractor colors
    // this.distractorColorList = newPosArray(this.colorList);
    this.distractorColorList = this.colorList;
    if (this.paradigm === "sequential")
      random.shuffle(this.distractorColorList); // randomize the distractor colors for the sequential paradigm

    // generate new color list for sequential paradigm
    if (this.paradigm === "sequential") {
      this.seqColorList = [];
      let iM = 0;
      let iD = 0;
      this.markers.forEach((marker) => {
        if (marker === "memorandum") {
          this.seqColorList.push(this.colorList[iM]);
          iM++;
        } else {
          this.seqColorList.push(this.distractorColorList[iD]);
          iD++;
        }
      });
    }

    // define fixObject
    let fixObject = this.paradigm === "sequential" ? true : false;

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

      // cue color
      let cueColor = this.paradigm === "sequential" ? this.seqColorList[i] : this.colorList[i];

      // assign colors and correct the cue list
      if (this.paradigm === "sequential") {

        // check if the object is a memorandum or a distr
        let isMemorandum = this.markers[i] === "memorandum";

        // check if the left object is the control object
        let isLeftFix = this.objectObj[i].left.image === OBJECTS.CONTROL_OBJECT;

        // assign white color to the control object
        this.objectObj[i].left.color = isLeftFix ? "#FFFFFF" : cueColor;
        this.objectObj[i].right.color = isLeftFix ? cueColor : "#FFFFFF";

        // correct the cue list
        this.cueList[i] = isLeftFix !== isMemorandum ? "left" : "right";

        // save to the retrieval info
        if (isMemorandum) {
          // create a new object in the retrieval info
          this.retrievalInfo[cueColor] = {}
          // assign the object
          this.retrievalInfo[cueColor].object = isLeftFix ? this.objectObj[i].right.image : this.objectObj[i].left.image;
          // assign the cue
          this.retrievalInfo[cueColor].cue = this.cueList[i];
          // assign the judge
          this.retrievalInfo[cueColor].judge = this.correctJudge[i];
          // assign the congruency
          this.retrievalInfo[cueColor].congruency = this.correctJudge[i] === this.cueList[i] ? "congruent" : "incongruent";
        };

        // if the paradigm is concurrent
      } else if (this.paradigm === "concurrent") {
        
        // create a new object in the retrieval info
        this.retrievalInfo[cueColor] = {};

        let isCueLeft = this.cueList[i] === "left";

        // assign colors
        this.objectObj[i].left.color = isCueLeft
          ? cueColor
          : this.distractorColorList[i];
        this.objectObj[i].right.color = isCueLeft
          ? this.distractorColorList[i]
          : cueColor;

        // save to the retrieval info
        this.retrievalInfo[cueColor].object = isCueLeft
          ? this.objectObj[i].left.image
          : this.objectObj[i].right.image;
        this.retrievalInfo[cueColor].cue = this.cueList[i];
        this.retrievalInfo[cueColor].judge = this.correctJudge[i];
        this.retrievalInfo[cueColor].congruency =
          this.correctJudge[i] === this.cueList[i]
            ? "congruent"
            : "incongruent";
      }

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
    let nNPL = 6;
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
  displayDebriefingPhase(results: string = "memory") {}
}

/**
 * Display the memory phase
 */
createTrialBody.prototype.displayMemoryPhase = function () {
  let screen_line: any[] = [];

  for (let i = 0; i < this.length; i++) {
    // cue text
    const cueImage = {
      obj_type: "image",
      file: `assets/images/arrows/${this.cueList[i]}.png`,
      image_width: this.canH * 0.2,
    };

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
      stimuli: () => {
        if (this.condition === "pre") {
          return [cueImage];
        } else {
          return [emptyText];
        }
      },
      trial_duration: TIMING.PRECUE,
      data: {
        screenID: "preStim",
        blockID: this.blockID,
        trialID: this.trialID,
        paradigm: this.paradigm,
        condition: this.condition,
        question: this.question,
        cue: this.condition === "pre" ? this.cueList[i] : "null",
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
          paradigm: this.paradigm,
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
      let buttonHtmlIndex = `${this.paradigm}${this.condition}${this.blockID}${this.trialID}${i}`;
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
          paradigm: this.paradigm,
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
      stimuli: () => {
        if (this.condition === "retro") {
          return [cueImage];
        } else {
          return [emptyText];
        }
      },
      trial_duration: TIMING.PRECUE,
      data: {
        screenID: "retroStim",
        blockID: this.blockID,
        trialID: this.trialID,
        paradigm: this.paradigm,
        condition: this.condition,
        cue: this.condition === "retro" ? this.cueList[i] : "null",
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

  const retrievalLine: any[] = [];

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

    const testScreen = {
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
        paradigm: this.paradigm,
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

    retrievalLine.push(testScreen);
  }

  return retrievalLine;
};

createTrialBody.prototype.displayDebriefingPhase = function (
  results: string = "memoryTask"
) {
  

  let debriefingScreen: object;

  if (results === "memoryTask") {

    // number of test trials
    let nTest = DESIGN.SETSIZE;

    debriefingScreen = {
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
        paradigm: this.paradigm,
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
  } else {
    
    // number of test trials
    let nTest = this.length;

    debriefingScreen = {
      type: htmlKeyboardResponse,
      trial_duration: TIMING.DEBRIEF,
      stimulus: function () {
        let accuracy = jsPsych.data
          .get()
          .filter({ screenID: "memory" })
          .last(nTest)
          .filter({ acc: true })
          .count();

        return `<div class='fb-text'>You correctly judged ${accuracy} out of ${nTest} pairs of objects.</div>`;
      },
      choices: "NO_KEYS",
      data: {
        screenID: "debrief",
        expPart: this.expPart,
        blockID: this.blockID,
        trialID: this.trialID,
        paradigm: this.paradigm,
        condition: this.condition,
      },
      on_finish: function (data) {
        let accuracy = jsPsych.data
          .get()
          .filter({ screenID: "memory" })
          .last(nTest)
          .filter({ acc: true })
          .count();

        data.response = accuracy / nTest;
      },
    };
  }

  return debriefingScreen;
};

export function createNewTrial(
  paradigm: string,
  condition: string,
  question: string,
  blockID: number,
  trialID: number
) {
  let trialBody = new createTrialBody(
    paradigm,
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
  let retrievalLine = trialBody.displayRetrievalPhase();
  trialLine = trialLine.concat(retrievalLine);
  // debriefing screen
  let debriefingScreen = trialBody.displayDebriefingPhase();
  trialLine.push(debriefingScreen);

  return trialLine;
}

export function createSizeJudgement(
  question: string,
  blockID: number,
  trialID: number
) {
  let trialBody = new createTrialBody(
    "sequential",
    "control",
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
  // debriefing screen
  let debriefingScreen = trialBody.displayDebriefingPhase("sizeJudgement");
  trialLine.push(debriefingScreen);

  return trialLine;
}
