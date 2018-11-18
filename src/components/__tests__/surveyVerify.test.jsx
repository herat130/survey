import React from 'react';
import { configure, mount } from 'enzyme';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import { HashRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import { ConnectedVerifyComponent } from '../VerifySurveyComponent';
import data, { questionsAns } from '../__mocks__/survey.data';

configure({ adapter: new Adapter() });

let wrapper;
const middleWare = [thunk];
const mockStore = configureStore(middleWare);
const initialData = data;
initialData.questionnaire.questions = questionsAns;

const store = mockStore({ surveyReducer: initialData });
describe('verify survey form test suits', () => {
  it('should render correctly', () => {
    wrapper = mount(
      <Provider store={store}>
        <HashRouter>
          <ConnectedVerifyComponent />
        </HashRouter>
      </Provider>);
    expect(wrapper.find('.qtn-ans').length).toBe(questionsAns.filter(v => !!v.input).length);
  });

  it('should have submit button', () => {
    wrapper = mount(
      <Provider store={store}>
        <HashRouter>
          <ConnectedVerifyComponent />
        </HashRouter>
      </Provider>);
      // console.log(wrapper.debug());
    expect(wrapper.find('.button').length).toBe(1);
  });
});