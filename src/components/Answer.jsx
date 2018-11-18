import React from 'react';
import classnames from 'classnames';
import MultipleChoice from './MultipleChoice';
import InputAnswer from './InputAnswer';

export default class Answer extends React.Component {

  renderAnsComponent() {
    const { type, multiple, multiline, choices, input } = this.props;
    let componentToBeRender;
    if (type === 'multiple-choice' && choices.length > 0) {
      // considering multiple property true should be checkbox option
      // considering multiple property false should be radio option
      componentToBeRender = <MultipleChoice
        handleChangeOptions={this.props.handleChangeOptions}
        type={!multiple ? 'radio' : 'checkbox'}
        choices={choices}
      />
    } else if (type === 'text') {
      // considering multiline property true should be textarea option
      // considering multilie property false should be text option
      componentToBeRender = <InputAnswer
        type={!multiline ? 'text' : 'textarea'}
        input={input}
        handleChangeOptions={this.props.handleChangeOptions}
      />;
    }
    return componentToBeRender;
  }

  render() {
    const { question, questionIndex, ansError } = this.props;
    const oddIndex = questionIndex % 2 !== 0;
    const eventIndex = questionIndex % 2 === 0
    const answerComponent = this.renderAnsComponent();
    return (
      <div className={classnames("answer-container", { odd: oddIndex }, { even: eventIndex })}>
        {ansError ? <div className="error-ans">{ansError}<div className="blank-space-10" /></div> : false}
        <h3>{question} </h3>
        {answerComponent}
      </div>
    );
  }
}