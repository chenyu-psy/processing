// jsPsych official plugin
import htmlButtonResponse from "@jspsych/plugin-html-button-response";

// Basic Functions
import { countDownTimer, convertTime } from "@coglabuzh/webpsy.js";

// Global variables
import { expInfo } from "../settings";
let { TIMING } = expInfo;
import { SCREEN_INFO, BUTTON_INFO } from "../task-fun/text";
import { jsPsych } from "../jsp";

// display a cue screen with a countdown timer.
export const trial_start_screen = {
  type: htmlButtonResponse,
  stimulus: function () {
    return `<div class="fb-text">
    ${SCREEN_INFO.startTrialButton[expInfo.LANG]}
    <br>
    <br>
  </div>`;
  },
  choices: function () {
    return BUTTON_INFO.continueButton[expInfo.LANG]; // continue button
  }, 
  trial_duration: TIMING.START, // Time to wait before automatically proceeding with the next trial.
  post_trial_gap: 1000, // forced inter-trial interval after participant's response.
  on_load: function () {
    let time = convertTime(TIMING.START, "ms", "s");
    //@ts-ignore
    countDownTimer(time, "clock", jsPsych);
  },
  on_finish: function () {},
};
