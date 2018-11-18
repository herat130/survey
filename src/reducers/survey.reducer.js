import * as survey from '../utils/survey.constant';

export const initialState = {
  loading: true,
  error: false,
  questionnaire: {},
  userTravrseQuetions: [0], // because of the jumps,i created this array for maintaining previous quetion [path]
  currentOptionIndex: 0, // quetions array index
};

export default function (state = initialState, action) {
  let questions;
  let movingIndex;
  let updatedQuestionnaire;
  switch ((action || {}).type) {
    case survey.FETCH_START:
      return Object.assign({}, state, { loading: true, error: false });
    case survey.FETCH_SUCCESS:
      return Object.assign({}, state, { loading: false, questionnaire: action.payload.questionnaire });
    case survey.FETCH_FAIL:
      return Object.assign({}, state, { error: true, loading: false });
    case survey.UPDATE_ANSWERS:
      questions = [...state.questionnaire.questions];
      questions[state.currentOptionIndex].choices = action.payload.choices;
      questions[state.currentOptionIndex].input = action.payload.input;
      updatedQuestionnaire = Object.assign({}, state.questionnaire, { questions });

      return Object.assign({}, state, {
        questionnaire: updatedQuestionnaire
      });
    case survey.GO_TO_NEXT_QUETION:
      if (state.userTravrseQuetions.indexOf(action.payload.index) === -1) {
        // incase of user change an option for jump quetions then we have to maintain history with sequence
        // not just push we need to insert as per sequence
        state.userTravrseQuetions.push(action.payload.index)
        state.userTravrseQuetions.sort((a, b) => a - b);
      }
      return Object.assign({}, state, {
        currentOptionIndex: action.payload.index,
        userTravrseQuetions: state.userTravrseQuetions,
      });
    case survey.GO_TO_PREVIOUS_QUETION:
      movingIndex = state.userTravrseQuetions.findIndex(v => v === state.currentOptionIndex) - 1;
      return Object.assign({}, state, {
        currentOptionIndex: state.userTravrseQuetions[movingIndex],
      });
    case survey.SUBMIT_FORM:
      return Object.assign({}, initialState);
    default:
      return state;
  }
}