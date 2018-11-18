import fetchWrapper from "../utils/fetchWrapper";
import * as survey from '../utils/survey.constant';

export function surveyFetchStart() {
  return { type: survey.FETCH_START }
}

export function surveyFetchSuccess(response) {
  return {
    type: survey.FETCH_SUCCESS,
    payload: response,
  }
}

export function surveyFetchFail(error) {
  return {
    type: survey.FETCH_FAIL,
    payload: error
  }
}

export const surveyFetch = () => fetchWrapper('http://localhost:9000/json/questionnaire.json')
  .then(response => surveyFetchSuccess(response))
  .catch(error => surveyFetchFail(error.message))

export function goToNextQuetion(index, choices, input) {
  return {
    type: survey.GO_TO_NEXT_QUETION,
    payload: { index, choices, input },
  };
}

export function goToPreviousQuetion(currentIndex) {
  return {
    type: survey.GO_TO_PREVIOUS_QUETION,
    payload: currentIndex - 1,
  };
}
export function updateAnswers(index, choices, input) {
  return {
    type: survey.UPDATE_ANSWERS,
    payload: { index, choices, input }
  }
}

export function clearStore() {
  return {
    type: survey.CLEAR_STORE,
  }
}

export function submitForm() {
  return {
    type: survey.SUBMIT_FORM,
  }
}