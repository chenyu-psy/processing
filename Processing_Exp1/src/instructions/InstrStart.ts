import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import { varSystem } from "../settings";


export function createBlockInstruction(
  question: string,
  paradigm: string,
  condition: string,
) {

  const imgPath = `assets/images/instruction/${paradigm}-${condition}-${question}.jpeg`;

  const block_instr_screen = {
    type: htmlButtonResponse,
    stimulus: `<div class="image">
      <img src=${imgPath} width=${Math.min(1920, varSystem.CANVAS_WIDTH)}></img>
      </div>`,
    choices: ["Continue"],
  };

  return block_instr_screen;

}


export const exp_start_screen = {
  type: htmlButtonResponse,
  stimulus: `<div class='main'>
        <h1 class='title'>Experiment</h1>
        <p class='fb-text'>Good job! Now we will start running the experiment. </p>
      </div>`,
  choices: ["Continue"],
};

export const pra_instr_screen = {
  type: htmlButtonResponse,
  stimulus: `<div class='main'>
        <h1 class='title'>Practice</h1>
        <p class='fb-text'>We will do some practice to get familiar with the experiment</p>
      </div>`,
  choices: ["Continue"],
};