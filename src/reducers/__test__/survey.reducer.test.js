import surveyReducer, { initialState } from '../survey.reducer';
import * as survey from '../../utils/survey.constant';
import mockData from '../../components/__mocks__/survey.data';

const initialStateData = initialState;
describe('test complete reducer', () => {

  it('should return initial state', () => {
    expect(surveyReducer()).toEqual(initialStateData);
  });

  it('should not affect state', () => {
    expect(surveyReducer(undefined, { type: 'NOT_EXISTING' })).toEqual(initialStateData);
  });

  it('start survey action', () => {
    const action = {
      type: survey.FETCH_START,
    }
    expect(surveyReducer(initialStateData, action).loading).toEqual(true);
  });

  it('survey success action', () => {
    const action = {
      type: survey.FETCH_SUCCESS,
      payload: { questionnaire: mockData.questionnaire },
    };
    const reducerObj = surveyReducer(initialStateData, action);
    expect(reducerObj.loading).toEqual(false);
    expect(reducerObj.error).toEqual(false);
    expect(reducerObj.questionnaire).toEqual(mockData.questionnaire);
  });

  it('always start with first quetions', () => {
    expect(initialStateData.currentOptionIndex).toBe(0);
  });

})