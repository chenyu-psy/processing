import survey from "@jspsych/plugin-survey";
import "@jspsych/plugin-survey/css/survey.css";

import { expInfo, varSystem } from "../settings";
import { SURVEY_INFO, BUTTON_INFO } from "../task-fun/text";
import { title } from "process";



function gen_survey_content(lang: string) { 

  let elementList: any[] = [];
  
  let custom_style = {
    type: "html",
    name: "customStyles",
    html: `<style>
                .sd-root-modern {
                    max-width: 1200px !important;
                    margin: 0 auto !important;
                    width: 100% !important;
                    padding: 20px;
                }
            </style>`,
  };

  let description = {
    type: "html",
    name: "description",
    html: SURVEY_INFO.DESCRIPTION[lang]
  }

  let age_question = {
    type: "text",
    title: SURVEY_INFO.AGE_QUES[lang],
    name: "age",
    isRequired: true,
    inputType: "number",
    min: 18,
    max: 35,
  }

  let sex_question = {
    type: "radiogroup",
    title: SURVEY_INFO.SEX_QUES[lang],
    name: "sex",
    isRequired: true,
    choices: SURVEY_INFO.SEX_OPT[lang]
  }

  let judgement_frequency = {
    type: "rating",
    title: SURVEY_INFO.JUDGE_FREQ_QUES[lang],
    minRateDescription: SURVEY_INFO.JUDGE_FREQ_MARKS[lang][0],
    maxRateDescription: SURVEY_INFO.JUDGE_FREQ_MARKS[lang][1],
    displayMode: "stars",
    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    isRequired: true,
  };

  let judgement_difficulty = {
    type: "rating",
    title: SURVEY_INFO.JUDGE_DIFF_QUES[lang],
    minRateDescription: SURVEY_INFO.JUDGE_DIFF_MARKS[lang][0],
    maxRateDescription: SURVEY_INFO.JUDGE_DIFF_MARKS[lang][1],
    displayMode: "stars",
    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    isRequired: true,
  };

  let aid_use = {
    type: "radiogroup",
    title: SURVEY_INFO.AID_USE_QUES[lang],
    name: "aid",
    isRequired: true,
    choices: SURVEY_INFO.AID_USE_OPT[lang]
  };

  let attention = {
    type: "radiogroup",
    title: SURVEY_INFO.ATTENTION_QUES[lang],
    name: "attention",
    isRequired: true,
    choices: SURVEY_INFO.ATTENTION_OPT[lang]
  };

  let comments = {
    type: "comment",
    title: SURVEY_INFO.COMMENT_QUES[lang],
    name: "comments",
    isRequired: false
  };

  elementList.push(custom_style);
  elementList.push(description);
  elementList.push(age_question);
  elementList.push(sex_question);
  elementList.push(judgement_frequency);
  elementList.push(judgement_difficulty);
  elementList.push(aid_use);
  elementList.push(attention);
  elementList.push(comments);

  return elementList;
}


export const survey_screen = {
  type: survey,
  survey_json: {
    title: SURVEY_INFO.TITLE_INFO[expInfo.LANG],
    pages: {
      elements: gen_survey_content(expInfo.LANG)
    }
  },
  data: {
    screenID: "survey"
  },
  on_load: function () {
    varSystem.TRACK = false;
  },
};











const ExperimentInfo = [


  {
    type: "multi-choice",
    prompt:
      "Did you use any aids (e.g., pencil-and-paper or computer files) to improve your memory performance?",
    name: "aid",
    options: ["Yes, I did ", "No, I did not use any aid"],
    required: true,
  },
  {
    type: "multi-choice",
    prompt:
      "Were you able to work through the experiment concentrated and without distraction?",
    name: "attention",
    options: ["Yes, I was", "No, I was distracted by something"],
    required: true,
  },
  {
    type: "text",
    prompt: "Do you have some comments about the experiments?",
    name: "comments",
    textbox_rows: 5,
    required: false,
  },
];
