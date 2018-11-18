import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { questions3 } from '../__mocks__/survey.data';
import MultipleChoice from '../MultipleChoice';

configure({ adapter: new Adapter() });

let propsData;
let wrapper;

describe('multiple choice should render correctly', () => {
  beforeEach(() => {
    propsData = {
      handleChangeOptions: jest.fn(),
    }
  });
  it('should render with proper data', () => {
    propsData.choices = questions3[0].choices;
    wrapper = shallow(<MultipleChoice {...propsData} />);
    expect(wrapper.find('.option-container').length).toBe(propsData.choices.length);
  });

  it('on simulate click should call propdata function', () => {
    propsData.choices = questions3[0].choices;
    wrapper = shallow(<MultipleChoice {...propsData} />);
    const simulateElement = (wrapper.find('input').at(0));
    simulateElement.simulate('change');
    wrapper.update();
    expect(propsData.handleChangeOptions).toBeCalled()
  });


  it('if selected alreay given then test behaviour', () => {
    propsData.choices = questions3[0].choices;
    propsData.choices[0].selected = true;
    wrapper = shallow(<MultipleChoice {...propsData} />);
    expect(wrapper.find('input').get(0).props.checked).toBe(true);    
    expect(wrapper.find('.active-container').length).toBe(1);
  });
});