/**
 * @title Filtering Project Exp 3
 * @description In this experiment, we fill the target and distractor with different colors.
 * @version 1.1.0
 *
 * @assets assets/
 */

// import stylesheets (.scss or .css).
import "../styles/main.scss";

// jsPsych official plugin
import preload from "@jspsych/plugin-preload";

// Global variables
import { jsPsych } from "./jsp";
import { expInfo } from "./settings";
let { DESIGN } = expInfo;

// screens
import { welcome_screen } from "./instructions/welcome";
import { consent_screen, notice_screen } from "./instructions/consent";
import { browser_screen } from "./instructions/browserCheck";
import { fullMode_screen } from "./instructions/fullScreen";
import { createNewTrial } from "./trials/trialProcess";
import {
  createBlockInstruction,
  pra_instr_screen,
  exp_start_screen,
} from "./instructions/InstrStart";
import { 
  practice_dual_tasks_line, 
  practice_judgement_task_line, 
  practice_memory_task_line, 
  start_experiment_screen 
} from "./instructions/practice";
import { survey_screen } from "./survey/survey";
import { random } from "@coglabuzh/webpsy.js"


/**
 * This function will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @type {import("jspsych-builder").RunFunction}
 */
export async function run({
  assetPaths,
  input = {},
  environment,
  title,
  version,
}) {
  // Initialize a timeline to hold the trials
  var timeline: any[] = [];

  // Preload assets
  const preload_screen = {
    type: preload,
    images: assetPaths.images,
    // audio: assetPaths.audio,
    // video: assetPaths.video,
  };

  // ********************** Experiment ********************** //

  // shuffle the paradigms
  random.shuffle(DESIGN.PARADIGM);

  // Create an array to store the experiment trials for the retro condition
  let experiment_line: any[] = [];

  experiment_line.push(start_experiment_screen);

  DESIGN.PARADIGM.forEach((paradigm, iParadigm) => {

    // shuffle the conditions
    random.shuffle(DESIGN.CONDITION);

    DESIGN.CONDITION.forEach((condition, iBlock) => {

      // Instructions before each block
      let block_instr_screen = createBlockInstruction(
        DESIGN.QUESTION,
        paradigm,
        condition
      );
      experiment_line.push(block_instr_screen);

      /*********************** Practice ***********************/

      experiment_line.push(pra_instr_screen);

      for (let iTrial = 0; iTrial < DESIGN.nPRACTICE; iTrial++) {

        let trialLine = createNewTrial(
          paradigm,
          condition,
          DESIGN.QUESTION,
          0,
          iTrial + 1
        );

        experiment_line = experiment_line.concat(trialLine);
      }


      /*********************** Experiment ***********************/

      experiment_line.push(exp_start_screen);

      for (let iTrial = 0; iTrial < DESIGN.nTRIALS; iTrial++) {

        let trialLine = createNewTrial(
          paradigm,
          condition,
          DESIGN.QUESTION,
          iParadigm + iBlock + 1,
          iTrial + 1
        );
        experiment_line = experiment_line.concat(trialLine);
      }
    });
  });

  // Push all the screen slides into timeline
  // When you want to test the experiment, you can easily comment out the screens you don't want
  timeline.push(preload_screen);
  timeline.push(welcome_screen);
  timeline.push(consent_screen);
  timeline.push(notice_screen);
  timeline.push(browser_screen);
  timeline.push(fullMode_screen);
  timeline = timeline.concat(practice_memory_task_line);
  timeline = timeline.concat(practice_judgement_task_line);
  timeline = timeline.concat(practice_dual_tasks_line);
  timeline = timeline.concat(experiment_line);
  timeline.push(survey_screen);

  

  // ********************** Test ********************** //
  await jsPsych.run(timeline); // run the experiment
  // await jsPsych.simulate(timeline, "data-only"); // simulate the experiment and get the data only 
  // await jsPsych.simulate(timeline, "visual"); // simulate the experiment visually

  // Return the jsPsych instance so jsPsych Builder can access the experiment results (remove this
  // if you handle results yourself, be it here or in `on_finish()`)
  // return jsPsych;
}
